"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export function PlaceholderPage({ icon: Icon, title, description, badge = "Coming soon" }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-[60vh] flex-col items-center justify-center gap-4 overflow-hidden rounded-xl2 text-center"
    >
      <div className="vs-voxel-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-30" aria-hidden="true" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Icon size={28} className="text-accent-violet" />
      </div>
      <div className="relative">
        <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">{description}</p>
      </div>
      <span className="relative rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/40">
        {badge}
      </span>
    </motion.div>
  );
}
