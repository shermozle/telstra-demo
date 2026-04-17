export const TRADE_IN_MODELS: {
  id: string;
  label: string;
  baseMin: number;
  baseMax: number;
}[] = [
  { id: "ip15pm", label: "iPhone 15 Pro Max", baseMin: 520, baseMax: 680 },
  { id: "ip15p", label: "iPhone 15 Pro", baseMin: 420, baseMax: 560 },
  { id: "ip14", label: "iPhone 14", baseMin: 280, baseMax: 380 },
  { id: "ip13", label: "iPhone 13", baseMin: 220, baseMax: 300 },
  { id: "s25u", label: "Galaxy S25 Ultra", baseMin: 480, baseMax: 620 },
  { id: "s25", label: "Galaxy S25", baseMin: 320, baseMax: 420 },
  { id: "px9p", label: "Pixel 9 Pro", baseMin: 340, baseMax: 450 },
  { id: "px9", label: "Pixel 9", baseMin: 240, baseMax: 320 },
  { id: "ipad-air", label: "iPad Air (M2)", baseMin: 280, baseMax: 380 },
  { id: "ipad-mini", label: "iPad mini", baseMin: 200, baseMax: 280 },
  { id: "watch-ultra", label: "Apple Watch Ultra 2", baseMin: 380, baseMax: 480 },
  { id: "watch-s9", label: "Apple Watch Series 9", baseMin: 180, baseMax: 260 },
  { id: "flip6", label: "Galaxy Z Flip6", baseMin: 300, baseMax: 400 },
  { id: "fold6", label: "Galaxy Z Fold6", baseMin: 420, baseMax: 560 },
  { id: "op12", label: "OnePlus 12", baseMin: 260, baseMax: 340 },
  { id: "nothing-2a", label: "Nothing Phone (2a)", baseMin: 120, baseMax: 180 },
  { id: "moto-edge", label: "Motorola edge 50", baseMin: 140, baseMax: 200 },
  { id: "nokia-x30", label: "Nokia X30 5G", baseMin: 80, baseMax: 120 },
  { id: "op-reno", label: "OPPO Reno12", baseMin: 160, baseMax: 220 },
  { id: "vivo-v40", label: "vivo V40", baseMin: 150, baseMax: 210 },
];

export function estimateTradeIn(
  modelId: string,
  storageFactor: number,
  condition: "good" | "damaged"
) {
  const m = TRADE_IN_MODELS.find((x) => x.id === modelId);
  if (!m) return { min: 0, max: 0 };
  const mult = storageFactor * (condition === "good" ? 1 : 0.75);
  return {
    min: Math.round(m.baseMin * mult),
    max: Math.round(m.baseMax * mult),
  };
}
