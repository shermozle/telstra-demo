"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_ADDRESSES } from "@/data/internet";
import { TELSTRA_MARKETING } from "@/lib/telstra-assets";
import { track } from "@/lib/track";

export default function InternetHubPage() {
  const [addr, setAddr] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const tech = ["FTTP", "HFC", "FTTN", "5G"][addr.length % 4];
    setResult(`${tech} available — typical speeds 50–1000 Mbps`);
    track("Address Checked", {
      technology_type: tech,
      result: "available",
      suburb: "Sydney",
      state: "NSW",
    });
  }

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-14 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${TELSTRA_MARKETING.internetHeroDesktop})`,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-950/90 via-telstra-blue/88 to-blue-950/85"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            nbn, 5G or Satellite? Get the right internet plan for you
          </h1>
          <form onSubmit={check} className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
            <input
              list="addr-sug"
              className="flex-1 rounded px-4 py-3 text-telstra-dark"
              placeholder="Enter your address"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
            />
            <datalist id="addr-sug">
              {MOCK_ADDRESSES.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
            <button
              type="submit"
              className="rounded bg-white px-6 py-3 font-semibold text-telstra-blue"
            >
              Check address
            </button>
          </form>
          {result && (
            <p className="mt-4 max-w-xl rounded bg-white/10 p-4 text-sm">{result}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-white">
              <th className="p-3 text-left">Technology</th>
              <th className="p-3">Best for</th>
              <th className="p-3">From</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["nbn", "Most homes", "$80/mth"],
              ["5G Home", "Renters / quick setup", "$85/mth"],
              ["Satellite", "Regional", "$115/mth"],
            ].map(([a, b, c]) => (
              <tr key={a} className="border-b">
                <td className="p-3 font-medium">{a}</td>
                <td className="p-3 text-center">{b}</td>
                <td className="p-3 text-center">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["nbn plans", "/internet/plans"],
            ["5G Home Internet", "/internet/5g-home-internet"],
            ["Wi-Fi boosters", "/accessories"],
          ].map(([t, h]) => (
            <Link
              key={h}
              href={h}
              className="rounded-xl border bg-white p-6 font-semibold text-telstra-blue shadow-sm"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
