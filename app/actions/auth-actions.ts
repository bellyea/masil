"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle(formData?: FormData) {
  const redirectTo = formData?.get("callbackUrl")?.toString() || "/";

  await signIn("google", {
    redirectTo,
  });
}

export async function logout() {
  await signOut({
    redirectTo: "/",
  });
}
