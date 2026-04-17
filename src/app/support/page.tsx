"use client";

import Link from "next/link";
import { track } from "@/lib/track";

const TILES = [
  ["accounts-payments", "Accounts & payments"],
  ["internet-home-phone", "Internet & home phone"],
  ["prepaid", "Pre-Paid"],
  ["mobiles", "Mobiles"],
  ["telstra-mail", "Telstra Mail"],
  ["entertainment", "Entertainment"],
  ["telstra-plus", "Telstra Plus"],
  ["security", "Security"],
] as const;

export default function SupportHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Support</h1>
      <input
        className="mt-6 w-full max-w-xl rounded border px-4 py-3"
        placeholder="What can we help you with?"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            track("Support Search Submitted", {
              search_term: (e.target as HTMLInputElement).value,
              results_count: 3,
            });
          }
        }}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map(([slug, label]) => (
          <Link
            key={slug}
            href={`/support/${slug}`}
            className="rounded-xl border bg-white p-6 font-medium shadow-sm hover:border-telstra-blue"
            onClick={() =>
              track("Support Page Viewed", { category: slug })
            }
          >
            {label}
          </Link>
        ))}
      </div>
      <section className="mt-12 rounded-xl bg-telstra-blue p-8 text-white">
        <h2 className="text-xl font-bold">Get help fast with My Telstra</h2>
        <p className="mt-2 text-sm text-white/90">Download the app (demo)</p>
      </section>
      <ul className="mt-8 list-inside list-disc text-sm text-gray-600">
        <li>eSIM activation</li>
        <li>Scam protection</li>
        <li>Improve home internet</li>
        <li>Family safety</li>
      </ul>
    </div>
  );
}
