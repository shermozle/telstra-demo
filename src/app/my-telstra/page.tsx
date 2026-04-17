"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Service } from "@/types/demo";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";

export default function MyTelstraDashboard() {
  const user = useDemoStore((s) => s.user);
  const services = useDemoStore((s) => s.services);

  useEffect(() => {
    track("Dashboard Viewed", {
      services_count: services.length,
      telstra_plus_tier: user.telstraPlusTier,
      points_balance: user.telstraPlusPoints,
    });
  }, [user, services.length]);

  if (!user.isLoggedIn) {
    return (
      <div className="px-4 py-16 text-center">
        <p>Please sign in to view My Telstra.</p>
        <Link href="/login" className="text-telstra-blue underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-telstra-blue px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">G&apos;day, {user.firstName}</h1>
          <p className="mt-2 text-white/90">Here&apos;s your account at a glance.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div className="rounded-xl border bg-amber-50 p-4 text-sm">
          <strong>Cost of living support</strong> — See payment options and
          financial help.{" "}
          <Link href="/support/accounts-payments" className="underline">
            Learn more
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ svc }: { svc: Service }) {
  const pct =
    svc.type === "prepaid-mobile"
      ? Math.min(
          1,
          (svc.prepaidDataRemainingGB ?? 0) /
            Math.max(1, svc.plan.dataAllowanceGB || 200)
        )
      : Math.min(
          1,
          svc.plan.dataUsedGB / Math.max(1, svc.plan.dataAllowanceGB)
        );

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-bold text-telstra-dark">{svc.nickname}</h3>
      <p className="text-sm text-gray-600">{svc.phoneNumber}</p>
      {svc.type !== "nbn" && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span>Data</span>
            <span>
              {svc.type === "prepaid-mobile"
                ? `${svc.prepaidDataRemainingGB?.toFixed(1)} GB left`
                : `${svc.plan.dataUsedGB} GB of ${svc.plan.dataAllowanceGB} GB used`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-telstra-grey">
            <div
              className="h-full animate-fill-bar bg-telstra-blue"
              style={{ width: `${Math.round(pct * 100)}%` }}
            />
          </div>
        </div>
      )}
      {svc.type === "nbn" && (
        <p className="mt-4 flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-telstra-green" />
          Connected · {svc.speedTier}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-600">
        {svc.plan.billingCycleDaysLeft} days left in cycle
      </p>
      <Link
        href={`/my-telstra/services/${svc.id}`}
        className="mt-4 inline-block font-semibold text-telstra-blue"
      >
        Manage →
      </Link>
    </div>
  );
}
