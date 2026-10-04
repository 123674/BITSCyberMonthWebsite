import { EMAIL_ENCRYPTION_KEYS } from '@/lib/contants';
import crypto from 'crypto';

type EncryptionElementDataType = {
    element : string,
    elementAuthTag : string,
    elementIv : string,
    elementKeyVersion : number
}

// Encryption (for storage/retrieval)
export const encryptElement = (unEncryptedElement: string): EncryptionElementDataType => {
    const keyNumber = crypto.randomInt(1,3);
    const keyStr = EMAIL_ENCRYPTION_KEYS[`key${keyNumber}` as 'key1' | 'key2'] as string;
    console.log("keyst",keyStr.length)
    const iv = crypto.randomBytes(12);
    const key = Buffer.from(keyStr, 'hex');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(unEncryptedElement, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        element : encrypted.toString('base64'),
        elementAuthTag:authTag.toString('base64'),
        elementIv:iv.toString('base64'),
        elementKeyVersion:keyNumber
    }
}

export const decryptElement = (encryptedData: string,ivVal:string,keyNumber:number,authTagVal:string): string => {
    const encrypted = Buffer.from(encryptedData, 'base64');
    const iv = Buffer.from(ivVal, 'base64');
    const key = Buffer.from(EMAIL_ENCRYPTION_KEYS[`key${keyNumber}` as 'key1' | 'key2'] as string, 'hex');
    const authTag = Buffer.from(authTagVal,'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

// Blind index (for lookup)
export const blindIndexGenerator = (element: string, hmacKey: string): string => {
    const normalized = element.trim().toLowerCase();
    return crypto.createHmac('sha256', hmacKey).update(normalized).digest('hex');
}