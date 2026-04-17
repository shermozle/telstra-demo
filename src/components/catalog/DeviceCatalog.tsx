"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEVICES, type DeviceSpec } from "@/data/devices";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";

const BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "Motorola",
  "Nokia",
  "Telstra",
] as const;

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

export function DeviceCatalog() {
  const [brands, setBrands] = useState<string[]>([]);
  const [fiveGOnly, setFiveGOnly] = useState(false);
  const [esimOnly, setEsimOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(200);
  const [sort, setSort] = useState<Sort>("featured");
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list: DeviceSpec[] = [...DEVICES];
    if (brands.length)
      list = list.filter((d) => brands.includes(d.brand));
    if (fiveGOnly) list = list.filter((d) => d.fiveG);
    if (esimOnly) list = list.filter((d) => d.esim);
    list = list.filter((d) => d.pricePerMonth24 <= priceMax);
    if (sort === "price-asc")
      list.sort((a, b) => a.pricePerMonth24 - b.pricePerMonth24);
    if (sort === "price-desc")
      list.sort((a, b) => b.pricePerMonth24 - a.pricePerMonth24);
    if (sort === "newest") list.reverse();
    return list;
  }, [brands, fiveGOnly, esimOnly, priceMax, sort]);

  useEffect(() => {
    track("Product List Viewed", {
      category: "mobiles-on-a-plan",
      filter_brand: brands.join(",") || "all",
      filter_connectivity: [fiveGOnly && "5G", esimOnly && "eSIM"]
        .filter(Boolean)
        .join(",") || "any",
      sort_by: sort,
      results_count: filtered.length,
    });
  }, [brands, fiveGOnly, esimOnly, sort, filtered.length]);

  function toggleBrand(b: string) {
    setBrands((prev) => {
      const next = prev.includes(b)
        ? prev.filter((x) => x !== b)
        : [...prev, b];
      track("Product Filter Applied", {
        filter_type: "brand",
        filter_value: b,
        results_count: filtered.length,
      });
      return next;
    });
  }

  function toggleCompare(slug: string) {
    setCompare((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      const next = [...prev, slug];
      const names = next
        .map((s) => DEVICES.find((d) => d.slug === s)?.name)
        .filter(Boolean);
      track("Product Compared", {
        products: names,
        comparison_count: next.length,
      });
      return next;
    });
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <aside className="w-full shrink-0 space-y-6 rounded-xl border bg-white p-4 lg:w-64">
        <h2 className="font-bold text-telstra-dark">Filters</h2>
        <div>
          <p className="mb-2 text-sm font-medium">Brand</p>
          <div className="space-y-2">
            {BRANDS.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {b}
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fiveGOnly}
            onChange={(e) => {
              setFiveGOnly(e.target.checked);
              track("Product Filter Applied", {
                filter_type: "connectivity",
                filter_value: "5G",
                results_count: filtered.length,
              });
            }}
          />
          5G
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={esimOnly}
            onChange={(e) => setEsimOnly(e.target.checked)}
          />
          eSIM compatible
        </label>
        <div>
          <p className="mb-2 text-sm font-medium">Max device repayment /mth</p>
          <input
            type="range"
            min={5}
            max={200}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Up to ${priceMax}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Sort</p>
          <select
            className="w-full rounded border px-2 py-1 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price low–high</option>
            <option value="price-desc">Price high–low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </aside>

      <div className="flex-1">
        <p className="mb-4 text-sm text-gray-600">
          {filtered.length} devices
        </p>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <div
              key={d.slug}
              className={cn(
                "flex flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
              )}
            >
              <Link href={`/mobile-phones/mobiles-on-a-plan/${d.slug}`}>
                <div className="mb-3 flex h-44 w-full items-center justify-center rounded-lg bg-gradient-to-b from-neutral-50 to-neutral-100">
                  <img
                    src={d.heroImage}
                    alt=""
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>
                <h3 className="font-semibold text-telstra-dark">{d.name}</h3>
                <p className="text-sm text-telstra-blue">
                  Device from ${d.pricePerMonth24.toFixed(2)}/mth
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Min cost ${(d.pricePerMonth24 * 24).toFixed(0)} over 24 months
                  plus plan
                </p>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="mt-3 text-xs"
                onClick={() => toggleCompare(d.slug)}
              >
                {compare.includes(d.slug) ? "Remove compare" : "Compare"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {compare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-4 shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium">
              Compare {compare.length} of 3 devices
            </p>
            <div className="flex gap-2">
              {compare.map((slug) => (
                <span
                  key={slug}
                  className="rounded-full bg-telstra-grey px-3 py-1 text-xs"
                >
                  {DEVICES.find((d) => d.slug === slug)?.name}
                </span>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCompare([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
