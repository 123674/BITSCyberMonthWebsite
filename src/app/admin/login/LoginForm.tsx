"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginForm({ next }: { next: string }) {
    const [state, formAction, pending] = useActionState(loginAction, initialState);

    return (
        <form action={formAction} className="login-form">
            <input type="hidden" name="next" value={next} />

            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username" required autoFocus />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />

            {state.error && <p className="login-error" role="alert">{state.error}</p>}

            <button type="submit" disabled={pending}>
                {pending ? "Logging in…" : "Log in"}
            </button>
        </form>
    );
}
