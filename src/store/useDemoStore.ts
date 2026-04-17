"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Bill,
  Cart,
  CartItem,
  CheckoutState,
  DemoUser,
  Payment,
  Service,
} from "@/types/demo";

const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function seedBills(): Bill[] {
  const months = [
    "September 2025",
    "October 2025",
    "November 2025",
    "December 2025",
    "January 2026",
    "February 2026",
  ];
  return months.map((period, i) => ({
    period,
    amount: 108 + i * 3 + (i % 2) * 7,
    pdfUrl: `#mock-bill-${i}`,
    status: "paid" as const,
  }));
}

function seedPayments(): Payment[] {
  return [
    {
      date: "2026-03-27",
      amount: 114.52,
      method: "Visa ending in 3002",
      status: "paid",
    },
    {
      date: "2026-02-27",
      amount: 112.1,
      method: "Visa ending in 3002",
      status: "paid",
    },
  ];
}

export const DEFAULT_USER: DemoUser = {
  isLoggedIn: true,
  firstName: "Simon",
  email: "simon@example.com",
  customerId: "2003964661",
  telstraPlusTier: "Silver",
  telstraPlusPoints: 11266,
  address: {
    street: "42 Example Street",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
  },
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "svc-post-1",
    type: "postpaid-mobile",
    nickname: "Simon phone",
    phoneNumber: "0412 345 678",
    plan: {
      name: "Upfront Essential",
      dataAllowanceGB: 50,
      dataUsedGB: 22.9,
      pricePerMonth: 68,
      billingCycleDaysLeft: 11,
    },
    device: {
      name: "Pixel 10 Pro",
      repaymentsMade: 8,
      repaymentsTotal: 24,
      monthlyRepayment: 33.29,
    },
    extras: [],
    subscriptions: ["Spotify Premium"],
  },
  {
    id: "svc-pre-1",
    type: "prepaid-mobile",
    nickname: "Work prepaid",
    phoneNumber: "0499 888 777",
    plan: {
      name: "Pre-Paid Max",
      dataAllowanceGB: 200,
      dataUsedGB: 84.3,
      pricePerMonth: 0,
      billingCycleDaysLeft: 28,
    },
    prepaidDataRemainingGB: 115.7,
    prepaidDaysLeft: 28,
    autoRecharge: true,
    extras: [],
    subscriptions: [],
  },
  {
    id: "svc-nbn-1",
    type: "nbn",
    nickname: "Home nbn",
    phoneNumber: "—",
    plan: {
      name: "Upfront Fast - Unlimited Data",
      dataAllowanceGB: 0,
      dataUsedGB: 0,
      pricePerMonth: 110,
      billingCycleDaysLeft: 11,
    },
    connectionStatus: "connected",
    speedTier: "100/20 Mbps",
    extras: [],
    subscriptions: [],
  },
];

export interface DemoFlags {
  homepageHeroVariant: string;
  planCardLayout: string;
  checkoutSteps: string;
  tradeInProminence: string;
  promoBannerColour: string;
  showPointsRedemption: boolean;
  nbnPlanRecommendation: string;
}

export interface DemoState {
  user: DemoUser;
  services: Service[];
  cart: Cart;
  bills: Bill[];
  payments: Payment[];
  checkout: CheckoutState;
  profileDraft: {
    email: string;
    mobile: string;
    homePhone: string;
    addressLine: string;
  };
  tradeInDraft: {
    deviceType: "phone" | "tablet" | "watch" | null;
    modelId: string | null;
    storage: string | null;
    condition: "good" | "damaged" | null;
    estimatedMin: number;
    estimatedMax: number;
  };
  /** demo scenarios */
  flashDealActive: boolean;
  orderNumber: string | null;
  lastOrderSummary: {
    monthly: number;
    upfront: number;
    items: number;
  } | null;
  /** actions */
  setUser: (u: Partial<DemoUser>) => void;
  login: (email: string, firstName?: string) => void;
  logout: () => void;
  resetDemoData: () => void;
  setServices: (s: Service[]) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  setCart: (c: Partial<Cart>) => void;
  addCartItem: (item: Omit<CartItem, "id">) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  setCheckout: (c: Partial<CheckoutState>) => void;
  resetCheckout: () => void;
  setProfileDraft: (p: Partial<DemoState["profileDraft"]>) => void;
  setTradeInDraft: (t: Partial<DemoState["tradeInDraft"]>) => void;
  clearTradeInDraft: () => void;
  setFlashDeal: (v: boolean) => void;
  setOrderPlaced: (orderNumber: string, summary: DemoState["lastOrderSummary"]) => void;
  applyScenario: (name: string) => void;
}

const emptyCart: Cart = {
  items: [],
  usePoints: false,
  pointsToRedeem: 0,
};

const initialCheckout: CheckoutState = {
  step: 1,
  details: {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
  },
  delivery: { method: "standard" },
  payment: {
    cardNumber: "",
    expiry: "",
    cvv: "",
    autoPay: false,
    termsAccepted: false,
  },
};

