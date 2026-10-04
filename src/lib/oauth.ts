import { z } from "zod";
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } from "./contants";

export const AllowedOAuthProvidersSchema = z.union([
    z.literal('google')
])

const OAuthProviders = {
    google: {
        params: {
            client_id: GOOGLE_OAUTH_CLIENT_ID,
            redirect_uri: OAUTH_REDIRECT_URI,
            response_type: "code",
            scope: "openid email profile",
            state: '',
            access_type: "offline",
            prompt: "consent",
        },
        tokenHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
        tokenParams: {
            code: '',
            client_id: GOOGLE_OAUTH_CLIENT_ID,
            client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: OAUTH_REDIRECT_URI,
            grant_type: "authorization_code",
        },
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        errorUrl: '/signin',
        profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        defaultCallbackURL: "/home"
    },
}

export default OAuthProviders;