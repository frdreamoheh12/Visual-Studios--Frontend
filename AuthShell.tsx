"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Box } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-white/5 bg-base-900 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="vs-voxel-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="bg-vs-glow absolute inset-0" aria-hidden="true" />

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vs-gradient">
            <Box size={16} className="text-white" />
          </div>
          <span className="font-display text-base font-semibold text-white">Visual Studio</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="vs-gradient-text font-display text-4xl font-semibold leading-tight">
            Build. Create.
            <br />
            Upgrade.
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/40">
            Join a studio built for creators shipping real Minecraft plugins, builds, and tools.
          </p>
        </motion.div>

        <p className="relative z-10 text-xs text-white/30">© 2026 Visual Studio</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vs-gradient">
              <Box size={16} className="text-white" />
            </div>
            <span className="font-display text-base font-semibold text-white">Visual Studio</span>
          </Link>

          <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
