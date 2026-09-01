"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ nonce }: { nonce: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "verifying" | "failed">("idle");
  const [reason, setReason] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReason(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const token = formData.get("token");

    if (typeof token !== "string" || token.length === 0) {
      setStatus("failed");
      setReason("no_browser_support");
      return;
    }

    setStatus("verifying");
    const { data } = await authClient.evp.verify({ email, token, nonce });

    if (data?.verified === true) {
      router.push("/");
      router.refresh();
      return;
    }

    setStatus("failed");
    setReason(data !== null && "reason" in data ? data.reason : "unknown");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            The only sign-in method here is Chrome&apos;s experimental Email
            Verification Protocol - no password, no code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={status === "verifying"}
                  placeholder="you@gmail.com"
                />
                {status === "failed" ? (
                  <FieldError
                    errors={[
                      {
                        message: `Verification failed (${reason ?? "unknown"}). This almost always means the browser or the mailbox provider doesn't support EVP yet.`,
                      },
                    ]}
                  />
                ) : null}
              </Field>
              <input
                type="hidden"
                name="token"
                nonce={nonce}
                autoComplete="email-verification-token"
              />
              <Button type="submit" disabled={status === "verifying"}>
                {status === "verifying" ? "Verifying..." : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground w-full max-w-sm space-y-4 text-sm">
        <div className="space-y-1">
          <h2 className="text-foreground font-medium">
            What&apos;s going on here?
          </h2>
          <p>
            Typing your address lets Chrome ask your mailbox provider, behind
            the scenes, whether you&apos;re currently signed in there. If you
            are, it quietly stamps a hidden field on this form with proof of
            that - nothing is typed, copied, or clicked. Submitting the form
            just hands that proof to this app&apos;s server, which checks it
            against the mailbox provider before starting your session.
          </p>
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground font-medium">Browser support</h2>
          <p>
            Chrome only, and only for builds enrolled in the origin trial -
            regular stable Chrome won&apos;t do anything special yet.
          </p>
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground font-medium">Mailbox support</h2>
          <p>
            Gmail is the only provider live on the protocol right now, so
            non-Gmail addresses are expected to fail verification here.
          </p>
        </div>

        <p>
          Built by{" "}
          <Link
            className="text-foreground underline underline-offset-4"
            href="https://kamilmarczak.pl"
          >
            Kamil Marczak
          </Link>{" "}
          (
          <Link
            className="text-foreground underline underline-offset-4"
            href="https://github.com/qamarq"
          >
            GitHub
          </Link>
          ) on top of{" "}
          <Link
            className="text-foreground underline underline-offset-4"
            href="https://github.com/qamarq/better-auth-evp"
          >
            better-auth-evp
          </Link>{" "}
          (
          <Link
            className="text-foreground underline underline-offset-4"
            href="https://www.npmjs.com/package/better-auth-evp"
          >
            npm
          </Link>
          ), a Better Auth plugin implementing this flow.
        </p>
      </div>
    </div>
  );
}
