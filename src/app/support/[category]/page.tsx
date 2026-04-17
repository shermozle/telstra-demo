import { SUPPORT_CATEGORIES } from "@/data/support-categories";
import { SupportCategoryClient } from "./SupportCategoryClient";

export function generateStaticParams() {
  return SUPPORT_CATEGORIES.map((category) => ({ category }));
}

export default function SupportCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <SupportCategoryClient category={params.category} />;
}
