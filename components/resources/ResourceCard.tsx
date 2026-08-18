"use client";

import { motion } from "framer-motion";
import { Star, Download, Blocks } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ResourceCardData {
  id: string;
  name: string;
  creator: string;
  category: string;
  minecraftVersion: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  price?: string;
  /** Tailwind gradient stops for the thumbnail, e.g. "from-accent-violet/30 via-accent-blue/20 to-transparent" */
  gradient?: string;
}

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="vs-panel vs-panel-hover group overflow-hidden rounded-xl2"
    >
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${
          resource.gradient ?? "from-accent-violet/30 via-accent-blue/20 to-transparent"
        }`}
      >
        <Blocks size={28} className="text-white/50 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute right-2.5 top-2.5">
          <Badge tone={resource.isPremium ? "amber" : "green"}>
            {resource.isPremium ? resource.price ?? "Premium" : "Free"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <p className="truncate text-sm font-medium text-white">{resource.name}</p>
        <p className="mt-0.5 truncate text-xs text-white/40">by {resource.creator}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-white/40">
          <span className="rounded-full border border-white/10 px-2 py-0.5">{resource.category}</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono">
            {resource.minecraftVersion}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" fill="currentColor" />
            {resource.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Download size={12} />
            {resource.downloads.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
