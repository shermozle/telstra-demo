# Telstra Demo Site — Specification (outline)

> **Note:** The full detailed specification used for this build lived in the original `telstra-demo-site-spec.md` attachment. This outline remains so `@telstra-demo-site-spec` resolves in the repo; replace with your canonical copy if needed.

## Summary

- **Stack:** Next.js 14 (App Router, `output: "export"`), Tailwind, Zustand + `localStorage`, Radix UI, Amplitude Browser SDK + Experiment JS + Session Replay plugin, Sonner toasts.
- **Routes:** Homepage, mobile hub & catalog & PDP, SIM-only & Pre-Paid, Internet hub & nbn & 5G, accessories & deals, trade-in, cart → checkout → order confirmation & tracking, My Telstra (dashboard, services, detail, plan, usage, payments, profile), support hub & category, login, search.
- **State:** Pre-seeded demo user/services/bills; cart, checkout, profile draft; demo scenarios via store + **Demo Controls** (gear / `Ctrl+Shift+D`), reset via footer or `Ctrl+Shift+R`.
- **Analytics:** `track()` helper + event log; Amplitude init from Demo Controls keys; `getEffectiveVariant()` for flags + overrides; `Page Viewed` on route change.

## Implemented flows

1. Browse devices → PDP (plan, term, add-ons) → cart → promo codes `ONLINE50` / `PROMO20` → checkout (3- or 4-step via `checkout-steps` flag) → confirmation.
2. Trade-in estimator → apply credit line item → cart.
3. Internet address check, nbn plans, 5G home add-to-cart.
4. Login → My Telstra dashboard, services, plan change, usage, payments, profile edits.
5. Support hub & category FAQ tabs.

## Commands

| Command        | Purpose        |
|----------------|----------------|
| `npm run dev`  | Dev server     |
| `npm run build`| Static export to `out/` |
| `npm run test` | Vitest         |
| `npm run e2e`  | Playwright     |
