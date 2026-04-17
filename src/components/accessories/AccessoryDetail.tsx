"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AccessorySpec } from "@/data/accessories";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";

export function AccessoryDetail({ accessory }: { accessory: AccessorySpec }) {
  const router = useRouter();
  const addCartItem = useDemoStore((s) => s.addCartItem);

  function add() {
    addCartItem({
      type: "accessory",
      title: accessory.name,
      repaymentTermMonths: 0,
      addOns: [],
      upfrontToday: accessory.price,
    });
    track("Add to Cart", {
      product_name: accessory.name,
      product_category: "accessory",
      plan_name: "n/a",
      monthly_total: 0,
      cart_value: accessory.price,
    });
    toast.success("Added to cart");
    router.push("/shop/cart");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-neutral-200">
        <img
          src={accessory.image}
          alt={accessory.name}
          className="max-h-full max-w-full object-contain p-6"
        />
      </div>
      <h1 className="mt-6 text-3xl font-bold">{accessory.name}</h1>
      <p className="text-xl text-telstra-blue">${accessory.price}</p>
      <Button type="button" className="mt-6" onClick={add}>
        Add to cart
      </Button>
    </div>
  );
}
