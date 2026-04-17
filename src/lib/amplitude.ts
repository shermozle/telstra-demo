"use client";

import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import {
  Experiment,
  type ExperimentClient,
} from "@amplitude/experiment-js-client";
import { useDemoControlsStore } from "@/store/useDemoControlsStore";

let experimentClient: ExperimentClient | null = null;
let initGeneration = 0;
let lastInitFingerprint = "";

export function getExperimentClient(): ExperimentClient | null {
  return experimentClient;
}

export function initAmplitudeFromControls(): void {
  if (typeof window === "undefined") return;

  const gen = ++initGeneration;
  const {
    amplitudeApiKey,
    experimentDeploymentKey,
    sessionReplayEnabled,
    guidesEnabled,
  } = useDemoControlsStore.getState();

  experimentClient = null;

  if (!amplitudeApiKey) {
    lastInitFingerprint = "";
    return;
  }

  const fingerprint = `${amplitudeApiKey}|${experimentDeploymentKey}|${sessionReplayEnabled}|${guidesEnabled}`;
  if (fingerprint === lastInitFingerprint) {
    return;
  }
  lastInitFingerprint = fingerprint;

  const autocapture = {
    elementInteractions: true,
    pageViews: true,
    sessions: true,
    attribution: true,
    fileDownloads: true,
  };

  amplitude.init(amplitudeApiKey, {
    autocapture,
    optOut: !guidesEnabled,
  });

  if (sessionReplayEnabled) {
    try {
      amplitude.add(
        sessionReplayPlugin({
          sampleRate: 1,
          privacyConfig: { defaultMaskLevel: "light" },
        })
      );
    } catch {
      /* plugin optional */
    }
  }

  if (experimentDeploymentKey) {
    experimentClient = Experiment.initializeWithAmplitudeAnalytics(
      experimentDeploymentKey,
      {
        fetchOnStart: true,
        pollOnStart: true,
        automaticExposureTracking: true,
        automaticFetchOnAmplitudeIdentityChange: true,
      }
    );
  }

  if (gen !== initGeneration) return;
}

export { amplitude };

function snap(
  key: string,
  value: string,
  source: "override" | "local" | "remote"
) {
  if (typeof window === "undefined") return;
  useDemoControlsStore.getState().setFlagSnapshot(key, { value, source });
}

/** Effective variant: demo override > experiment > default */
export function getEffectiveVariant(
  key: string,
  defaultValue: string
): { value: string; source: "override" | "local" | "remote" } {
  const override = useDemoControlsStore.getState().flagOverrides[key];
  if (override !== undefined && override !== "") {
    snap(key, override, "override");
    return { value: override, source: "override" };
  }

  try {
    const exp = experimentClient;
    if (exp) {
      const v = exp.variant(key, defaultValue);
      const val = (v?.value ?? defaultValue) as string;
      snap(key, val, "local");
      return { value: val, source: "local" };
    }
  } catch {
    /* noop */
  }

  snap(key, defaultValue, "remote");
  return { value: defaultValue, source: "remote" };
}
