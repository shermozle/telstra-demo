"use client";

import Link from "next/link";
import { getEffectiveVariant } from "@/lib/amplitude";
import { TELSTRA_MARKETING } from "@/lib/telstra-assets";
import { useDemoStore } from "@/store/useDemoStore";

export function HomeHero() {
  const flashDeal = useDemoStore((s) => s.flashDealActive);
  const { value: heroVariant } = getEffectiveVariant(
    "homepage-hero-variant",
    "satellite"
  );

  const titles: Record<string, { title: string; subtitle: string }> = {
    satellite: {
      title: "Australia’s largest satellite & mobile network",
      subtitle: "Stay connected at home and on the go with Telstra.",
    },
    device: {
      title: "The latest devices on Australia’s largest mobile network",
      subtitle: "New iPhone, Galaxy & Pixel — on a plan or outright.",
    },
    promo: {
      title: "Limited time — bundle mobile & internet and save",
      subtitle: "See current deals and exclusive online offers.",
    },
  };

  const t =
    titles[heroVariant] ??
    titles[
      flashDeal ? "promo" : "satellite"
    ];

  return (
    <section className="relative overflow-hidden px-4 py-16 text-white md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${TELSTRA_MARKETING.mobileHubFamily})`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-telstra-blue/92 via-blue-900/88 to-blue-950/90"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          {flashDeal ? "Flash deal" : "Personal"}
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">{t.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/mobile-phones/mobiles-on-a-plan"
            className="rounded-md bg-white px-6 py-3 font-semibold text-telstra-blue hover:bg-telstra-grey"
          >
            Shop mobiles
          </Link>
          <Link
            href="/internet/plans"
            className="rounded-md border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            nbn plans
          </Link>
        </div>
      </div>
    </section>
  );
}
