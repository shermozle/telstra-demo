import { SERVICE_IDS } from "@/data/service-ids";
import { PlanChangeClient } from "./PlanChangeClient";

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ id }));
}

export default function PlanPage({
  params,
}: {
  params: { id: string };
}) {
  return <PlanChangeClient id={params.id} />;
}
