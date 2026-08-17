"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useDashboardData } from "@/lib/dashboard-context";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecommendedResources } from "@/components/dashboard/RecommendedResources";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardError } from "@/components/dashboard/DashboardError";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, reload } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <DashboardError onRetry={reload} />;

  return (
    <div className="flex flex-col gap-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="vs-panel relative overflow-hidden rounded-xl2 p-6 sm:p-8"
      >
        <div className="vs-voxel-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="bg-vs-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Welcome back, <span className="vs-gradient-text">{user?.username}</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Here&apos;s what&apos;s happening with your Visual Studio account.
          </p>
        </div>
      </motion.section>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activity={data.recentActivity} />
        </div>
        <QuickActions />
      </div>

      <RecommendedResources />
    </div>
  );
}
