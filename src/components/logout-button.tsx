"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => {
        void authClient.signOut().then(() => {
          router.push("/login");
          router.refresh();
        });
      }}
    >
      Sign out
    </Button>
  );
}
