import { assetPath } from "./utils";

/** Local copies of Telstra marketing assets — see `scripts/download-telstra-images.sh`. */
export const TELSTRA_MARKETING = {
  mobileHubFamily: assetPath("/images/telstra/marketing/mobile-hub-family.jpg"),
  internetHeroDesktop: assetPath("/images/telstra/marketing/internet-hero-desktop.jpg"),
  nbnOffer: assetPath("/images/telstra/marketing/nbn-offer.jpg"),
} as const;

export const TELSTRA_BRAND = {
  logo: assetPath("/images/telstra/brand/telstra-logo.png"),
  tLogoSvg: assetPath("/images/telstra/brand/t-logo.svg"),
} as const;
