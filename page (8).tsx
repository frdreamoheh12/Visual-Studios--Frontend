"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Blocks } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { LibraryItem } from "@/lib/types";

export default function DownloadsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { items: LibraryItem[] } }>("/library");
      setItems(res.data.items);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load your library",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDownload(item: LibraryItem) {
    setBusyId(item.id);
    try {
      const res = await api.post<{ success: boolean; data: { downloadUrl: string } }>(
        `/products/${item.id}/download`
      );
      window.open(res.data.downloadUrl, "_blank");
    } catch (err) {
      push({
        variant: "error",
        title: "Download failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Downloads</h1>
        <p className="mt-2 text-sm text-white/50">Everything you own — free grabs and purchases — in one place.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Download}
          title="Your library is empty."
          description="Explore the marketplace and discover something new."
          action={
            <Link href="/marketplace">
              <Button size="sm" magnetic={false}>
                Explore Marketplace
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="vs-panel vs-panel-hover flex flex-col gap-4 rounded-xl2 p-5">
              <div
                className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
              >
                <Blocks size={24} className="text-white/50" />
              </div>
              <div>
                <Link href={`/marketplace/${item.slug}`} className="vs-focus text-sm font-medium text-white hover:text-accent-violet">
                  {item.title}
                </Link>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge tone="neutral">{item.category}</Badge>
                  <Badge tone={item.source === "free" ? "green" : "violet"}>
                    {item.source === "free" ? "Free" : "Purchased"}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                magnetic={false}
                onClick={() => handleDownload(item)}
                isLoading={busyId === item.id}
                className="mt-auto w-full"
              >
                <Download size={14} /> Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
