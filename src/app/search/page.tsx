"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchBody() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const results = [
    { title: "nbn plans & upgrades", href: "/internet/plans" },
    { title: "Mobile phones on a plan", href: "/mobile-phones/mobiles-on-a-plan" },
    { title: "Pay my bill", href: "/my-telstra/payments" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-bold">Results for &ldquo;{q}&rdquo;</h1>
      <ul className="mt-6 space-y-4">
        {results.map((r, i) => (
          <li key={r.href}>
            <Link href={r.href} className="text-lg text-telstra-blue hover:underline">
              {i + 1}. {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <SearchBody />
    </Suspense>
  );
}
