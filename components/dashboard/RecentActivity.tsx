"use client";

import { motion } from "framer-motion";
import { History, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import type { DashboardSummary } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { timeAgo } from "@/lib/time";

const TYPE_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

const TYPE_CLASSES = {
  info: "bg-accent-blue/10 text-accent-blue",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  error: "bg-rose-500/10 text-rose-400",
} as const;

export function RecentActivity({ activity }: { activity: DashboardSummary["recentActivity"] }) {
  return (
    <div className="vs-panel h-full rounded-xl2 p-6">
      <h2 className="font-display text-sm font-semibold text-white">Recent Activity</h2>

      {activity.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={History}
            title="Nothing here yet"
            description="Your recent account activity will show up here."
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-1">
          {activity.map((item, i) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TYPE_CLASSES[item.type]}`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/90">{item.title}</p>
                  <p className="truncate text-xs text-white/40">{item.message}</p>
                </div>
                <span className="shrink-0 text-xs text-white/30">{timeAgo(item.createdAt)}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
