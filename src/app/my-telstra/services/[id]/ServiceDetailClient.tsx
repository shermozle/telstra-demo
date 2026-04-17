"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";

export function ServiceDetailClient({ id }: { id: string }) {
  const services = useDemoStore((s) => s.services);
  const svc = services.find((x) => x.id === id);

  useEffect(() => {
    if (!svc) return;
    track("Service Viewed", {
      service_type: svc.type,
      service_nickname: svc.nickname,
      plan_name: svc.plan.name,
    });
    track("Usage Checked", {
      service_type: svc.type,
      data_used_pct: Math.round(
        (svc.plan.dataUsedGB / Math.max(1, svc.plan.dataAllowanceGB)) * 100
      ),
      days_remaining: svc.plan.billingCycleDaysLeft,
    });
  }, [svc]);

  if (!svc) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/my-telstra/services" className="text-sm text-telstra-blue">
        ← Services
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{svc.nickname}</h1>
      <p className="text-gray-600">{svc.phoneNumber}</p>

      <Tabs.Root defaultValue="summary" className="mt-8">
        <Tabs.List className="flex gap-2 border-b">
          <Tabs.Trigger
            value="summary"
            className="border-b-2 border-transparent px-4 py-2 data-[state=active]:border-telstra-blue"
          >
            Summary
          </Tabs.Trigger>
          <Tabs.Trigger
            value="extras"
            className="border-b-2 border-transparent px-4 py-2 data-[state=active]:border-telstra-blue"
          >
            Extras
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="summary" className="mt-6 space-y-6">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="font-bold">Usage & plan</h2>
            <p className="mt-2 text-sm">
              {svc.plan.dataUsedGB}GB of {svc.plan.dataAllowanceGB || "∞"}GB
              used — {svc.plan.billingCycleDaysLeft} days left in cycle
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-telstra-blue">
              <Link href={`/my-telstra/services/${svc.id}/usage`}>
                Usage History →
              </Link>
              <Link href={`/my-telstra/services/${svc.id}/plan`}>
                View or manage your plan →
              </Link>
            </div>
          </section>
          {svc.type === "postpaid-mobile" && (
            <section className="rounded-xl border bg-white p-6">
              <h2 className="font-bold">International calls</h2>
              <p className="text-sm">0min of 30mins used — 30mins left</p>
              <p className="text-xs text-gray-500">
                Resets in {svc.plan.billingCycleDaysLeft} days
              </p>
            </section>
          )}
          {svc.device && (
            <section className="rounded-xl border bg-white p-6">
              <h2 className="font-bold">Your device</h2>
              <p>{svc.device.name}</p>
              <p className="text-sm text-gray-600">
                {svc.device.repaymentsMade} of {svc.device.repaymentsTotal}{" "}
                repayments made
              </p>
            </section>
          )}
          <div className="text-sm">
            <Link href="/trade-in" className="text-telstra-blue">
              Trade in an old device →
            </Link>
          </div>
        </Tabs.Content>
        <Tabs.Content value="extras" className="mt-6 space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="font-semibold">International Roaming</p>
            <p className="text-sm text-gray-600">
              Use overseas in 80+ destinations
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="font-semibold">Subscriptions</p>
            <ul className="mt-2 text-sm">
              {["Spotify Premium", "Kayo", "Disney+"].map((x) => (
                <li key={x}>{x} →</li>
              ))}
            </ul>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
