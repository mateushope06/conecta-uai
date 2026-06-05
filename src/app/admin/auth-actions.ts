"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function login(_prev: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/painel",
    });
  } catch (err) {
    if (err instanceof AuthError) return { error: "E-mail ou senha incorretos, ou acesso não autorizado." };
    throw err; // re-lança o redirect interno do Next
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin" });
}
