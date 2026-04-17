import Link from "next/link";
import { ACCESSORIES } from "@/data/accessories";

export default function AccessoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Accessories</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ACCESSORIES.map((a) => (
          <Link
            key={a.slug}
            href={`/accessories/${a.slug}`}
            className="rounded-xl border bg-white p-4 shadow-sm hover:border-telstra-blue"
          >
            <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-neutral-50">
              <img
                src={a.image}
                alt=""
                className="max-h-full max-w-full object-contain p-2"
              />
            </div>
            <p className="font-semibold">{a.name}</p>
            <p className="text-telstra-blue">${a.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
