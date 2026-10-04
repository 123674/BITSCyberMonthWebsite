export const IMAGE_KIT_PUBLIC_KEY : string = process.env.IMAGE_KIT_PUBLIC_KEY ?? '';
export const IMAGE_KIT_PRIVATE_KIT : string = process.env.IMAGE_KIT_PRIVATE_KIT ?? '';
export const IMAGE_KIT_ENDPOINT : string = process.env.IMAGE_KIT_ENDPOINT ?? '';

export const IEEE_BITS_LOGO : string = '/ieee-bits-logo.png';
export const IEEE_CS_SOCIETY : string = '/ieee-cs-logo.png';

export const GOOGLE_OAUTH_CLIENT_ID:string = process.env.GOOGLE_OAUTH_CLIENT_ID ?? '';
export const GOOGLE_OAUTH_CLIENT_SECRET:string = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '';

export const OAUTH_REDIRECT_URI:string = process.env.OAUTH_REDIRECT_URI ?? '';

export const UPSTASH_REDIS_REST_AUTH_URL:string = process.env.UPSTASH_REDIS_REST_AUTH_URL ?? '';
export const UPSTASH_REDIS_REST_AUTH_TOKEN:string = process.env.UPSTASH_REDIS_REST_AUTH_TOKEN ?? '';

export const EMAIL_INDEX_HMAC_KEY:string = process.env.EMAIL_INDEX_HMAC_KEY!;
export const EMAIL_ENCRYPTION_KEYS:{key1:string,key2:string} = {key1:process.env.EMAIL_ENCRYPTION_KEY1!,key2:process.env.EMAIL_ENCRYPTION_KEY2!};

