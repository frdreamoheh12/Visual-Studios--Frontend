import { ProductBrowser } from "@/components/marketplace/ProductBrowser";

export default function ResourcesPage() {
  return (
    <ProductBrowser
      kind="resource"
      title="Resources"
      description="Guides, configurations, and reusable assets for your server."
    />
  );
}
