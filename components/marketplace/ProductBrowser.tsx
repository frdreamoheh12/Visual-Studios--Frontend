"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import clsx from "clsx";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Product, ProductKind, ProductListResponse } from "@/lib/types";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Downloaded" },
  { value: "rating", label: "Top Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

interface ProductBrowserProps {
  kind?: ProductKind;
  title: string;
  description: string;
}

export function ProductBrowser({ kind, title, description }: ProductBrowserProps) {
  const { push } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [free, setFree] = useState<"all" | "true" | "false">("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, free, sort, kind]);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (kind) params.set("kind", kind);
      if (category) params.set("category", category);
      if (free !== "all") params.set("free", free);
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("sort", sort);
      params.set("page", String(page));

      const res = await api.get<{ success: boolean; data: ProductListResponse }>(
        `/products?${params.toString()}`
      );
      setProducts(res.data.products);
      setCategories(res.data.categories);
      setPagination(res.data.pagination);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load listings",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [kind, category, free, debouncedSearch, sort, page, push]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFavorite(product: Product) {
    setFavoriteBusyId(product.id);
    try {
      if (product.isFavorited) {
        await api.del(`/favorites/${product.id}`);
      } else {
        await api.post(`/favorites/${product.id}`);
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFavorited: !p.isFavorited } : p))
      );
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't update favorites",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setFavoriteBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">{description}</p>
      </motion.div>

      <div className="vs-panel flex flex-col gap-3 rounded-xl2 p-4 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag, or description..."
            className="vs-focus h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-accent-violet/60"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="vs-focus h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white focus:border-accent-violet/60 sm:w-auto"
        >
          <option value="" className="bg-[#0b0b14]">
            All categories
          </option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#0b0b14]">
              {c}
            </option>
          ))}
        </select>

        <select
          value={free}
          onChange={(e) => setFree(e.target.value as typeof free)}
          className="vs-focus h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white focus:border-accent-violet/60 sm:w-auto"
        >
          <option value="all" className="bg-[#0b0b14]">
            Free & Paid
          </option>
          <option value="true" className="bg-[#0b0b14]">
            Free only
          </option>
          <option value="false" className="bg-[#0b0b14]">
            Paid only
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="vs-focus h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white focus:border-accent-violet/60 sm:w-auto"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0b0b14]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No listings found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={toggleFavorite}
                favoriteBusy={favoriteBusyId === product.id}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="vs-focus flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-white/50">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="vs-focus flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
