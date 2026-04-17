import { SERVICE_IDS } from "@/data/service-ids";
import { ServiceDetailClient } from "./ServiceDetailClient";

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ id }));
}

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ServiceDetailClient id={params.id} />;
}
