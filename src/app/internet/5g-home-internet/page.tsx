"use client";

import { useState } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { internetLineItem } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FiveGHomePage() {
  const addCartItem = useDemoStore((s) => s.addCartItem);
  const [addr, setAddr] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">5G Home Internet</h1>
      <p className="mt-2 text-gray-600">
        Plug & play — $85/mth · 1000GB · Telstra 5G Internet Modem 2 included
      </p>
      <input
        className="mt-6 w-full rounded border px-4 py-3"
        placeholder="Check your address"
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
      />
      <div className="mt-8 rounded-2xl border-2 border-telstra-blue bg-white p-8">
        <p className="text-4xl font-bold text-telstra-blue">$85/mth</p>
        <p className="mt-2 text-sm text-gray-600">1000GB data · no lock-in contract</p>
        <ul className="mt-4 list-inside list-disc text-sm">
          <li>No installation appointment</li>
          <li>5G modem included</li>
        </ul>
        <Button
          type="button"
          className="mt-6 w-full py-4"
          onClick={() => {
            addCartItem({
              type: "internet",
              title: "5G Home Internet",
              repaymentTermMonths: 0,
              addOns: [],
              internetPlanName: "5G Home",
              internetPricePerMonth: 85,
            });
            track("Add to Cart", {
              product_name: "5G Home Internet",
              product_category: "5g-home",
              plan_name: "5G Home",
              monthly_total: 85,
              cart_value: 85,
              Products: [internetLineItem("5g-home", 85, "5G Home")],
            });
            toast.success("Added to cart");
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
