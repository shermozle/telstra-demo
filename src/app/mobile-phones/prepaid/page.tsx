export default function PrepaidPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pre-Paid</h1>
      <p className="mt-2 text-gray-600">
        Recharge when it suits you — demo copy only.
      </p>
      <div className="mt-8 rounded-2xl border bg-white p-8">
        <h2 className="font-bold">Pre-Paid Max</h2>
        <p className="mt-2 text-3xl text-telstra-blue">$30</p>
        <p className="text-sm text-gray-600">28 day expiry · 50GB</p>
      </div>
    </div>
  );
}
