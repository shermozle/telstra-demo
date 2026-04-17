"use client";

import Link from "next/link";
import { useDemoStore } from "@/store/useDemoStore";

export default function ServicesListPage() {
  const user = useDemoStore((s) => s.user);
  const services = useDemoStore((s) => s.services);

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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Your services</h1>
      <p className="text-gray-600">{user.firstName}&apos;s account</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/my-telstra/services/${s.id}`}
            className="rounded-xl border bg-white p-6 shadow-sm hover:border-telstra-blue"
          >
            <h2 className="font-bold">{s.nickname}</h2>
            <p className="text-sm text-gray-600">{s.phoneNumber}</p>
            <p className="mt-2 text-sm">{s.plan.name}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="font-semibold">Your devices and accessories</h2>
        <p className="text-sm text-telstra-blue">View repayment details →</p>
      </section>
      <section className="mt-6">
        <h2 className="font-semibold">Your subscriptions</h2>
        <p className="text-sm text-telstra-blue">Manage entertainment →</p>
      </section>
    </div>
  );
}
