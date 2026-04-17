import { DeviceCatalog } from "@/components/catalog/DeviceCatalog";

export default function MobilesOnAPlanPage() {
  return (
    <div>
      <div className="border-b bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-telstra-dark md:text-3xl">
            Mobiles on a plan
          </h1>
          <p className="mt-2 text-gray-600">
            Choose a device and pair it with an Upfront plan.
          </p>
        </div>
      </div>
      <DeviceCatalog />
    </div>
  );
}
