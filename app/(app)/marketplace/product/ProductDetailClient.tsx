"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Blocks,
  Star,
  Download,
  Heart,
  ArrowLeft,
  Tag,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { useDashboardData } from "@/lib/dashboard-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { Product, ProductDetailResponse } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { push } = useToast();
  const { reload: reloadDashboard } = useDashboardData();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await api.get<{ success: boolean; data: ProductDetailResponse }>(
        `/products/${params.slug}`
      );
      setProduct(res.data.product);
      setRelated(res.data.related);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 404) {
        setNotFound(true);
      } else {
        push({
          variant: "error",
          title: "Couldn't load listing",
          description: err instanceof ApiClientError ? err.message : "Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.slug, push]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleGetDownload() {
    if (!product) return;
    setActionBusy(true);
    try {
      if (!product.isOwned && !product.isFree) {
        // Purchase then download
        await api.post("/orders", { productIds: [product.id], paymentMethod: "credits" });
        push({ variant: "success", title: "Purchase complete", description: `${product.title} added to your library.` });
      }
      const res = await api.post<{ success: boolean; data: { downloadUrl: string } }>(
        `/products/${product.id}/download`
      );
      window.open(res.data.downloadUrl, "_blank");
      push({ variant: "success", title: "Download started", description: product.title });
      setProduct((p) => (p ? { ...p, isOwned: true, downloadsCount: p.downloadsCount + 1 } : p));
      reloadDashboard();
    } catch (err) {
      push({
        variant: "error",
        title: product.isFree || product.isOwned ? "Download failed" : "Purchase failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setActionBusy(false);
    }
  }

  async function toggleFavorite() {
    if (!product) return;
    setFavoriteBusy(true);
    try {
      if (product.isFavorited) {
        await api.del(`/favorites/${product.id}`);
      } else {
        await api.post(`/favorites/${product.id}`);
      }
      setProduct((p) => (p ? { ...p, isFavorited: !p.isFavorited } : p));
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't update favorites",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setFavoriteBusy(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl2" />
        <Skeleton className="h-40 w-full rounded-xl2" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-xl font-semibold text-white">Listing not found</p>
        <p className="text-sm text-white/40">That product doesn&apos;t exist or was removed.</p>
        <Link href="/marketplace">
          <Button size="sm" magnetic={false}>
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={() => router.back()}
        className="vs-focus flex w-fit items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <div
            className={`vs-panel relative flex h-56 items-center justify-center overflow-hidden rounded-xl2 bg-gradient-to-br ${product.gradient}`}
          >
            <div className="vs-voxel-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
            <Blocks size={56} className="text-white/40" />
            <div className="absolute right-4 top-4">
              <Badge tone={product.isFree ? "green" : "amber"}>
                {product.isFree ? "Free" : `₹${product.price.toLocaleString("en-IN")}`}
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="violet">{product.kind}</Badge>
              <Badge tone="neutral">{product.category}</Badge>
              {product.isFeatured && <Badge tone="amber">Featured</Badge>}
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">{product.title}</h1>
            <p className="mt-2 text-sm text-white/50">{product.shortDescription}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <UserIcon size={13} /> {product.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={13} className="text-amber-400" fill="currentColor" />
                {product.ratingCount > 0 ? `${product.ratingAvg.toFixed(1)} (${product.ratingCount})` : "No ratings yet"}
              </span>
              <span className="flex items-center gap-1.5">
                <Download size={13} /> {product.downloadsCount.toLocaleString()} downloads
              </span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono">
                MC {product.minecraftVersion}
              </span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono">v{product.version}</span>
            </div>

            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50"
                  >
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="vs-panel mt-6 rounded-xl2 p-6">
              <h2 className="font-display text-sm font-semibold text-white">Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/60">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="vs-panel sticky top-6 rounded-xl2 p-6">
            <p className="font-display text-2xl font-semibold text-white">
              {product.isFree ? "Free" : `₹${product.price.toLocaleString("en-IN")}`}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {product.isOwned && !product.isFree ? "You own this item" : product.isFree ? "No cost to download" : "One-time purchase"}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <Button onClick={handleGetDownload} isLoading={actionBusy} magnetic={false} className="w-full">
                {actionBusy ? (
                  "Processing..."
                ) : product.isOwned || product.isFree ? (
                  <>
                    <Download size={16} /> Download
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Buy & Download
                  </>
                )}
              </Button>

              <Button
                onClick={toggleFavorite}
                isLoading={favoriteBusy}
                variant="secondary"
                magnetic={false}
                className="w-full"
              >
                <Heart size={16} className={product.isFavorited ? "fill-rose-400 text-rose-400" : ""} />
                {product.isFavorited ? "Saved to Favorites" : "Add to Favorites"}
              </Button>
            </div>

            {!product.isFree && !product.isOwned && (
              <p className="mt-4 text-xs text-white/40">
                Payment is deducted from your Visual Studio credits balance.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {related.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Related listings</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
