"use client";

import { Hammer } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export default function BuildsPage() {
  return (
    <PlaceholderPage
      icon={Hammer}
      title="Builds"
      description="Hand-crafted Minecraft structures and terrain. The builds marketplace is coming in a future phase."
    />
  );
}