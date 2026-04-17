"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LoggedEvent {
  name: string;
  props: Record<string, unknown>;
  ts: number;
}

export interface DemoControlsState {
  amplitudeApiKey: string;
  experimentDeploymentKey: string;
  sessionReplayEnabled: boolean;
  guidesEnabled: boolean;
  flagOverrides: Record<string, string>;
  eventLog: LoggedEvent[];
  flagSnapshots: Record<
    string,
    { value: string; source: "override" | "local" | "remote" }
  >;
  setAmplitudeApiKey: (k: string) => void;
  setExperimentDeploymentKey: (k: string) => void;
  setSessionReplayEnabled: (v: boolean) => void;
  setGuidesEnabled: (v: boolean) => void;
  setFlagOverride: (key: string, value: string | null) => void;
  pushEvent: (name: string, props: Record<string, unknown>) => void;
  clearEventLog: () => void;
  setFlagSnapshot: (
    key: string,
    snap: { value: string; source: "override" | "local" | "remote" }
  ) => void;
}

const MAX_LOG = 80;

export const useDemoControlsStore = create<DemoControlsState>()(
  persist(
    (set) => ({
      amplitudeApiKey: "",
      experimentDeploymentKey: "",
      sessionReplayEnabled: true,
      guidesEnabled: true,
      flagOverrides: {},
      eventLog: [],
      flagSnapshots: {},

      setAmplitudeApiKey: (amplitudeApiKey) => set({ amplitudeApiKey }),
      setExperimentDeploymentKey: (experimentDeploymentKey) =>
        set({ experimentDeploymentKey }),
      setSessionReplayEnabled: (sessionReplayEnabled) =>
        set({ sessionReplayEnabled }),
      setGuidesEnabled: (guidesEnabled) => set({ guidesEnabled }),

      setFlagOverride: (key, value) =>
        set((s) => {
          const next = { ...s.flagOverrides };
          if (value === null || value === "") delete next[key];
          else next[key] = value;
          return { flagOverrides: next };
        }),

      pushEvent: (name, props) =>
        set((s) => ({
          eventLog: [
            { name, props, ts: Date.now() },
            ...s.eventLog,
          ].slice(0, MAX_LOG),
        })),

      clearEventLog: () => set({ eventLog: [] }),

      setFlagSnapshot: (key, snap) =>
        set((s) => ({
          flagSnapshots: { ...s.flagSnapshots, [key]: snap },
        })),
    }),
    {
      name: "telstra-demo-controls",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        amplitudeApiKey: s.amplitudeApiKey,
        experimentDeploymentKey: s.experimentDeploymentKey,
        sessionReplayEnabled: s.sessionReplayEnabled,
        guidesEnabled: s.guidesEnabled,
        flagOverrides: s.flagOverrides,
      }),
    }
  )
);
