import { createOAuthSession } from "@/core/session";
import { generateRandomNumber } from "@/func/passwordHasher";
import OAuthProviders, { AllowedOAuthProvidersSchema } from "@/lib/oauth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const rawProv = request.url.split(/[/?]/)[5];
    const { searchParams } = new URL(request.url);
    try {
        const prov = AllowedOAuthProvidersSchema.parse(rawProv);
        const callbackUrl = searchParams.get("callbackUrl") || OAuthProviders[prov].defaultCallbackURL;
        const state = generateRandomNumber(16) + "|" + callbackUrl;
        const param = OAuthProviders[prov].params;
        param.state = state;
        const params = new URLSearchParams(param);
        const response = NextResponse.redirect(`${OAuthProviders[prov].authUrl}?${params}`);
        await createOAuthSession(response, state);
        return response; // return value is the http response to the browser
    } catch (e) {
        console.log(`Route Error for ${rawProv} OAuth : `, e)
        return NextResponse.redirect(new URL(`/signin?error=server_error`, request.url));
    }

}