"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TRADE_IN_MODELS, estimateTradeIn } from "@/data/trade-in";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";

export default function TradeInPage() {
  const router = useRouter();
  const addCartItem = useDemoStore((s) => s.addCartItem);

  const [deviceType, setDeviceType] = useState<
    "phone" | "tablet" | "watch" | null
  >(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [storage, setStorage] = useState("128GB");
  const [condition, setCondition] = useState<"good" | "damaged" | null>(null);

  const est =
    modelId && condition
      ? estimateTradeIn(
          modelId,
          storage.includes("512") || storage.includes("1TB") ? 1.1 : 1,
          condition
        )
      : null;

  function applyToCart() {
    if (!est || !modelId || !deviceType || !condition) {
      toast.error("Complete all steps");
      return;
    }
    const credit = Math.round((est.min + est.max) / 2);
    const label = TRADE_IN_MODELS.find((m) => m.id === modelId)?.label ?? "";
    track("Trade-In Completed", {
      device_model: label,
      condition,
      estimated_value: credit,
    });
    track("Trade-In Applied to Cart", { credit_amount: credit });
    addCartItem({
      type: "device-plan",
      title: `Trade-in: ${label}`,
      repaymentTermMonths: 24,
      addOns: [],
      tradeInCredit: credit,
    });
    toast.success("Trade-in credit added to cart");
    router.push("/shop/cart");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-telstra-dark">Trade-in estimator</h1>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-semibold">1. Device type</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["phone", "tablet", "watch"] as const).map((t) => (
              <Button
                key={t}
                type="button"
                variant={deviceType === t ? "primary" : "secondary"}
                onClick={() => {
                  setDeviceType(t);
                  track("Trade-In Started", { device_type: t });
                }}
              >
                {t}
              </Button>
            ))}
          </div>
        </section>

        {deviceType && (
          <section>
            <h2 className="font-semibold">2. Model</h2>
            <select
              className="mt-2 w-full rounded border px-3 py-2"
              value={modelId ?? ""}
              onChange={(e) => setModelId(e.target.value || null)}
            >
              <option value="">Select…</option>
              {TRADE_IN_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </section>
        )}

        {modelId && (
          <section>
            <h2 className="font-semibold">3. Storage</h2>
            <select
              className="mt-2 w-full rounded border px-3 py-2"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            >
              {["64GB", "128GB", "256GB", "512GB", "1TB"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </section>
        )}

        {modelId && (
          <section>
            <h2 className="font-semibold">4. Condition</h2>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant={condition === "good" ? "primary" : "secondary"}
                onClick={() => setCondition("good")}
              >
                Good
              </Button>
              <Button
                type="button"
                variant={condition === "damaged" ? "primary" : "secondary"}
                onClick={() => setCondition("damaged")}
              >
                Damaged
              </Button>
            </div>
          </section>
        )}

        {est && (
          <div className="rounded-xl border-2 border-telstra-green bg-green-50 p-6">
            <p className="text-lg font-bold text-telstra-dark">
              Estimated credit: ${est.min} — ${est.max}
            </p>
            <Button type="button" className="mt-4" onClick={applyToCart}>
              Apply to cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
