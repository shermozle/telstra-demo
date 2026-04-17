import { SERVICE_IDS } from "@/data/service-ids";
import { UsageClient } from "./UsageClient";

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ id }));
}

export default function UsagePage({
  params,
}: {
  params: { id: string };
}) {
  return <UsageClient id={params.id} />;
}
