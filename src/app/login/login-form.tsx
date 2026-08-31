"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ nonce }: { nonce: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "verifying" | "failed">(
    "idle",
  );
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
    <div className="flex flex-1 items-center justify-center p-4">
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
    </div>
  );
}
