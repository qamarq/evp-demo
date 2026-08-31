import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { emailVerificationProtocol } from "better-auth-evp";
import path from "node:path";

const db = new Database(path.join(process.cwd(), "evp-demo.db"));

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: false },
  plugins: [
    emailVerificationProtocol({
      origin: process.env.SITE_URL ?? "http://localhost:3000",
    }),
  ],
  trustedOrigins: [process.env.SITE_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
