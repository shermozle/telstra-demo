import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { DEVICES } from "@/data/devices";

export default function HomePage() {
  const carousel = DEVICES.slice(0, 4);

  return (
    <div>
      <HomeHero />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-xl font-bold text-telstra-dark">
          Quick links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Mobiles on a plan", "/mobile-phones/mobiles-on-a-plan"],
            ["SIM only plans", "/mobile-phones/sim-only-plans"],
            ["Outright phones", "/mobile-phones/mobiles-on-a-plan"],
            ["Pre-Paid", "/mobile-phones/prepaid"],
            ["Accessories", "/accessories"],
            ["Change phone/plan", "/my-telstra/services"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg border border-gray-200 bg-white p-4 font-medium text-telstra-blue shadow-sm hover:border-telstra-blue"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-bold text-telstra-dark">
            Recommended for you
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {carousel.map((d) => (
              <Link
                key={d.slug}
                href={`/mobile-phones/mobiles-on-a-plan/${d.slug}`}
                className="rounded-xl border bg-telstra-grey p-4 transition hover:shadow-md"
              >
                <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-b from-neutral-50 to-neutral-100">
                  <img
                    src={d.heroImage}
                    alt=""
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>
                <p className="font-semibold text-telstra-dark">{d.name}</p>
                <p className="text-sm text-gray-600">
                  Device from ${d.pricePerMonth24.toFixed(2)}/mth
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold text-telstra-dark">
          Keeping costs down
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "7 Day Price Match on eligible devices",
            "Trade in your old phone",
            "Pay less with Telstra Plus points",
          ].map((x) => (
            <div
              key={x}
              className="rounded-lg border border-dashed border-telstra-blue/40 bg-white p-4 text-sm"
            >
              {x}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-white px-4 py-8">
        <p className="text-center text-sm text-gray-600">Shop leading brands</p>
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-8 text-lg font-bold text-gray-400">
          {["Apple", "Samsung", "Google", "Motorola"].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
