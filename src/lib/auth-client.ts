import { emailVerificationProtocolClient } from "better-auth-evp/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  plugins: [emailVerificationProtocolClient()],
});

export const { signOut, useSession } = authClient;
