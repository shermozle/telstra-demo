"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PLAN_TIERS } from "@/data/devices";
import { useDemoStore as useDemo } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PlanChangeClient({ id }: { id: string }) {
  const services = useDemo((s) => s.services);
  const updateService = useDemo((s) => s.updateService);
  const svc = services.find((x) => x.id === id);
  const [selected, setSelected] = useState<string | null>(null);

  if (!svc) notFound();

  const currentName = svc.plan.name;

  function confirm() {
    const current = useDemo.getState().services.find((x) => x.id === id);
    if (!current || !selected) return;
    const tier = PLAN_TIERS.find((t) => t.id === selected);
    if (!tier) return;
    const oldPrice = current.plan.pricePerMonth;
    updateService(id, {
      plan: {
        ...current.plan,
        name: `Upfront ${tier.name}`,
        dataAllowanceGB: tier.dataGB,
        pricePerMonth: tier.pricePerMonth,
      },
    });
    track("Plan Change Confirmed", {
      old_plan: currentName,
      new_plan: tier.name,
      price_difference: tier.pricePerMonth - oldPrice,
    });
    toast.success("Plan updated");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/my-telstra/services/${id}`} className="text-sm text-telstra-blue">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Change plan</h1>
      <p className="text-sm text-gray-600">Current: {currentName}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PLAN_TIERS.map((t) => {
          const isCurrent = currentName.includes(t.name);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelected(t.id);
                track("Plan Change Initiated", {
                  current_plan: currentName,
                  service_type: svc.type,
                });
                track("Plan Selected", {
                  plan_name: t.name,
                  plan_type: "mobile",
                  plan_price: t.pricePerMonth,
                  data_allowance: t.dataGB,
                  context: "change_plan",
                });
              }}
              className={cn(
                "rounded-xl border-2 p-4 text-left",
                selected === t.id ? "border-telstra-blue" : "border-gray-200",
                isCurrent && "ring-2 ring-telstra-green"
              )}
            >
              {isCurrent && (
                <span className="mb-1 inline-block text-xs font-bold text-telstra-green">
                  Your current plan
                </span>
              )}
              <p className="font-bold">{t.name}</p>
              <p className="text-telstra-blue">${t.pricePerMonth}/mth</p>
              <p className="text-sm text-gray-600">{t.dataGB}GB</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-8 rounded-xl border bg-white p-6">
          <p className="font-semibold">Change summary</p>
          <p className="text-sm text-gray-600">
            New plan effective next billing cycle (demo).
          </p>
          <Button type="button" className="mt-4" onClick={confirm}>
            Confirm change
          </Button>
        </div>
      )}
    </div>
  );
}
