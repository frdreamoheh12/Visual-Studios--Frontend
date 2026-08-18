"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { Product } from "@/lib/types";

export default function FavoritesPage() {
  const { push } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { products: Product[] } }>("/favorites");
      setProducts(res.data.products);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load your favorites",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(product: Product) {
    setBusyId(product.id);
    try {
      await api.del(`/favorites/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't remove favorite",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Favorites</h1>
        <p className="mt-2 text-sm text-white/50">Listings you&apos;ve saved to check out later.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet."
          description="Save resources you want to find later."
          action={
            <Link href="/marketplace">
              <Button size="sm" magnetic={false}>
                Explore Marketplace
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={handleRemove}
              favoriteBusy={busyId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
