import Link from "next/link";
import { PLAN_TIERS } from "@/data/devices";

export default function SimOnlyPlansPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">SIM only plans</h1>
      <p className="mt-2 text-gray-600">
        Bring your own device — use any Upfront plan.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PLAN_TIERS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="font-bold">{p.name}</h2>
            <p className="text-2xl text-telstra-blue">${p.pricePerMonth}/mth</p>
            <p className="text-sm text-gray-600">{p.dataGB}GB</p>
            <Link
              href="/shop/cart"
              className="mt-4 inline-block font-semibold text-telstra-blue"
            >
              Order SIM →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
