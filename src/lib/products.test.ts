import { describe, expect, it } from "vitest";
import type { Cart } from "@/types/demo";
import {
  accessoryLineItem,
  cartToProducts,
  cartTotals,
  deviceLineItem,
  internetLineItem,
} from "./products";

/** TurboDemo's hardcoded child properties, in the order the Java source lists them. */
const TURBODEMO_KEYS = [
  "brand",
  "categories",
  "department",
  "dicount_applied",
  "item_id",
  "price",
  "quantity",
];

describe("Products line items", () => {
  it("emits exactly TurboDemo's child properties", () => {
    for (const item of [
      deviceLineItem("iphone-17-pro", 74.16),
      accessoryLineItem("airpods-pro-3"),
      internetLineItem("nbn50", 90, "nbn"),
    ]) {
      expect(Object.keys(item).sort()).toEqual([...TURBODEMO_KEYS].sort());
    }
  });

  it("keeps item_id numeric and quantity an integer", () => {
    const item = deviceLineItem("galaxy-s26", 55);
    expect(typeof item.item_id).toBe("number");
    expect(Number.isInteger(item.quantity)).toBe(true);
  });

  it("reads brand off the catalog", () => {
    expect(deviceLineItem("pixel-10", 40).brand).toBe("Google");
    expect(accessoryLineItem("airpods-pro-3").brand).toBe("Apple");
    expect(internetLineItem("nbn50", 90, "nbn").brand).toBe("Telstra");
  });

  it("flags a discount when the cart carries a promo code", () => {
    const cart: Cart = {
      items: [
        {
          id: "1",
          type: "device-plan",
          title: "iPhone 17 Pro (256GB)",
          device: {
            name: "iPhone 17 Pro",
            colour: "Blue",
            storage: "256GB",
            pricePerMonth: 52.04,
            slug: "iphone-17-pro",
          },
          plan: { name: "Essential", dataGB: 50, pricePerMonth: 68 },
          addOns: [],
          repaymentTermMonths: 24,
        },
      ],
      promoCode: "ONLINE50",
      promoDiscount: 50,
      usePoints: false,
      pointsToRedeem: 0,
    };

    const [line] = cartToProducts(cart);
    expect(line.dicount_applied).toBe("Yes");
    expect(line.item_id).toBe(102);
    expect(line.price).toBeCloseTo(120.04);
  });

  it("keeps monthly and upfront totals apart", () => {
    const cart: Cart = {
      items: [
        {
          id: "1",
          type: "internet",
          title: "Standard nbn",
          addOns: [],
          repaymentTermMonths: 0,
          internetPlanName: "Standard",
          internetPricePerMonth: 90,
        },
        {
          id: "2",
          type: "accessory",
          title: "AirPods Pro (3rd gen)",
          addOns: [],
          repaymentTermMonths: 0,
          upfrontToday: 399,
        },
      ],
      usePoints: false,
      pointsToRedeem: 0,
    };

    expect(cartTotals(cart)).toEqual({ monthly: 90, upfront: 399 });
    expect(cartToProducts(cart).map((p) => p.item_id)).toEqual([302, 201]);
  });
});
