"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { cartToProducts, cartTotals, lineMonthly } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  ACCESSORIES,
  telstraAccessoryImage,
} from "@/data/accessories";
import { telstraDeviceImage } from "@/data/devices";
import { TELSTRA_MARKETING } from "@/lib/telstra-assets";
import { getEffectiveVariant } from "@/lib/amplitude";
import { formatPrice } from "@/lib/utils";

const PROMOS: Record<string, number> = {
  ONLINE50: 50,
  PROMO20: 20,
};

export default function CartPage() {
  const cart = useDemoStore((s) => s.cart);
  const setCart = useDemoStore((s) => s.setCart);
  const removeCartItem = useDemoStore((s) => s.removeCartItem);
  const user = useDemoStore((s) => s.user);
  const { monthly, upfront } = cartTotals(cart);

  const promoOff = cart.promoDiscount ?? 0;
  const pointsValue = cart.usePoints ? Math.min(50, user.telstraPlusPoints / 200) : 0;

  const { value: showPointsStr } = getEffectiveVariant(
    "show-points-redemption",
    "true"
  );
  const showPoints = showPointsStr === "true";

  function applyPromo(raw: string) {
    const code = raw.trim().toUpperCase();
    const discount = PROMOS[code];
    if (discount) {
      setCart({ promoCode: code, promoDiscount: discount });
      track("Promo Code Applied", {
        promo_code: code,
        result: "success",
        discount_amount: discount,
      });
      toast.success(`Promo ${code} applied`);
    } else {
      track("Promo Code Applied", {
        promo_code: code,
        result: "invalid",
        discount_amount: 0,
      });
      toast.error("Invalid code (try ONLINE50 or PROMO20)");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-telstra-dark">Your cart</h1>
      {cart.items.length === 0 ? (
        <p className="mt-6 text-gray-600">
          Your cart is empty.{" "}
          <Link href="/mobile-phones/mobiles-on-a-plan" className="text-telstra-blue underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-100">
                  {item.type === "device-plan" && item.device?.slug ? (
                    <img
                      src={telstraDeviceImage(item.device.slug)}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : item.type === "accessory" ? (
                    <img
                      src={telstraAccessoryImage(
                        ACCESSORIES.find((a) => a.name === item.title)?.slug ??
                          "airpods-pro-3"
                      )}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : item.type === "internet" ? (
                    <img
                      src={TELSTRA_MARKETING.nbnOffer}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Deal</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  {item.device && (
                    <p className="text-sm text-gray-600">
                      {item.device.colour} · {item.device.storage}
                    </p>
                  )}
                  {item.plan && (
                    <p className="text-sm">
                      Plan: {item.plan.name} ({item.plan.dataGB}GB)
                    </p>
                  )}
                  <p className="text-telstra-blue">
                    {item.upfrontToday
                      ? `$${formatPrice(item.upfrontToday)} upfront`
                      : `$${formatPrice(lineMonthly(item))}/mth`}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-telstra-red underline"
                    onClick={() => {
                      removeCartItem(item.id);
                      track("Remove from Cart", {
                        product_name: item.title,
                        reason: "user_removed",
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-xl border bg-white p-4">
              <p className="font-semibold">Promo code</p>
              <div className="mt-2 flex gap-2">
                <input
                  id="promo"
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="ONLINE50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyPromo((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(
                      "promo"
                    ) as HTMLInputElement | null;
                    applyPromo(el?.value ?? "");
                  }}
                >
                  Apply
                </Button>
              </div>
              {cart.promoCode && (
                <p className="mt-2 text-sm text-telstra-green">
                  {cart.promoCode} active (−${promoOff}/mth promo discount)
                </p>
              )}
            </div>

            {user.isLoggedIn && showPoints && (
              <label className="flex items-center gap-2 rounded-xl border bg-white p-4">
                <input
                  type="checkbox"
                  checked={cart.usePoints}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setCart({
                      usePoints: on,
                      pointsToRedeem: on ? 5000 : 0,
                    });
                    track("Points Redemption Toggled", {
                      points_used: on ? 5000 : 0,
                      dollar_value: on ? 25 : 0,
                      action: on ? "applied" : "removed",
                    });
                  }}
                />
                <span>
                  Use 5,000 Telstra Plus points to save $25/mth (demo)
                </span>
              </label>
            )}

            <section>
              <h2 className="font-semibold">You might also like</h2>
              <div className="mt-2 grid gap-4 sm:grid-cols-3">
                {ACCESSORIES.slice(0, 3).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/accessories/${a.slug}`}
                    className="rounded-lg border bg-white p-3 text-sm hover:border-telstra-blue"
                  >
                    {a.name} — ${a.price}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="h-fit rounded-xl border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-bold">Cost summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Monthly (after discounts)</dt>
                <dd>
                  $
                  {Math.max(
                    0,
                    monthly - promoOff - pointsValue
                  ).toFixed(2)}
                  /mth
                </dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Total due today</dt>
                <dd>${formatPrice(upfront)}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Due after cooling-off</dt>
                <dd>$0.00</dd>
              </div>
            </dl>
            <Button
              className="mt-6 w-full py-4"
              asChild
            >
              <Link
                href="/shop/checkout"
                onClick={() => {
                  track("Cart Viewed", {
                    cart_items_count: cart.items.length,
                    cart_monthly_value: monthly,
                    cart_upfront_value: upfront,
                  });
                  track("Checkout Started", {
                    cart_items_count: cart.items.length,
                    cart_value: monthly,
                    Products: cartToProducts(cart),
                  });
                }}
              >
                Continue to checkout
              </Link>
            </Button>
            <Link
              href="/mobile-phones/mobiles-on-a-plan"
              className="mt-4 block text-center text-sm text-telstra-blue underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
