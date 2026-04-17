"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useDemoStore } from "@/store/useDemoStore";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function UsageClient({ id }: { id: string }) {
  const svc = useDemoStore((s) => s.services.find((x) => x.id === id));
  if (!svc) notFound();

  const bars = [2.1, 3.4, 1.2, 0.8, 4.2, 1.9, 2.7];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/my-telstra/services/${id}`} className="text-sm text-telstra-blue">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Usage history</h1>
      <div className="mt-6 flex gap-2 text-sm">
        <button type="button" className="rounded border bg-white px-3 py-1">
          Current period
        </button>
        <button type="button" className="rounded border px-3 py-1 text-gray-500">
          Previous
        </button>
      </div>
      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="font-bold">Data (daily)</h2>
        <div className="mt-4 flex h-40 items-end gap-2">
          {bars.map((gb, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-telstra-blue"
                style={{ height: `${(gb / 5) * 100}%` }}
              />
              <span className="text-[10px] text-gray-500">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="font-bold">Calls</h2>
        <p className="text-sm text-gray-600">No recent calls (demo).</p>
      </section>
      <button type="button" className="mt-6 text-telstra-blue underline">
        Download usage statement (mock)
      </button>
    </div>
  );
}
