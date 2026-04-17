import { describe, expect, it } from "vitest";
import { estimateTradeIn, TRADE_IN_MODELS } from "./trade-in";

describe("estimateTradeIn", () => {
  it("returns a range for a known model", () => {
    const id = TRADE_IN_MODELS[0].id;
    const r = estimateTradeIn(id, 1, "good");
    expect(r.min).toBeGreaterThan(0);
    expect(r.max).toBeGreaterThanOrEqual(r.min);
  });

  it("reduces value for damaged devices", () => {
    const id = TRADE_IN_MODELS[0].id;
    const good = estimateTradeIn(id, 1, "good");
    const bad = estimateTradeIn(id, 1, "damaged");
    expect(bad.max).toBeLessThan(good.max);
  });
});
