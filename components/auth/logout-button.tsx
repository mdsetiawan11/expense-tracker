"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication/sign-in");
        },
        onRequest: (ctx) => {
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
        },
      },
    });
  }
  return (
    <DropdownMenuItem onClick={handleLogOut}>
      <LogOutIcon />
      {loading ? "Logging out..." : "Log out"}
    </DropdownMenuItem>
  );
}
