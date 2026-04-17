import Link from "next/link";

export default function OrderTrackingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">Track your order</h1>
      <p className="mt-4 text-gray-600">
        Demo: your order is being prepared for dispatch.
      </p>
      <Link href="/" className="mt-6 inline-block text-telstra-blue underline">
        Back home
      </Link>
    </div>
  );
}
