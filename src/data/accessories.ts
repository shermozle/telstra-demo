import { assetPath } from "@/lib/utils";

export interface AccessorySpec {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

/** From `public/images/telstra/accessories/` — see `scripts/download-telstra-images.sh`. */
export function telstraAccessoryImage(slug: string) {
  return assetPath(`/images/telstra/accessories/${slug}.png`);
}

export const ACCESSORIES: AccessorySpec[] = [
  {
    slug: "airpods-pro-3",
    name: "AirPods Pro (3rd gen)",
    price: 399,
    category: "Audio",
    image: telstraAccessoryImage("airpods-pro-3"),
  },
  {
    slug: "samsung-galaxy-buds3",
    name: "Samsung Galaxy Buds3",
    price: 279,
    category: "Audio",
    image: telstraAccessoryImage("samsung-galaxy-buds3"),
  },
  {
    slug: "pixel-buds-pro",
    name: "Pixel Buds Pro",
    price: 299,
    category: "Audio",
    image: telstraAccessoryImage("pixel-buds-pro"),
  },
  {
    slug: "magsafe-charger",
    name: "MagSafe Charger",
    price: 65,
    category: "Charging",
    image: telstraAccessoryImage("magsafe-charger"),
  },
  {
    slug: "smart-modem-case",
    name: "Telstra Smart Modem travel case",
    price: 45,
    category: "Home",
    image: telstraAccessoryImage("smart-modem-case"),
  },
  {
    slug: "screen-protector-bundle",
    name: "Tempered glass screen protector (2 pack)",
    price: 39,
    category: "Protection",
    image: telstraAccessoryImage("screen-protector-bundle"),
  },
];

export function accessoryBySlug(slug: string) {
  return ACCESSORIES.find((a) => a.slug === slug);
}
