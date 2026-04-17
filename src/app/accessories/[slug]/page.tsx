import { notFound } from "next/navigation";
import { ACCESSORIES, accessoryBySlug } from "@/data/accessories";
import { AccessoryDetail } from "@/components/accessories/AccessoryDetail";

export function generateStaticParams() {
  return ACCESSORIES.map((a) => ({ slug: a.slug }));
}

export default function AccessoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const a = accessoryBySlug(params.slug);
  if (!a) notFound();
  return <AccessoryDetail accessory={a} />;
}
