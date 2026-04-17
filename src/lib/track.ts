"use client";

import * as amplitude from "@amplitude/analytics-browser";
import { useDemoControlsStore } from "@/store/useDemoControlsStore";

/** Safe track + debug log */
export function track(
  name: string,
  props: Record<string, unknown> = {}
) {
  try {
    amplitude.track(name, props);
  } catch {
    /* not initialised */
  }
  useDemoControlsStore.getState().pushEvent(name, props);
}

export function identifyFromUser(user: {
  customerId: string;
  email: string;
  telstraPlusTier: string;
  telstraPlusPoints: number;
  servicesCount: number;
  serviceTypes: string[];
  activeDevice: string;
  planName: string;
  monthlySpend: number;
}) {
  try {
    amplitude.setUserId(user.customerId);
    const id = new amplitude.Identify()
      .set("account_type", "postpaid")
      .set("telstra_plus_tier", user.telstraPlusTier)
      .set("telstra_plus_points", user.telstraPlusPoints)
      .set("services_count", user.servicesCount)
      .set("service_types", user.serviceTypes)
      .set("active_device", user.activeDevice)
      .set("plan_name", user.planName)
      .set("monthly_spend", user.monthlySpend);
    amplitude.identify(id);
  } catch {
    /* noop */
  }
}
