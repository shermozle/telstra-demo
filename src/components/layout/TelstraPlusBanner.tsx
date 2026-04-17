"use client";

import Link from "next/link";
import { useDemoStore } from "@/store/useDemoStore";

export function TelstraPlusBanner() {
  const user = useDemoStore((s) => s.user);

  if (!user.isLoggedIn) {
    return (
      <div className="bg-gradient-to-r from-purple-900 to-telstra-blue px-4 py-2 text-center text-sm text-white">
        <span className="font-semibold">Telstra Plus</span> — Join to earn points
        on eligible purchases.{" "}
        <Link href="/login" className="underline">
          Join Telstra Plus
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-purple-900 to-telstra-blue px-4 py-2 text-sm text-white md:justify-between md:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold uppercase">
          {user.telstraPlusTier}
        </span>
        <span>
          {user.telstraPlusPoints.toLocaleString()} Points
        </span>
      </div>
      <div className="flex gap-4 text-xs font-medium underline-offset-2 md:text-sm">
        <Link href="/deals" className="hover:underline">
          Rewards
        </Link>
        <Link href="/deals" className="hover:underline">
          Tickets
        </Link>
        <Link href="/deals" className="hover:underline">
          Offers
        </Link>
      </div>
    </div>
  );
}
