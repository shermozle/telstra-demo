export interface DemoUser {
  isLoggedIn: boolean;
  firstName: string;
  email: string;
  customerId: string;
  telstraPlusTier: "Silver" | "Gold" | "VIP";
  telstraPlusPoints: number;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
  };
}

export type ServiceType =
  | "postpaid-mobile"
  | "prepaid-mobile"
  | "nbn"
  | "5g-internet";

export interface Service {
  id: string;
  type: ServiceType;
  nickname: string;
  phoneNumber: string;
  plan: {
    name: string;
    dataAllowanceGB: number;
    dataUsedGB: number;
    pricePerMonth: number;
    billingCycleDaysLeft: number;
  };
  device?: {
    name: string;
    repaymentsMade: number;
    repaymentsTotal: number;
    monthlyRepayment: number;
  };
  extras: string[];
  subscriptions: string[];
  /** prepaid only */
  prepaidDataRemainingGB?: number;
  prepaidDaysLeft?: number;
  autoRecharge?: boolean;
  /** nbn */
  connectionStatus?: "connected" | "outage";
  speedTier?: string;
}

export type CartItemType =
  | "device-plan"
  | "sim-only"
  | "internet"
  | "accessory";

export interface CartItem {
  id: string;
  type: CartItemType;
  title: string;
  device?: {
    name: string;
    colour: string;
    storage: string;
    pricePerMonth: number;
    slug?: string;
  };
  plan?: {
    name: string;
    dataGB: number;
    pricePerMonth: number;
  };
  addOns: { name: string; pricePerMonth: number }[];
  repaymentTermMonths: number;
  tradeInCredit?: number;
  upfrontToday?: number;
  /** internet */
  internetPlanName?: string;
  internetPricePerMonth?: number;
}

export interface Cart {
  items: CartItem[];
  promoCode?: string;
  promoDiscount?: number;
  usePoints: boolean;
  pointsToRedeem: number;
}

export interface Payment {
  date: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed";
}

export interface Bill {
  period: string;
  amount: number;
  pdfUrl: string;
  status: "paid" | "unpaid";
}

export interface CheckoutState {
  step: number;
  details: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  delivery: {
    method: "standard" | "express" | "click_collect";
    store?: string;
  };
  payment: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    autoPay: boolean;
    termsAccepted: boolean;
  };
}
