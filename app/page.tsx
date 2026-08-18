"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Puzzle, Blocks, Settings2, Wrench, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const FLOATING_CARDS = [
  { icon: Puzzle, label: "Plugin", sub: "CSClans v3.2", delay: 0, x: "-8%", y: "10%" },
  { icon: Blocks, label: "Minecraft Build", sub: "Skyward Citadel", delay: 0.4, x: "82%", y: "6%" },
  { icon: Settings2, label: "Configuration", sub: "DeluxeHub Reload", delay: 0.8, x: "-4%", y: "62%" },
  { icon: Wrench, label: "Setup", sub: "Velocity Network", delay: 1.2, x: "86%", y: "58%" },
  { icon: Sparkles, label: "Development", sub: "Custom Systems", delay: 1.6, x: "42%", y: "80%" },
];

const SERVICES_PREVIEW = [
  { title: "Plugin Development", desc: "Custom Paper/Spigot plugins built to spec, from GUIs to Folia-safe schedulers." },
  { title: "Server Setup", desc: "Full network provisioning — Velocity, permissions, hub, and world configuration." },
  { title: "Minecraft Builds", desc: "Hand-crafted structures and terrain, from spawn hubs to full survival worlds." },
  { title: "Server Optimization", desc: "TPS diagnostics, garbage-collection tuning, and plugin conflict resolution." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="vs-voxel-grid pointer-events-none absolute inset-x-0 top-0 h-[900px]" aria-hidden="true" />
        <div className="bg-vs-glow pointer-events-none absolute inset-x-0 top-0 h-[900px]" aria-hidden="true" />

        {/* Hero */}
        <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-40 pt-28 text-center sm:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge tone="violet" className="mb-6">
              Now building on Paper 1.21 &amp; Folia
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl"
          >
            VISUAL STUDIO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="vs-gradient-text mt-4 font-display text-2xl font-medium sm:text-3xl"
          >
            Build. Create. Upgrade.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl text-balance text-base text-white/50 sm:text-lg"
          >
            A modern Minecraft development studio for creators, developers, and server owners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/marketplace">
              <Button size="lg" className="gap-2">
                Explore Marketplace
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Start Creating
              </Button>
            </Link>
          </motion.div>

          {/* Floating resource cards */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
            {FLOATING_CARDS.map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: card.delay }}
                style={{ left: card.x, top: card.y }}
                className="absolute animate-float"
              >
                <div className="vs-panel flex items-center gap-3 rounded-xl2 px-4 py-3 shadow-card">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-accent-violet">
                    <card.icon size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-white">{card.label}</p>
                    <p className="text-[11px] text-white/40">{card.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 pb-24 sm:grid-cols-4">
          {[
            { value: "1,200+", label: "Resources" },
            { value: "40k+", label: "Downloads" },
            { value: "300+", label: "Creators" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/40">{stat.label}</p>
            </Card>
          ))}
        </section>

        {/* Services preview */}
        <section className="mx-auto max-w-5xl px-6 pb-32">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">Development services</h2>
              <p className="mt-2 max-w-md text-sm text-white/50">
                Hire the studio directly for custom plugin work, server builds, and optimization.
              </p>
            </div>
            <Link href="/services">
              <Button variant="secondary" className="gap-1.5">
                View all services
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES_PREVIEW.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card>
                  <h3 className="font-display text-lg font-medium text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{service.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
