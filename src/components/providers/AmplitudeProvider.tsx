"use client";

import { useEffect, useRef } from "react";
import { useDemoControlsStore } from "@/store/useDemoControlsStore";
import { initAmplitudeFromControls } from "@/lib/amplitude";
import { useDemoStore } from "@/store/useDemoStore";
import { identifyFromUser } from "@/lib/track";

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  const amplitudeApiKey = useDemoControlsStore((s) => s.amplitudeApiKey);
  const experimentDeploymentKey = useDemoControlsStore(
    (s) => s.experimentDeploymentKey
  );
  const sessionReplayEnabled = useDemoControlsStore(
    (s) => s.sessionReplayEnabled
  );
  const guidesEnabled = useDemoControlsStore((s) => s.guidesEnabled);

  const user = useDemoStore((s) => s.user);
  const services = useDemoStore((s) => s.services);
  const identified = useRef<string | null>(null);

  useEffect(() => {
    const unsub = useDemoControlsStore.persist.onFinishHydration(() => {
      initAmplitudeFromControls();
    });
    if (useDemoControlsStore.persist.hasHydrated()) {
      initAmplitudeFromControls();
    }
    return unsub;
  }, []);

  useEffect(() => {
    initAmplitudeFromControls();
  }, [
    amplitudeApiKey,
    experimentDeploymentKey,
    sessionReplayEnabled,
    guidesEnabled,
  ]);

  useEffect(() => {
    if (!amplitudeApiKey || !user.isLoggedIn) {
      identified.current = null;
      return;
    }
    const key = `${user.customerId}|${user.telstraPlusTier}|${user.telstraPlusPoints}`;
    if (identified.current === key) return;
    identified.current = key;
    const post = services.find((s) => s.type === "postpaid-mobile");
    identifyFromUser({
      customerId: user.customerId,
      email: user.email,
      telstraPlusTier: user.telstraPlusTier,
      telstraPlusPoints: user.telstraPlusPoints,
      servicesCount: services.length,
      serviceTypes: services.map((s) => s.type),
      activeDevice: post?.device?.name ?? "None",
      planName: post?.plan.name ?? "",
      monthlySpend: 114.52,
    });
  }, [amplitudeApiKey, user, services]);

  return <>{children}</>;
}
