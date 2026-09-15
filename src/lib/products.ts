import type { Cart, CartItem } from "@/types/demo";
import { DEVICES } from "@/data/devices";
import { ACCESSORIES } from "@/data/accessories";

/**
 * Line item shape for Amplitude cart analysis.
 *
 * The field names and types below are copied from TurboDemo's generator
 * (`GoldenDatasetAppConfigGenerator.getEventObjectPropertiesMapping` in
 * amplitude/nova), so synthetic history and live events from this site split
 * into the same child properties under one `Products` parent.
 *
 * Do not rename anything here. In particular:
 *   - the parent property is `Products`, capital P
 *   - `dicount_applied` is misspelled in the TurboDemo source, and matching it
 *     is the point; fixing the spelling creates a second, half-empty property
 *   - `item_id` is an integer there, not a slug, so it is an integer here
 *
 * A verified TurboDemo line item, for reference:
 *   {"brand":"Ralph Lauren","categories":"Digital Content","department":"Kids",
 *    "dicount_applied":"No","item_id":94,"price":24.99,"quantity":2}
 */
export interface ProductLineItem {
  brand: string;
  categories: string;
  department: string;
  dicount_applied: "Yes" | "No";
  item_id: number;
  price: number;
  quantity: number;
}

/**
 * `price` is what the site shows the customer for that line: the monthly
 * charge on plan and internet lines, the one-off charge on accessories. The
 * array is for product mix (brand, categories, item_id); for money totals use
 * the `total_monthly` and `total_upfront` properties on Order Placed, which
 * keep the two units apart.
 */

/**
 * Stable integer ids, since TurboDemo's `item_id` is numeric. Devices are
 * 1xx, accessories 2xx, internet plans 3xx, SIM-only plans 4xx. Keep these
 * fixed once data has been ingested — renumbering orphans historical events.
 */
const ITEM_IDS: Record<string, number> = {
  "iphone-17-pro-max": 101,
  "iphone-17-pro": 102,
  "iphone-17": 103,
  "iphone-air": 104,
  "galaxy-s26-ultra": 105,
  "galaxy-s26-plus": 106,
  "galaxy-s26": 107,
  "pixel-10-pro-xl": 108,
  "pixel-10-pro": 109,
  "pixel-10": 110,
  "nokia-g42-5g": 111,
  "telstra-essential-smart-4": 112,

  "airpods-pro-3": 201,
  "samsung-galaxy-buds3": 202,
  "pixel-buds-pro": 203,
  "magsafe-charger": 204,
  "smart-modem-case": 205,
  "screen-protector-bundle": 206,

  nbn25: 301,
  nbn50: 302,
  nbn100: 303,
  nbn250: 304,
  "5g-home": 310,

  basic: 401,
  essential: 402,
  premium: 403,
};

/** 0 marks an id we don't have, which is easy to spot in a chart. */
export function itemId(key: string): number {
  return ITEM_IDS[key] ?? 0;
}

/** Accessory brands aren't in the catalog data, so read them off the name. */
function accessoryBrand(name: string): string {
  if (/airpods|magsafe/i.test(name)) return "Apple";
  if (/samsung|galaxy/i.test(name)) return "Samsung";
  if (/pixel/i.test(name)) return "Google";
  return "Telstra";
}

export function deviceLineItem(
  slug: string,
  price: number,
  discounted = false
): ProductLineItem {
  const device = DEVICES.find((d) => d.slug === slug);
  return {
    brand: device?.brand ?? "Telstra",
    categories: "Smartphone",
    department: "Mobile",
    dicount_applied: discounted ? "Yes" : "No",
    item_id: itemId(slug),
    price,
    quantity: 1,
  };
}

export function accessoryLineItem(
  slug: string,
  discounted = false
): ProductLineItem {
  const accessory = ACCESSORIES.find((a) => a.slug === slug);
  return {
    brand: accessoryBrand(accessory?.name ?? ""),
    categories: accessory?.category ?? "Accessories",
    department: "Accessories",
    dicount_applied: discounted ? "Yes" : "No",
    item_id: itemId(slug),
    price: accessory?.price ?? 0,
    quantity: 1,
  };
}

export function internetLineItem(
  planId: string,
  price: number,
  kind: "nbn" | "5G Home",
  discounted = false
): ProductLineItem {
  return {
    brand: "Telstra",
    categories: kind,
    department: "Internet",
    dicount_applied: discounted ? "Yes" : "No",
    item_id: itemId(planId),
    price,
    quantity: 1,
  };
}

/** Recurring monthly charge for one cart line, add-ons included. */
export function lineMonthly(item: CartItem): number {
  const device = item.device?.pricePerMonth ?? 0;
  const plan = item.plan?.pricePerMonth ?? 0;
  const internet = item.internetPricePerMonth ?? 0;
  const addOns = item.addOns.reduce((sum, a) => sum + a.pricePerMonth, 0);
  return device + plan + internet + addOns;
}

/** Slug for an accessory line, which the cart stores only as a title. */
function accessorySlugFor(title: string): string | undefined {
  return ACCESSORIES.find((a) => a.name === title)?.slug;
}

/** Plan id for an internet line, matched on the plan name the cart stores. */
function internetIdFor(item: CartItem): { id: string; kind: "nbn" | "5G Home" } {
  const name = item.internetPlanName ?? "";
  if (/5G/i.test(name)) return { id: "5g-home", kind: "5G Home" };
  const byName: Record<string, string> = {
    Basic: "nbn25",
    Standard: "nbn50",
    Fast: "nbn100",
    Superfast: "nbn250",
  };
  return { id: byName[name] ?? "", kind: "nbn" };
}

export function cartItemToLineItem(
  item: CartItem,
  discounted: boolean
): ProductLineItem {
  if (item.type === "accessory") {
    const slug = accessorySlugFor(item.title);
    if (slug) return accessoryLineItem(slug, discounted);
    return {
      brand: accessoryBrand(item.title),
      categories: "Accessories",
      department: "Accessories",
      dicount_applied: discounted ? "Yes" : "No",
      item_id: 0,
      price: item.upfrontToday ?? 0,
      quantity: 1,
    };
  }

  if (item.type === "internet") {
    const { id, kind } = internetIdFor(item);
    return internetLineItem(id, lineMonthly(item), kind, discounted);
  }

  const slug = item.device?.slug;
  if (slug) return deviceLineItem(slug, lineMonthly(item), discounted);

  return {
    brand: "Telstra",
    categories: "SIM Only",
    department: "Mobile",
    dicount_applied: discounted ? "Yes" : "No",
    item_id: itemId(item.plan?.name.toLowerCase() ?? ""),
    price: lineMonthly(item),
    quantity: 1,
  };
}

/**
 * Every cart line as TurboDemo-shaped objects. A line counts as discounted if
 * the cart carries a promo code, points are being redeemed, or the line has
 * trade-in credit against it.
 */
export function cartToProducts(cart: Cart): ProductLineItem[] {
  const cartDiscount = Boolean(cart.promoCode) || cart.usePoints;
  return cart.items.map((item) =>
    cartItemToLineItem(item, cartDiscount || Boolean(item.tradeInCredit))
  );
}

/** Monthly and one-off totals, kept apart so neither sum mixes units. */
export function cartTotals(cart: Cart): { monthly: number; upfront: number } {
  return cart.items.reduce(
    (totals, item) => ({
      monthly: totals.monthly + lineMonthly(item),
      upfront: totals.upfront + (item.upfrontToday ?? 0),
    }),
    { monthly: 0, upfront: 0 }
  );
}
