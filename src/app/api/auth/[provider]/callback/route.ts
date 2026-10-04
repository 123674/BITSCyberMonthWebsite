import { createUserResponseSession, getOAuthFromSession, removeOAuthFromSession } from "@/core/session";
import { blindIndexGenerator, encryptElement } from "@/func/encryptionHandlers";
import { EMAIL_INDEX_HMAC_KEY } from "@/lib/contants";
import { logOAuthUser } from "@/lib/db";
import OAuthProviders, { AllowedOAuthProvidersSchema } from "@/lib/oauth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UserProfileForGoogleSchema = z.object({
    sub: z.string(),
    name: z.string(),
    picture: z.url(),
    email_verified: z.boolean(),
    email: z.email(),
})


const UserDataFromDBForGoogleSchema = z.object({
    adminID: z.string(),
    emailVerified: z.boolean(),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
    const rawProv = request.url.split(/[/?]/)[5];
    console.log("raw prov", rawProv)
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const states = searchParams.get("state");
    const [, callbackUrl] = states!.split("|");
    const error = searchParams.get("error");

    const storedState = await getOAuthFromSession();
    const parsedProv = AllowedOAuthProvidersSchema.safeParse(rawProv);
    console.log("Req Url", request.url);
    if (!parsedProv.success) {
        console.log("invalid Providor for OAuth callback URL :", parsedProv.error);
        return NextResponse.redirect(new URL(`/signin?error=invalid_provider&callbackUrl=${callbackUrl}`, request.url));

    }
    const prov = parsedProv.data;

    if (!states || states !== storedState) {
        console.log("Stored States", states, storedState);
        console.log('new url')
        return NextResponse.redirect(new URL(`${OAuthProviders[prov].errorUrl}?error=invalid_state&callbackUrl=${callbackUrl}`, request.url));
    }
    if (!code) {
        return NextResponse.redirect(new URL(`${OAuthProviders[prov].errorUrl}?error=invalid_code&callbackUrl=${callbackUrl}`, request.url));
    }
    if (error) {
        return NextResponse.redirect(new URL(`${OAuthProviders[prov].errorUrl}?error=${error}&callbackUrl=${callbackUrl}`, request.url));
    }

    try {
        // Exchange Code for tokens
        const tokenParam = OAuthProviders[prov].tokenParams
        tokenParam.code = code;
        const tokenRes = await fetch(OAuthProviders[prov].tokenUrl, {
            method: "POST",
            headers: OAuthProviders[prov].tokenHeaders,
            body: new URLSearchParams(tokenParam),
        });
        const tokens = await tokenRes.json();
        //  Google can return an error for expired or wrong credentials
        if (!tokenRes.ok) throw new Error(tokens.error_description || "Token exchange failed");

        const { access_token, refresh_token, id_token } = tokens;

        const profileRes = await fetch(OAuthProviders[prov].profileUrl, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const rawProfile = await profileRes.json();
        const response = NextResponse.redirect(new URL(callbackUrl || OAuthProviders[prov].defaultCallbackURL, request.url));

        const userdata = UserProfileForGoogleSchema.parse(rawProfile);

        const emailIndex = blindIndexGenerator(userdata.email, EMAIL_INDEX_HMAC_KEY);
        const encryptedEmailObj = encryptElement(userdata.email);
        const encryptedNameObj = encryptElement(userdata.name);
        const userMetaData = {
            emailEncrypted: encryptedEmailObj.element,
            emailAuthTag: encryptedEmailObj.elementAuthTag,
            emailIv: encryptedEmailObj.elementIv,
            emailKeyVersion: encryptedEmailObj.elementKeyVersion,
            userNameEncrypted: encryptedNameObj.element,
            userNameAuthTag: encryptedNameObj.elementAuthTag,
            userNameIv: encryptedNameObj.elementIv,
            userNameKeyVersion: encryptedNameObj.elementKeyVersion,
            emailBlindIndex: emailIndex,
            emailVerified: userdata.email_verified
        }

        // const user = await logOAuthUser(userdata);
        const user = await logOAuthUser(userdata.sub, userMetaData);
        const parseUserDbData = UserDataFromDBForGoogleSchema.parse(user);
        await createUserResponseSession(parseUserDbData, response);


        await removeOAuthFromSession(response);
        return response;


    } catch (e) {
        console.log(`${prov} OAuth callback error: `, e);
        return NextResponse.redirect(new URL(`${OAuthProviders[prov].errorUrl}?error=server_error`, request.url));
    }
}