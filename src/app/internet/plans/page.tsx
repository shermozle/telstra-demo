"use client";

import { useState } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { NBN_PLANS } from "@/data/internet";
import { track } from "@/lib/track";
import { internetLineItem } from "@/lib/products";
import { getEffectiveVariant } from "@/lib/amplitude";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NbnPlansPage() {
  const addCartItem = useDemoStore((s) => s.addCartItem);
  const [internetOnly, setInternetOnly] = useState(false);
  const { value: promoColour } = getEffectiveVariant("promo-banner-colour", "blue");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div
        className={`mb-8 rounded-xl p-4 text-center text-white ${
          promoColour === "orange" ? "bg-orange-500" : "bg-telstra-blue"
        }`}
      >
        50% off any plan for 2 months with code ONLINE50
      </div>
      <label className="mb-6 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={internetOnly}
          onChange={(e) => setInternetOnly(e.target.checked)}
        />
        Internet Only (no modem/phone — demo discount)
      </label>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {NBN_PLANS.map((p) => {
          const price = internetOnly ? p.price - 10 : p.price;
          return (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.speedLabel}</p>
              <p className="mt-4 text-3xl font-bold text-telstra-blue">
                ${price}
                <span className="text-base font-normal">/mth</span>
              </p>
              <p className="text-sm line-through text-gray-400">${p.price + 20}</p>
              <p className="mt-2 text-sm">{p.downUp}</p>
              <p className="text-xs text-gray-500">
                Typical busy speed {p.busy}
              </p>
              <ul className="mt-4 flex-1 space-y-1 text-xs text-gray-600">
                <li>Unlimited data</li>
                <li>Telstra Smart Modem</li>
                <li>Phone line</li>
              </ul>
              <Button
                type="button"
                className="mt-6 w-full"
                onClick={() => {
                  addCartItem({
                    type: "internet",
                    title: `${p.name} nbn`,
                    repaymentTermMonths: 0,
                    addOns: [],
                    internetPlanName: p.name,
                    internetPricePerMonth: price,
                  });
                  track("Plan Viewed", {
                    plan_name: p.name,
                    plan_type: "nbn",
                    plan_price: price,
                    data_allowance: 0,
                  });
                  track("Add to Cart", {
                    product_name: p.name,
                    product_category: "nbn",
                    plan_name: p.name,
                    monthly_total: price,
                    cart_value: price,
                    Products: [
                      internetLineItem(p.id, price, "nbn", internetOnly),
                    ],
                  });
                  toast.success("Added nbn plan to cart");
                }}
              >
                Add to cart
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
