// Admin login: credentials come from the ADMIN_USERNAME / ADMIN_PASSWORD
// environment variables. After logging in, the admin gets a signed session
// cookie. If either variable is missing, nobody can log in (fails closed).
//
// Uses only Web Crypto so it runs in both proxy.ts and server actions.

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8; // stay logged in for 8 hours

const encoder = new TextEncoder();

// Constant-time string comparison so response timing doesn't leak secrets.
const safeEqual = (a: string, b: string): boolean => {
    let mismatch = a.length ^ b.length;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return mismatch === 0;
};

// Sessions are signed with the admin credentials, so changing the password
// logs out every existing session.
const getSigningSecret = (): string | null => {
    const user = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    return user && password ? `${user}:${password}` : null;
};

const sign = async (value: string, secret: string): Promise<string> => {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
    return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('');
};

export const checkAdminCredentials = (user: string, password: string): boolean => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPassword) return false;
    // Evaluate both comparisons so timing doesn't reveal which one failed.
    const userOk = safeEqual(user, expectedUser);
    const passwordOk = safeEqual(password, expectedPassword);
    return userOk && passwordOk;
};

// Token format: "<expiry unix seconds>.<hmac of expiry>"
export const createAdminSessionToken = async (): Promise<string | null> => {
    const secret = getSigningSecret();
    if (!secret) return null;
    const expiry = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
    return `${expiry}.${await sign(expiry, secret)}`;
};

export const isValidAdminSession = async (token: string | undefined): Promise<boolean> => {
    const secret = getSigningSecret();
    if (!secret || !token) return false;
    const [expiry, signature] = token.split('.');
    if (!expiry || !signature || !/^\d+$/.test(expiry)) return false;
    if (Number(expiry) < Date.now() / 1000) return false;
    return safeEqual(signature, await sign(expiry, secret));
};
