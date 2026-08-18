import { ProductBrowser } from "@/components/marketplace/ProductBrowser";

export default function PluginsPage() {
  return (
    <ProductBrowser
      kind="plugin"
      title="Plugins"
      description="Server plugins built for Paper, Spigot, Purpur, and Folia."
    />
  );
}
