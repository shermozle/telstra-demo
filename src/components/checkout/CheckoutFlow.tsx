"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { CheckoutState } from "@/types/demo";
import { useDemoStore } from "@/store/useDemoStore";
import { track } from "@/lib/track";
import { getEffectiveVariant } from "@/lib/amplitude";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORES = [
  "Telstra Sydney — Pitt St Mall",
  "Telstra Melbourne — Bourke St",
  "Telstra Brisbane — Queen St",
];

export function CheckoutFlow() {
  const router = useRouter();
  const cart = useDemoStore((s) => s.cart);
  const checkout = useDemoStore((s) => s.checkout);
  const setCheckout = useDemoStore((s) => s.setCheckout);
  const resetCheckout = useDemoStore((s) => s.resetCheckout);
  const clearCart = useDemoStore((s) => s.clearCart);
  const setOrderPlaced = useDemoStore((s) => s.setOrderPlaced);

  const { value: stepsVariant } = getEffectiveVariant("checkout-steps", "4-step");
  const threeStep = stepsVariant === "3-step";

  const labels = threeStep
    ? ["Your details", "Delivery & payment", "Review"]
    : ["Your details", "Delivery", "Payment", "Review"];

  const totalSteps = labels.length;
  const [step, setStep] = useState(1);

  function goNext(label: string, num: number) {
    track("Checkout Step Completed", { step_name: label, step_number: num });
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  function placeOrder() {
    const orderId = `TL${Math.floor(100000 + Math.random() * 900000)}`;
    const monthly = cart.items.reduce((sum, i) => {
      const dev = i.device?.pricePerMonth ?? 0;
      const pl = i.plan?.pricePerMonth ?? 0;
      const add = i.addOns.reduce((a, x) => a + x.pricePerMonth, 0);
      return sum + dev + pl + add;
    }, 0);
    track("Order Placed", {
      order_id: orderId,
      total_monthly: monthly,
      total_upfront: 0,
      items_count: cart.items.length,
      promo_code: cart.promoCode ?? "",
      points_used: cart.usePoints ? 5000 : 0,
      trade_in_credit: cart.items.reduce(
        (s, i) => s + (i.tradeInCredit ?? 0),
        0
      ),
    });
    setOrderPlaced(orderId, { monthly, upfront: 0, items: cart.items.length });
    clearCart();
    resetCheckout();
    toast.success("Order placed");
    router.push(`/shop/order-confirmation?order=${orderId}`);
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <Link
          href="/mobile-phones/mobiles-on-a-plan"
          className="text-telstra-blue underline"
        >
          Browse devices
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-telstra-dark">Checkout</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {labels.map((l, i) => (
          <div
            key={l}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              step === i + 1
                ? "bg-telstra-blue text-white"
                : "bg-telstra-grey text-gray-600"
            )}
          >
            {i + 1}. {l}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {step === 1 && (
            <div className="space-y-3 rounded-xl border bg-white p-6">
              <h2 className="font-bold">Your details</h2>
              {(
                [
                  ["fullName", "Full name"],
                  ["email", "Email"],
                  ["phone", "Mobile"],
                  ["dob", "Date of birth"],
                  ["address", "Street address"],
                  ["suburb", "Suburb"],
                  ["state", "State"],
                  ["postcode", "Postcode"],
                ] as const
              ).map(([k, lab]) => (
                <label key={k} className="block text-sm">
                  {lab}
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={checkout.details[k]}
                    onChange={(e) =>
                      setCheckout({
                        details: { ...checkout.details, [k]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <Button
                type="button"
                onClick={() => goNext("Your details", 1)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && threeStep && (
            <div className="space-y-4 rounded-xl border bg-white p-6">
              <h2 className="font-bold">Delivery</h2>
              <DeliveryFields
                checkout={checkout}
                setCheckout={setCheckout}
              />
              <h2 className="pt-4 font-bold">Payment</h2>
              <PaymentFields
                checkout={checkout}
                setCheckout={setCheckout}
              />
              <Button
                type="button"
                onClick={() => goNext("Delivery & payment", 2)}
              >
                Review order
              </Button>
            </div>
          )}

          {step === 2 && !threeStep && (
            <div className="space-y-4 rounded-xl border bg-white p-6">
              <h2 className="font-bold">Delivery</h2>
              <DeliveryFields
                checkout={checkout}
                setCheckout={setCheckout}
              />
              <Button
                type="button"
                onClick={() => goNext("Delivery", 2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && !threeStep && (
            <div className="space-y-4 rounded-xl border bg-white p-6">
              <h2 className="font-bold">Payment</h2>
              <PaymentFields
                checkout={checkout}
                setCheckout={setCheckout}
              />
              <Button
                type="button"
                onClick={() => goNext("Payment", 3)}
              >
                Review
              </Button>
            </div>
          )}

          {((threeStep && step === 3) || (!threeStep && step === 4)) && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="font-bold">Review & confirm</h2>
              <ul className="mt-4 list-inside list-disc text-sm">
                {cart.items.map((i) => (
                  <li key={i.id}>{i.title}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                10 business day cooling-off period applies (demo).
              </p>
              <Button type="button" className="mt-6" onClick={placeOrder}>
                Place order
              </Button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border bg-white p-6 lg:sticky lg:top-24">
          <h3 className="font-bold">Order summary</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((i) => (
              <li key={i.id}>{i.title}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function DeliveryFields({
  checkout,
  setCheckout,
}: {
  checkout: CheckoutState;
  setCheckout: (c: Partial<CheckoutState>) => void;
}) {
  return (
    <>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="del"
          checked={checkout.delivery.method === "standard"}
          onChange={() =>
            setCheckout({ delivery: { method: "standard" } })
          }
        />
        Standard (3–5 business days, free)
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="del"
          checked={checkout.delivery.method === "express"}
          onChange={() => {
            setCheckout({ delivery: { method: "express" } });
            track("Delivery Method Selected", { method: "express" });
          }}
        />
        Express ($9.95)
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="del"
          checked={checkout.delivery.method === "click_collect"}
          onChange={() => {
            setCheckout({
              delivery: { method: "click_collect", store: STORES[0] },
            });
            track("Delivery Method Selected", { method: "click_collect" });
          }}
        />
        Click & Collect
      </label>
      {checkout.delivery.method === "click_collect" && (
        <select
          className="w-full rounded border px-3 py-2"
          value={checkout.delivery.store ?? STORES[0]}
          onChange={(e) =>
            setCheckout({
              delivery: {
                method: "click_collect",
                store: e.target.value,
              },
            })
          }
        >
          {STORES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
    </>
  );
}

function PaymentFields({
  checkout,
  setCheckout,
}: {
  checkout: CheckoutState;
  setCheckout: (c: Partial<CheckoutState>) => void;
}) {
  return (
    <>
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Card number"
        value={checkout.payment.cardNumber}
        onChange={(e) => {
          track("Payment Method Entered", { payment_type: "card" });
          setCheckout({
            payment: { ...checkout.payment, cardNumber: e.target.value },
          });
        }}
      />
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="MM/YY"
          value={checkout.payment.expiry}
          onChange={(e) =>
            setCheckout({
              payment: { ...checkout.payment, expiry: e.target.value },
            })
          }
        />
        <input
          className="w-24 rounded border px-3 py-2"
          placeholder="CVV"
          value={checkout.payment.cvv}
          onChange={(e) =>
            setCheckout({
              payment: { ...checkout.payment, cvv: e.target.value },
            })
          }
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={checkout.payment.autoPay}
          onChange={(e) =>
            setCheckout({
              payment: { ...checkout.payment, autoPay: e.target.checked },
            })
          }
        />
        AutoPay opt-in
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={checkout.payment.termsAccepted}
          onChange={(e) =>
            setCheckout({
              payment: {
                ...checkout.payment,
                termsAccepted: e.target.checked,
              },
            })
          }
        />
        Terms & conditions
      </label>
      <p className="text-xs text-gray-600">
        30-day satisfaction guarantee — demo only.
      </p>
    </>
  );
}
