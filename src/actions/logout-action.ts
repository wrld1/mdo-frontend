"use server";

import { deleteTokens } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout() {
  deleteTokens();
  redirect("/login");
}
