export const NBN_PLANS = [
  {
    id: "nbn25",
    name: "Basic",
    speedLabel: "nbn 25",
    downUp: "25/10 Mbps",
    price: 80,
    busy: "24 Mbps",
  },
  {
    id: "nbn50",
    name: "Standard",
    speedLabel: "nbn 50",
    downUp: "50/20 Mbps",
    price: 90,
    busy: "47 Mbps",
  },
  {
    id: "nbn100",
    name: "Fast",
    speedLabel: "nbn 100",
    downUp: "100/20 Mbps",
    price: 110,
    busy: "96 Mbps",
  },
  {
    id: "nbn250",
    name: "Superfast",
    speedLabel: "nbn 250",
    downUp: "250/25 Mbps",
    price: 140,
    busy: "215 Mbps",
  },
] as const;

export const MOCK_ADDRESSES = [
  "42 George Street, Sydney NSW 2000",
  "100 Harris Street, Pyrmont NSW 2009",
  "1 Barangaroo Avenue, Sydney NSW 2000",
  "88 Church Street, Parramatta NSW 2150",
];
