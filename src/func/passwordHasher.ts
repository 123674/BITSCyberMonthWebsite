import crypto from 'crypto';

export const generateRandomNumber = (bytes = 16): string => {
  return crypto.randomBytes(bytes).toString("hex").normalize();

}