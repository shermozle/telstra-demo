"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const login = useDemoStore((s) => s.login);
  const [email, setEmail] = useState("simon@example.com");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login(email, email.split("@")[0] ?? "Simon");
    track("Login Completed", { method: "password" });
    toast.success("Signed in");
    router.push("/my-telstra");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-telstra-dark">Telstra ID</h1>
      <p className="mt-2 text-sm text-gray-600">Sign in to My Telstra (demo)</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm">
          Email or username
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Any value accepted"
          />
        </label>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <div className="mt-6 space-y-2 text-sm text-telstra-blue">
        <button type="button" className="block hover:underline">
          Forgot password? (demo)
        </button>
        <button type="button" className="block hover:underline">
          Create a Telstra ID (demo)
        </button>
        <p className="text-xs text-gray-500">Passkey / biometric — visual only</p>
      </div>
    </div>
  );
}