const initialTradeIn = (): DemoState["tradeInDraft"] => ({
  deviceType: null,
  modelId: null,
  storage: null,
  condition: null,
  estimatedMin: 0,
  estimatedMax: 0,
});

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      services: DEFAULT_SERVICES,
      cart: emptyCart,
      bills: seedBills(),
      payments: seedPayments(),
      checkout: initialCheckout,
      profileDraft: {
        email: DEFAULT_USER.email,
        mobile: "0412 345 678",
        homePhone: "02 9000 0000",
        addressLine: `${DEFAULT_USER.address.street}, ${DEFAULT_USER.address.suburb} ${DEFAULT_USER.address.state} ${DEFAULT_USER.address.postcode}`,
      },
      tradeInDraft: initialTradeIn(),
      flashDealActive: false,
      orderNumber: null,
      lastOrderSummary: null,

      setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),

      login: (email, firstName) =>
        set((s) => ({
          user: {
            ...s.user,
            isLoggedIn: true,
            email,
            firstName: firstName ?? s.user.firstName,
          },
        })),

      logout: () =>
        set((s) => ({
          user: { ...s.user, isLoggedIn: false },
        })),

      resetDemoData: () =>
        set({
          user: DEFAULT_USER,
          services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)) as Service[],
          cart: { ...emptyCart },
          bills: seedBills(),
          payments: seedPayments(),
          checkout: initialCheckout,
          profileDraft: {
            email: DEFAULT_USER.email,
            mobile: "0412 345 678",
            homePhone: "02 9000 0000",
            addressLine: `${DEFAULT_USER.address.street}, ${DEFAULT_USER.address.suburb} ${DEFAULT_USER.address.state} ${DEFAULT_USER.address.postcode}`,
          },
          tradeInDraft: initialTradeIn(),
          flashDealActive: false,
          orderNumber: null,
          lastOrderSummary: null,
        }),

      setServices: (services) => set({ services }),

      updateService: (id, patch) =>
        set((s) => ({
          services: s.services.map((x) => {
            if (x.id !== id) return x;
            const { plan: planPatch, ...rest } = patch;
            return {
              ...x,
              ...rest,
              plan: planPatch ? { ...x.plan, ...planPatch } : x.plan,
            };
          }),
        })),

      setCart: (c) => set((s) => ({ cart: { ...s.cart, ...c } })),

      addCartItem: (item) =>
        set((s) => ({
          cart: {
            ...s.cart,
            items: [...s.cart.items, { ...item, id: genId() }],
          },
        })),

      removeCartItem: (id) =>
        set((s) => ({
          cart: {
            ...s.cart,
            items: s.cart.items.filter((i) => i.id !== id),
          },
        })),

      clearCart: () => set({ cart: { ...emptyCart } }),

      setCheckout: (c) =>
        set((s) => ({
          checkout: {
            ...s.checkout,
            ...c,
            details: { ...s.checkout.details, ...c.details },
            delivery: { ...s.checkout.delivery, ...c.delivery },
            payment: { ...s.checkout.payment, ...c.payment },
          },
        })),

      resetCheckout: () => set({ checkout: initialCheckout }),

      setProfileDraft: (p) =>
        set((s) => ({ profileDraft: { ...s.profileDraft, ...p } })),

      setTradeInDraft: (t) =>
        set((s) => ({ tradeInDraft: { ...s.tradeInDraft, ...t } })),

      clearTradeInDraft: () => set({ tradeInDraft: initialTradeIn() }),

      setFlashDeal: (v) => set({ flashDealActive: v }),

      setOrderPlaced: (orderNumber, lastOrderSummary) =>
        set({ orderNumber, lastOrderSummary }),

      applyScenario: (name) => {
        const s = get();
        if (name === "low-data") {
          set({
            services: s.services.map((x) =>
              x.id === "svc-post-1"
                ? {
                    ...x,
                    plan: {
                      ...x.plan,
                      dataUsedGB: x.plan.dataAllowanceGB * 0.95,
                    },
                  }
                : x
            ),
          });
        } else if (name === "bill-overdue") {
          set({
            bills: [
              {
                period: "March 2026",
                amount: 114.52,
                pdfUrl: "#unpaid",
                status: "unpaid",
              },
              ...s.bills.filter((_, i) => i < 5),
            ],
          });
        } else if (name === "new-device-deal") {
          set({ flashDealActive: true });
        } else if (name === "prepaid-expiring") {
          set({
            services: s.services.map((x) =>
              x.id === "svc-pre-1"
                ? {
                    ...x,
                    prepaidDaysLeft: 2,
                    plan: { ...x.plan, billingCycleDaysLeft: 2 },
                  }
                : x
            ),
          });
        }
      },
    }),
    {
      name: "telstra-demo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        services: s.services,
        cart: s.cart,
        bills: s.bills,
        payments: s.payments,
        profileDraft: s.profileDraft,
        flashDealActive: s.flashDealActive,
      }),
    }
  )
);
