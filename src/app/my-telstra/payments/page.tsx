"use client";

import Link from "next/link";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";

export default function PaymentsPage() {
  const user = useDemoStore((s) => s.user);
  const bills = useDemoStore((s) => s.bills);
  const payments = useDemoStore((s) => s.payments);

  if (!user.isLoggedIn) {
    return (
      <div className="p-16 text-center">
        <Link href="/login" className="text-telstra-blue underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Payments</h1>

      <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-bold">Mobile & Devices / accessories</h2>
        <p className="mt-2 text-3xl font-bold text-telstra-dark">$114.52</p>
        <p className="text-sm text-gray-600">AutoPay date: 27 Apr 2026</p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded bg-blue-900 px-2 py-0.5 text-xs text-white">
            Visa
          </span>
          Visa ending in 3002
        </p>
        <div className="mt-4 flex gap-4 text-sm text-telstra-blue">
          <button type="button">View past payments →</button>
          <button type="button">Manage payment methods →</button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Bills</h2>
        <ul className="mt-2 space-y-2">
          {bills.map((b) => (
            <li
              key={b.period}
              className="flex justify-between rounded border bg-white px-4 py-3 text-sm"
            >
              <span>{b.period}</span>
              <span>${b.amount.toFixed(2)}</span>
              <button
                type="button"
                className="text-telstra-blue"
                onClick={() =>
                  track("Bill Viewed", {
                    bill_period: b.period,
                    bill_amount: b.amount,
                  })
                }
              >
                PDF
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Past payments</h2>
        <ul className="mt-2 space-y-2">
          {payments.map((p, i) => (
            <li key={i} className="rounded border bg-white px-4 py-3 text-sm">
              {p.date} — ${p.amount.toFixed(2)} — {p.method}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-dashed p-4">
        <h2 className="font-semibold">Top up / Recharge</h2>
        <p className="text-sm text-gray-600">Demo recharge flow</p>
        <button
          type="button"
          className="mt-2 text-telstra-blue"
          onClick={() =>
            track("Recharge Initiated", {
              amount: 30,
              service_type: "prepaid-mobile",
            })
          }
        >
          Recharge now →
        </button>
      </section>
    </div>
  );
}
