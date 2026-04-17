"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";

export function SiteFooter() {
  const resetDemoData = useDemoStore((s) => s.resetDemoData);

  return (
    <footer className="mt-auto bg-telstra-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold">Help</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link href="/support" className="hover:underline">
                Support hub
              </Link>
            </li>
            <li>
              <Link href="/support/accounts-payments" className="hover:underline">
                Accounts & payments
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">About</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:underline">
                Our company
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Privacy and terms</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:underline">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of use
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Other Telstra sites</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:underline">
                Telstra Wholesale
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-xs text-white/70">
        <p className="mx-auto max-w-7xl leading-relaxed">
          We acknowledge the Traditional Custodians of Country throughout Australia
          and their continuing connection to land, culture, and community. We pay
          our respects to Elders past and present.
        </p>
        <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            className="text-sm text-telstra-blue underline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-4 w-4" /> Back to top
            </span>
          </button>
          <button
            type="button"
            className="rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
            onClick={() => resetDemoData()}
          >
            Reset demo data
          </button>
        </div>
        <p className="mx-auto mt-4 max-w-7xl text-[11px] text-white/50">
          Demo site — not affiliated with Telstra. For Amplitude product
          demonstrations only.
        </p>
      </div>
    </footer>
  );
}
