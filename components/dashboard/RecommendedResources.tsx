"use client";

import { useEffect, useState } from "react";
import { api, ApiClientError } from "@/lib/api";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Product, ProductListResponse } from "@/lib/types";

export function RecommendedResources() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; data: ProductListResponse }>("/products?featured=true&limit=4")
      .then((res) => setProducts(res.data.products))
      .catch((err) => {
        if (!(err instanceof ApiClientError)) console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="vs-panel rounded-xl2 p-6">
      <h2 className="font-display text-sm font-semibold text-white">Recommended for You</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
