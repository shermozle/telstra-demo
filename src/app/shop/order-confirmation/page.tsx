"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDemoStore } from "@/store/useDemoStore";

function ConfirmInner() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order") ?? "—";
  const last = useDemoStore((s) => s.lastOrderSummary);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-telstra-green text-3xl text-white">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-telstra-dark">Thank you!</h1>
      <p className="mt-2 text-gray-600">Your order number is</p>
      <p className="text-xl font-bold text-telstra-blue">{order}</p>
      {last && (
        <p className="mt-4 text-sm text-gray-600">
          Monthly total ${last.monthly.toFixed(2)}/mth · {last.items} line
          {last.items !== 1 ? "s" : ""}
        </p>
      )}
      <p className="mt-6 text-sm">
        Estimated delivery: 3–5 business days (demo).
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop/order-tracking"
          className="rounded-md border border-telstra-blue px-6 py-3 font-semibold text-telstra-blue"
        >
          Track your order
        </Link>
        <Link
          href="/my-telstra"
          className="rounded-md bg-telstra-blue px-6 py-3 font-semibold text-white"
        >
          Go to My Telstra
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading…</div>}>
      <ConfirmInner />
    </Suspense>
  );
}
