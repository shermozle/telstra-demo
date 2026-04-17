import { notFound } from "next/navigation";
import { deviceBySlug, DEVICES } from "@/data/devices";
import { DeviceDetail } from "@/components/device/DeviceDetail";

export function generateStaticParams() {
  return DEVICES.map((d) => ({ slug: d.slug }));
}

export default function DeviceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const device = deviceBySlug(params.slug);
  if (!device) notFound();
  return <DeviceDetail device={device} />;
}
