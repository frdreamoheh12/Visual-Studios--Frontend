"use client";

import { motion } from "framer-motion";
import { Download, ShoppingBag, Heart, Coins } from "lucide-react";
import { StatCard } from "./StatCard";
import type { DashboardSummary } from "@/lib/types";

const CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DashboardStats({ stats }: { stats: DashboardSummary["stats"] }) {
  const items = [
    { icon: Download, label: "Downloads", value: stats.downloads, tone: "violet" as const },
    { icon: ShoppingBag, label: "Purchases", value: stats.purchases, tone: "blue" as const },
    { icon: Heart, label: "Favorites", value: stats.favorites, tone: "cyan" as const },
    { icon: Coins, label: "Credits", value: stats.credits.toLocaleString(), tone: "amber" as const },
  ];

  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {items.map((item) => (
        <motion.div key={item.label} variants={ITEM_VARIANTS}>
          <StatCard {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
