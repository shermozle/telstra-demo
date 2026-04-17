"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { DeviceSpec } from "@/data/devices";
import { PLAN_TIERS, ADD_ONS } from "@/data/devices";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { getEffectiveVariant } from "@/lib/amplitude";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DeviceDetail({ device }: { device: DeviceSpec }) {
  const router = useRouter();
  const addCartItem = useDemoStore((s) => s.addCartItem);
  const [colourIdx, setColourIdx] = useState(0);
  const [storageIdx, setStorageIdx] = useState(0);
  const [planMode, setPlanMode] = useState<"plan" | "outright">("plan");
  const [planId, setPlanId] = useState<string>("essential");
  const [term, setTerm] = useState<12 | 24 | 36>(24);
  const [addOns, setAddOns] = useState<Record<string, boolean>>({});

  const colour = device.colours[colourIdx];
  const storage = device.storages[storageIdx];
  const plan = PLAN_TIERS.find((p) => p.id === planId) ?? PLAN_TIERS[1];

  useEffect(() => {
    track("Product Viewed", {
      product_name: device.name,
      product_brand: device.brand,
      product_category: "mobiles-on-a-plan",
      product_price: device.pricePerMonth24,
      product_id: device.slug,
    });
  }, [device]);

  const deviceMonthly = useMemo(() => {
    const base = device.pricePerMonth24;
    const extra = storage.priceAddPerMonth;
    const scale = term === 12 ? 2 : term === 36 ? 0.67 : 1;
    return (base + extra) * scale;
  }, [device, storage, term]);

  const addOnMonthly = ADD_ONS.filter((a) => addOns[a.name]).reduce(
    (s, a) => s + a.pricePerMonth,
    0
  );

  const totalMonthly =
    planMode === "plan"
      ? deviceMonthly + plan.pricePerMonth + addOnMonthly
      : 0;

  const { value: tradeInProminence } = getEffectiveVariant(
    "trade-in-prominence",
    "standard"
  );

  function toggleAddOn(name: string, price: number, on: boolean) {
    setAddOns((prev) => ({ ...prev, [name]: on }));
    track("Add-On Toggled", {
      addon_name: name,
      addon_price: price,
      action: on ? "added" : "removed",
    });
  }

  function addToCart() {
    if (planMode === "outright") {
      toast.info("Outright purchase — add to cart as demo monthly flow.");
    }
    addCartItem({
      type: "device-plan",
      title: `${device.name} (${storage.label})`,
      device: {
        name: device.name,
        colour: colour.name,
        storage: storage.label,
        pricePerMonth: deviceMonthly,
        slug: device.slug,
      },
      plan: {
        name: plan.name,
        dataGB: plan.dataGB,
        pricePerMonth: plan.pricePerMonth,
      },
      addOns: ADD_ONS.filter((a) => addOns[a.name]).map((a) => ({
        name: a.name,
        pricePerMonth: a.pricePerMonth,
      })),
      repaymentTermMonths: term,
    });
    track("Add to Cart", {
      product_name: device.name,
      product_category: "mobiles-on-a-plan",
      plan_name: plan.name,
      monthly_total: totalMonthly,
      cart_value: totalMonthly,
    });
    toast.success("Added to cart");
    router.push("/shop/cart");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="mb-4 flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 ring-1 ring-neutral-200"
            style={{ boxShadow: `inset 0 0 0 1px ${colour.hex}33` }}
          >
            <img
              src={device.heroImage}
              alt={device.name}
              className="h-full w-full object-contain p-6"
            />
          </div>
          <div className="flex gap-2">
            {device.colours.map((c, i) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                className={cn(
                  "h-10 w-10 rounded-full border-2",
                  i === colourIdx ? "border-telstra-blue" : "border-gray-200"
                )}
                style={{ backgroundColor: c.hex }}
                onClick={() => {
                  setColourIdx(i);
                  track("Product Colour Selected", {
                    product_name: device.name,
                    colour: c.name,
                  });
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-telstra-dark">{device.name}</h1>
          <p className="mt-2 text-xl text-telstra-blue">
            From ${device.pricePerMonth24.toFixed(2)}/mth on a plan
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Storage</p>
            <div className="flex flex-wrap gap-2">
              {device.storages.map((st, i) => (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => {
                    setStorageIdx(i);
                    track("Product Storage Selected", {
                      product_name: device.name,
                      storage: st.label,
                      price_change: st.priceAddPerMonth,
                    });
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm",
                    i === storageIdx
                      ? "border-telstra-blue bg-blue-50"
                      : "border-gray-200"
                  )}
                >
                  {st.label}
                  {st.priceAddPerMonth > 0 &&
                    ` +$${st.priceAddPerMonth.toFixed(2)}/mth`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              type="button"
              variant={planMode === "plan" ? "primary" : "secondary"}
              onClick={() => setPlanMode("plan")}
            >
              On a plan
            </Button>
            <Button
              type="button"
              variant={planMode === "outright" ? "primary" : "secondary"}
              onClick={() => setPlanMode("outright")}
            >
              Outright
            </Button>
          </div>

          {planMode === "plan" && (
            <>
              <div className="mt-6">
                <p className="mb-2 font-semibold">Choose a plan</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {PLAN_TIERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPlanId(p.id);
                        track("Plan Selected", {
                          plan_name: p.name,
                          plan_type: "mobile",
                          plan_price: p.pricePerMonth,
                          data_allowance: p.dataGB,
                          context: "new_purchase",
                        });
                        track("Plan Viewed", {
                          plan_name: p.name,
                          plan_type: "mobile",
                          plan_price: p.pricePerMonth,
                          data_allowance: p.dataGB,
                        });
                      }}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition hover:scale-[1.02]",
                        planId === p.id
                          ? "border-telstra-blue shadow-md"
                          : "border-gray-200"
                      )}
                    >
                      {p.tag && (
                        <span className="mb-1 inline-block rounded bg-telstra-blue px-2 py-0.5 text-xs text-white">
                          {p.tag}
                        </span>
                      )}
                      <p className="font-bold">{p.name}</p>
                      <p className="text-lg text-telstra-blue">
                        ${p.pricePerMonth}/mth
                      </p>
                      <p className="text-sm text-gray-600">{p.dataGB}GB data</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Standard national calls & SMS
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Repayment term</p>
                <div className="flex gap-2">
                  {([12, 24, 36] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm",
                        term === m ? "border-telstra-blue bg-blue-50" : ""
                      )}
                      onClick={() => {
                        setTerm(m);
                        track("Plan Term Changed", {
                          plan_name: plan.name,
                          old_term: term,
                          new_term: m,
                        });
                      }}
                    >
                      {m} months
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-telstra-grey p-4">
                <p className="text-sm text-gray-600">Monthly total</p>
                <p className="text-2xl font-bold text-telstra-dark">
                  ${totalMonthly.toFixed(2)}/mth
                </p>
                <p className="text-xs text-gray-500">
                  Device ${deviceMonthly.toFixed(2)} + Plan $
                  {plan.pricePerMonth}
                  {addOnMonthly > 0 && ` + Add-ons $${addOnMonthly.toFixed(2)}`}
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <p className="font-semibold">Add-ons</p>
                {ADD_ONS.map((a) => (
                  <label
                    key={a.name}
                    className="flex cursor-pointer items-center justify-between rounded border bg-white px-3 py-2 text-sm"
                  >
                    <span>
                      {a.name}
                      {a.pricePerMonth > 0 && (
                        <span className="text-gray-500">
                          {" "}
                          +${a.pricePerMonth}/mth
                        </span>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!addOns[a.name]}
                      onChange={(e) =>
                        toggleAddOn(a.name, a.pricePerMonth, e.target.checked)
                      }
                    />
                  </label>
                ))}
              </div>
            </>
          )}

          <div
            className={cn(
              "mt-6",
              tradeInProminence === "floating-banner" &&
                "lg:sticky lg:top-24"
            )}
          >
            <Link
              href="/trade-in"
              className="mb-4 block rounded-lg border border-dashed border-telstra-blue bg-blue-50 px-4 py-3 text-sm font-medium text-telstra-blue"
              onClick={() => track("Trade-In Started", { device_type: "phone" })}
            >
              Trade in your old phone and save →
            </Link>
            <Button
              type="button"
              className="w-full py-6 text-lg"
              onClick={addToCart}
            >
              Add to cart
            </Button>
          </div>

          <Accordion.Root type="multiple" className="mt-10">
            <Accordion.Item value="specs" className="border-b">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left font-semibold">
                  Specifications <ChevronDown className="h-4 w-4" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-sm text-gray-600">
                Display, Camera, Battery, Processor, 5G, Dimensions — demo
                placeholders.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="tynk" className="border-b">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left font-semibold">
                  Things you need to know{" "}
                  <ChevronDown className="h-4 w-4" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-sm text-gray-600">
                Minimum cost over term, plan inclusions, and cooling-off — demo
                copy only.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}
