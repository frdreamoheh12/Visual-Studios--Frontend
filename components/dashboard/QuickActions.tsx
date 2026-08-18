"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Store, BookOpen, Wrench, Download, ArrowUpRight, type LucideIcon } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const ACTIONS: QuickAction[] = [
  { label: "Explore Marketplace", description: "Browse plugins, builds & services", href: "/marketplace", icon: Store },
  { label: "Browse Resources", description: "Guides, docs, and configurations", href: "/resources", icon: BookOpen },
  { label: "Request Development", description: "Get something custom built", href: "/services", icon: Wrench },
  { label: "View Downloads", description: "Your purchased and free files", href: "/downloads", icon: Download },
];

export function QuickActions() {
  return (
    <div className="vs-panel h-full rounded-xl2 p-6">
      <h2 className="font-display text-sm font-semibold text-white">Quick Actions</h2>
      <div className="mt-5 flex flex-col gap-3">
        {ACTIONS.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={action.href}
              className="vs-focus group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-all duration-200 hover:border-accent-violet/40 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-violet/10 text-accent-violet transition-transform duration-200 group-hover:scale-105">
                <action.icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{action.label}</p>
                <p className="truncate text-xs text-white/40">{action.description}</p>
              </div>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-white/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
