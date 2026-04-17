import Link from "next/link";

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Deals & promotions</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          href="/mobile-phones/mobiles-on-a-plan"
          className="rounded-2xl border bg-white p-8 shadow-sm hover:border-telstra-blue"
        >
          <h2 className="text-xl font-bold">Mobile bundle savings</h2>
          <p className="mt-2 text-gray-600">Save when you add a new device</p>
        </Link>
        <Link
          href="/internet/plans"
          className="rounded-2xl border bg-white p-8 shadow-sm hover:border-telstra-blue"
        >
          <h2 className="text-xl font-bold">nbn introductory offers</h2>
          <p className="mt-2 text-gray-600">50% off for 2 months with ONLINE50</p>
        </Link>
      </div>
    </div>
  );
}
