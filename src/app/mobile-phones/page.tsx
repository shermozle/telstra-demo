import Link from "next/link";
import { TELSTRA_MARKETING } from "@/lib/telstra-assets";

export default function MobileHubPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-14 text-white">
        <div
          className="absolute inset-0 bg-cover bg-[center_20%]"
          style={{
            backgroundImage: `url(${TELSTRA_MARKETING.mobileHubFamily})`,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-telstra-blue/93 to-blue-900/88"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Join Australia&apos;s largest mobile network today
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Phones on a plan, SIM only, Pre-Paid and more — all on Telstra 5G.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Mobiles on a plan", "/mobile-phones/mobiles-on-a-plan"],
          ["SIM only plans", "/mobile-phones/sim-only-plans"],
          ["Outright phones", "/mobile-phones/mobiles-on-a-plan"],
          ["Pre-Paid", "/mobile-phones/prepaid"],
          ["Accessories", "/accessories"],
          ["Change phone/plan", "/my-telstra/services"],
        ].map(([t, h]) => (
          <Link
            key={h + t}
            href={h}
            className="rounded-xl border bg-white p-6 font-semibold text-telstra-blue shadow-sm hover:border-telstra-blue"
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}
