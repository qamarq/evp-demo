# evp-demo

Minimal Next.js app with two screens - `/login` and `/` - where the only
sign-in method is Chrome's experimental
[Email Verification Protocol](https://developer.chrome.com/blog/email-verification-protocol-origin-trial),
via [`better-auth-evp`](https://github.com/qamarq/better-auth-evp). There is
no OTP/password fallback here on purpose - this is a demo of EVP itself, not
a production login flow.

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `BETTER_AUTH_SECRET` - any random 32+ char string
- `SITE_URL` / `NEXT_PUBLIC_SITE_URL` - the exact origin you'll run this on (must match the origin trial token below, scheme+host+port)
- `CHROME_EVP_ORIGIN_TRIAL_TOKEN` - register a token for your exact origin at https://developer.chrome.com/origintrials/#/trials/active (search "Email Verification Protocol"). Leave empty to still run the app - the login form just won't ever verify anything, since Chrome ignores the feature without a valid token for the exact origin.

Apply the SQLite schema (uses `better-sqlite3`, file created at `evp-demo.db`):

```bash
npx @better-auth/cli migrate --config src/lib/auth.ts
```

Run it:

```bash
pnpm dev
```

## Why it might still do nothing

EVP requires the *mailbox provider* to participate too - the email's domain
needs an `_email-verification` DNS TXT record pointing at an issuer, and
that issuer needs to actually support the protocol. Most domains, including
plenty of Gmail/Workspace-hosted ones, don't have this yet. If verification
always fails, check:

1. `curl -I https://<your-origin>/login | grep -i origin-trial` - is the header actually present?
2. Does the token's origin match your deployed origin exactly (scheme, host, port)?
3. `dig TXT _email-verification.<your test email's domain>` - does an issuer record even exist?
4. Are you on a Chrome build that ships the trial? (Standard stable Chrome, updated to a recent version, no flags needed for shipped trials.)

## Stack

- Next.js (App Router)
- shadcn/ui (Base UI)
- better-auth + better-auth-evp
- SQLite (`better-sqlite3`) - swap for Postgres/etc. by changing `database` in `src/lib/auth.ts` if you deploy somewhere without persistent disk
