export interface DeviceSpec {
  slug: string;
  name: string;
  brand: string;
  pricePerMonth24: number;
  rrp: number;
  fiveG: boolean;
  esim: boolean;
  colours: { name: string; hex: string }[];
  storages: { label: string; priceAddPerMonth: number }[];
  heroImage: string;
}

/**
 * Product shots from the live Telstra storefront (DAM), copied to
 * `public/images/telstra/devices/` via `scripts/download-telstra-images.sh`.
 */
export function telstraDeviceImage(slug: string) {
  return `/images/telstra/devices/${slug}.png`;
}

export const DEVICES: DeviceSpec[] = [
  {
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    pricePerMonth24: 65.79,
    rrp: 2499,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Natural Titanium", hex: "#8B8B83" },
      { name: "Blue Titanium", hex: "#4A6FA5" },
      { name: "White Titanium", hex: "#E8E8E6" },
      { name: "Black Titanium", hex: "#3D3D3D" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 5.5 },
      { label: "1TB", priceAddPerMonth: 11 },
    ],
    heroImage: telstraDeviceImage("iphone-17-pro-max"),
  },
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    pricePerMonth24: 52.04,
    rrp: 1999,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Natural Titanium", hex: "#8B8B83" },
      { name: "Blue Titanium", hex: "#4A6FA5" },
      { name: "White Titanium", hex: "#E8E8E6" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 4.5 },
      { label: "1TB", priceAddPerMonth: 9 },
    ],
    heroImage: telstraDeviceImage("iphone-17-pro"),
  },
  {
    slug: "iphone-17",
    name: "iPhone 17",
    brand: "Apple",
    pricePerMonth24: 39.54,
    rrp: 1499,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Teal", hex: "#5a9a8a" },
      { name: "Lavender", hex: "#9a8ab8" },
    ],
    storages: [
      { label: "128GB", priceAddPerMonth: 0 },
      { label: "256GB", priceAddPerMonth: 3 },
      { label: "512GB", priceAddPerMonth: 7 },
    ],
    heroImage: telstraDeviceImage("iphone-17"),
  },
  {
    slug: "iphone-air",
    name: "iPhone Air",
    brand: "Apple",
    pricePerMonth24: 47.88,
    rrp: 1799,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Sky Blue", hex: "#7eb8d8" },
      { name: "Light Gold", hex: "#d4c4a8" },
      { name: "Space Grey", hex: "#6a6a6a" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 4 },
    ],
    heroImage: telstraDeviceImage("iphone-air"),
  },
  {
    slug: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    brand: "Samsung",
    pricePerMonth24: 55.79,
    rrp: 2149,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Titanium Grey", hex: "#6a6a6a" },
      { name: "Titanium Violet", hex: "#6a5a8a" },
      { name: "Titanium Yellow", hex: "#c4b86a" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 5 },
      { label: "1TB", priceAddPerMonth: 10 },
    ],
    heroImage: telstraDeviceImage("galaxy-s26-ultra"),
  },
  {
    slug: "galaxy-s26-plus",
    name: "Galaxy S26+",
    brand: "Samsung",
    pricePerMonth24: 44.75,
    rrp: 1649,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Onyx Black", hex: "#1a1a1a" },
      { name: "Icy Blue", hex: "#8ab8d8" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 4 },
    ],
    heroImage: telstraDeviceImage("galaxy-s26-plus"),
  },
  {
    slug: "galaxy-s26",
    name: "Galaxy S26",
    brand: "Samsung",
    pricePerMonth24: 34.54,
    rrp: 1299,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Graphite", hex: "#4a4a4a" },
      { name: "Mint", hex: "#7ab89a" },
    ],
    storages: [
      { label: "128GB", priceAddPerMonth: 0 },
      { label: "256GB", priceAddPerMonth: 3 },
    ],
    heroImage: telstraDeviceImage("galaxy-s26"),
  },
  {
    slug: "pixel-10-pro-xl",
    name: "Pixel 10 Pro XL",
    brand: "Google",
    pricePerMonth24: 39.54,
    rrp: 1499,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Obsidian", hex: "#2a2a2a" },
      { name: "Porcelain", hex: "#e8e4dc" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 4 },
    ],
    heroImage: telstraDeviceImage("pixel-10-pro-xl"),
  },
  {
    slug: "pixel-10-pro",
    name: "Pixel 10 Pro",
    brand: "Google",
    pricePerMonth24: 33.29,
    rrp: 1249,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Obsidian", hex: "#2a2a2a" },
      { name: "Hazel", hex: "#8a7a6a" },
    ],
    storages: [
      { label: "256GB", priceAddPerMonth: 0 },
      { label: "512GB", priceAddPerMonth: 3.5 },
    ],
    heroImage: telstraDeviceImage("pixel-10-pro"),
  },
  {
    slug: "pixel-10",
    name: "Pixel 10",
    brand: "Google",
    pricePerMonth24: 23.29,
    rrp: 849,
    fiveG: true,
    esim: true,
    colours: [
      { name: "Obsidian", hex: "#2a2a2a" },
      { name: "Wintergreen", hex: "#6a9a7a" },
    ],
    storages: [
      { label: "128GB", priceAddPerMonth: 0 },
      { label: "256GB", priceAddPerMonth: 2.5 },
    ],
    heroImage: telstraDeviceImage("pixel-10"),
  },
  {
    slug: "nokia-g42-5g",
    name: "Nokia G42 5G",
    brand: "Nokia",
    pricePerMonth24: 8.29,
    rrp: 299,
    fiveG: true,
    esim: false,
    colours: [
      { name: "So Grey", hex: "#6a6a6a" },
      { name: "So Purple", hex: "#7a6a9a" },
    ],
    storages: [
      { label: "128GB", priceAddPerMonth: 0 },
      { label: "256GB", priceAddPerMonth: 1.5 },
    ],
    heroImage: telstraDeviceImage("nokia-g42-5g"),
  },
  {
    slug: "telstra-essential-smart-4",
    name: "Telstra Essential Smart 4",
    brand: "Telstra",
    pricePerMonth24: 5.38,
    rrp: 129,
    fiveG: false,
    esim: false,
    colours: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Blue", hex: "#0d54ff" },
    ],
    storages: [{ label: "32GB", priceAddPerMonth: 0 }],
    heroImage: telstraDeviceImage("telstra-essential-smart-4"),
  },
];

export const PLAN_TIERS = [
  {
    id: "basic",
    name: "Basic",
    pricePerMonth: 58,
    dataGB: 20,
    tag: null as string | null,
  },
  {
    id: "essential",
    name: "Essential",
    pricePerMonth: 68,
    dataGB: 50,
    tag: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    pricePerMonth: 88,
    dataGB: 200,
    tag: null as string | null,
  },
] as const;

export const ADD_ONS = [
  { name: "International Calling Pack", pricePerMonth: 10 },
  { name: "International Roaming (from $5/day)", pricePerMonth: 0 },
  { name: "Device Security by McAfee", pricePerMonth: 10 },
];

export function deviceBySlug(slug: string) {
  return DEVICES.find((d) => d.slug === slug);
}
