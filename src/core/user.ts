"use server";

import { redirect } from "next/navigation";
import { removeAuthFromSession } from "./session";

export const logOutUser = async () => {
    await removeAuthFromSession();
    redirect("/");
}