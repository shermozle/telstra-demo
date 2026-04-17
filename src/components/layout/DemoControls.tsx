"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings, X } from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import { useDemoControlsStore } from "@/store/useDemoControlsStore";
import { useDemoKeyboardShortcuts } from "@/hooks/useDemoKeyboardShortcuts";
import { initAmplitudeFromControls, getEffectiveVariant } from "@/lib/amplitude";
import { Button } from "@/components/ui/button";

const FLAG_KEYS = [
  "homepage-hero-variant",
  "plan-card-layout",
  "checkout-steps",
  "trade-in-prominence",
  "promo-banner-colour",
  "show-points-redemption",
  "nbn-plan-recommendation",
];

export function DemoControls() {
  const [open, setOpen] = useState(false);
  const resetDemoData = useDemoStore((s) => s.resetDemoData);
  const clearCart = useDemoStore((s) => s.clearCart);
  const setUser = useDemoStore((s) => s.setUser);
  const applyScenario = useDemoStore((s) => s.applyScenario);

  const amplitudeApiKey = useDemoControlsStore((s) => s.amplitudeApiKey);
  const setAmplitudeApiKey = useDemoControlsStore((s) => s.setAmplitudeApiKey);
  const experimentDeploymentKey = useDemoControlsStore(
    (s) => s.experimentDeploymentKey
  );
  const setExperimentDeploymentKey = useDemoControlsStore(
    (s) => s.setExperimentDeploymentKey
  );
  const sessionReplayEnabled = useDemoControlsStore(
    (s) => s.sessionReplayEnabled
  );
  const setSessionReplayEnabled = useDemoControlsStore(
    (s) => s.setSessionReplayEnabled
  );
  const guidesEnabled = useDemoControlsStore((s) => s.guidesEnabled);
  const setGuidesEnabled = useDemoControlsStore((s) => s.setGuidesEnabled);
  const flagOverrides = useDemoControlsStore((s) => s.flagOverrides);
  const setFlagOverride = useDemoControlsStore((s) => s.setFlagOverride);
  const eventLog = useDemoControlsStore((s) => s.eventLog);
  const clearEventLog = useDemoControlsStore((s) => s.clearEventLog);
  const flagSnapshots = useDemoControlsStore((s) => s.flagSnapshots);

  useDemoKeyboardShortcuts({
    onReset: () => resetDemoData(),
    onDemoPanel: () => setOpen(true),
  });

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-telstra-dark text-white shadow-lg hover:bg-black md:bottom-6 md:right-6"
        aria-label="Demo controls"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-6 w-6" />
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/40" />
          <Dialog.Content className="fixed bottom-4 right-4 z-[111] flex max-h-[85vh] w-[min(420px,94vw)] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <Dialog.Title className="text-lg font-bold text-telstra-dark">
                Demo controls
              </Dialog.Title>
              <Dialog.Close className="rounded p-1 hover:bg-telstra-grey">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm">
              <section className="mb-4 space-y-2">
                <h3 className="font-semibold text-telstra-dark">State</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => resetDemoData()}
                  >
                    Reset all data
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      const u = useDemoStore.getState().user;
                      setUser({ isLoggedIn: !u.isLoggedIn });
                    }}
                  >
                    Toggle login
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => clearCart()}
                  >
                    Clear cart
                  </Button>
                </div>
              </section>

              <section className="mb-4 space-y-2">
                <h3 className="font-semibold text-telstra-dark">Amplitude</h3>
                <label className="block text-xs text-gray-600">API key</label>
                <input
                  className="w-full rounded border px-2 py-1 text-xs"
                  value={amplitudeApiKey}
                  onChange={(e) => setAmplitudeApiKey(e.target.value)}
                  placeholder="Amplitude API key"
                />
                <label className="block text-xs text-gray-600">
                  Experiment deployment key
                </label>
                <input
                  className="w-full rounded border px-2 py-1 text-xs"
                  value={experimentDeploymentKey}
                  onChange={(e) => setExperimentDeploymentKey(e.target.value)}
                  placeholder="Deployment key"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sessionReplayEnabled}
                    onChange={(e) => setSessionReplayEnabled(e.target.checked)}
                  />
                  Session Replay
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={guidesEnabled}
                    onChange={(e) => setGuidesEnabled(e.target.checked)}
                  />
                  Guides & Surveys (optOut when off)
                </label>
                <Button
                  variant="primary"
                  type="button"
                  className="w-full text-xs"
                  onClick={() => {
                    initAmplitudeFromControls();
                    window.location.reload();
                  }}
                >
                  Apply SDK settings & reload
                </Button>
              </section>

              <section className="mb-4">
                <h3 className="mb-2 font-semibold text-telstra-dark">
                  Flag overrides
                </h3>
                <div className="space-y-2">
                  {FLAG_KEYS.map((fk) => (
                    <div key={fk} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-500">{fk}</span>
                      <input
                        className="rounded border px-2 py-1 text-xs"
                        placeholder="override value"
                        value={flagOverrides[fk] ?? ""}
                        onChange={(e) =>
                          setFlagOverride(fk, e.target.value || null)
                        }
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-gray-500">
                  Clear field to use Experiment / defaults.
                </p>
              </section>

              <section className="mb-4">
                <h3 className="mb-2 font-semibold text-telstra-dark">
                  Scenarios
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => applyScenario("low-data")}
                  >
                    Low data warning
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => applyScenario("bill-overdue")}
                  >
                    Bill overdue
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => applyScenario("new-device-deal")}
                  >
                    New device deal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => applyScenario("prepaid-expiring")}
                  >
                    Pre-paid expiring
                  </Button>
                </div>
              </section>

              <section className="mb-4">
                <h3 className="mb-2 font-semibold text-telstra-dark">
                  Telstra Plus tier
                </h3>
                <div className="flex gap-2">
                  {(["Silver", "Gold", "VIP"] as const).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => setUser({ telstraPlusTier: t })}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </section>

              <section className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-semibold text-telstra-dark">
                    Event inspector
                  </h3>
                  <button
                    type="button"
                    className="text-xs text-telstra-blue underline"
                    onClick={() => clearEventLog()}
                  >
                    Clear
                  </button>
                </div>
                <ul className="max-h-32 space-y-1 overflow-y-auto rounded border bg-gray-50 p-2 font-mono text-[10px]">
                  {eventLog.length === 0 && (
                    <li className="text-gray-400">No events yet</li>
                  )}
                  {eventLog.map((ev, i) => (
                    <li key={i}>
                      <span className="text-telstra-blue">{ev.name}</span>{" "}
                      {new Date(ev.ts).toLocaleTimeString()}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-semibold text-telstra-dark">
                    Flag inspector
                  </h3>
                  <button
                    type="button"
                    className="text-xs text-telstra-blue"
                    onClick={() => {
                      FLAG_KEYS.forEach((k) => {
                        const defaults: Record<string, string> = {
                          "homepage-hero-variant": "satellite",
                          "plan-card-layout": "horizontal",
                          "checkout-steps": "4-step",
                          "trade-in-prominence": "standard",
                          "promo-banner-colour": "blue",
                          "show-points-redemption": "true",
                          "nbn-plan-recommendation": "off",
                        };
                        getEffectiveVariant(k, defaults[k] ?? "");
                      });
                    }}
                  >
                    Refresh
                  </button>
                </div>
                <ul className="max-h-28 space-y-1 overflow-y-auto rounded border bg-gray-50 p-2 font-mono text-[10px]">
                  {FLAG_KEYS.map((k) => {
                    const defaults: Record<string, string> = {
                      "homepage-hero-variant": "satellite",
                      "plan-card-layout": "horizontal",
                      "checkout-steps": "4-step",
                      "trade-in-prominence": "standard",
                      "promo-banner-colour": "blue",
                      "show-points-redemption": "true",
                      "nbn-plan-recommendation": "off",
                    };
                    const snap = flagSnapshots[k];
                    const v = snap ?? {
                      value: flagOverrides[k] ?? defaults[k],
                      source: "override" as const,
                    };
                    return (
                      <li key={k}>
                        {k}: {v?.value}{" "}
                        <span className="text-gray-400">({v?.source})</span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <p className="mt-4 text-[10px] text-gray-500">
                Shortcuts: Ctrl+Shift+R reset data · Ctrl+Shift+D open panel
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
