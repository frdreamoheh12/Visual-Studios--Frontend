"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Download, Blocks, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (product: Product) => void;
  favoriteBusy?: boolean;
}

export function ProductCard({ product, onToggleFavorite, favoriteBusy }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="vs-panel vs-panel-hover group relative overflow-hidden rounded-xl2"
    >
      <Link href={`/marketplace/${product.slug}`} className="vs-focus block">
        <div
          className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${product.gradient}`}
        >
          <Blocks size={28} className="text-white/50 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-2.5 top-2.5">
            <Badge tone={product.isFree ? "green" : "amber"}>
              {product.isFree ? "Free" : `₹${product.price.toLocaleString("en-IN")}`}
            </Badge>
          </div>
        </div>

        <div className="p-4 pb-3">
          <p className="truncate text-sm font-medium text-white">{product.title}</p>
          <p className="mt-0.5 truncate text-xs text-white/40">by {product.authorName}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-white/40">
            <span className="rounded-full border border-white/10 px-2 py-0.5">{product.category}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono">
              {product.minecraftVersion}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" fill="currentColor" />
              {product.ratingCount > 0 ? product.ratingAvg.toFixed(1) : "New"}
            </span>
            <span className="flex items-center gap-1">
              <Download size={12} />
              {product.downloadsCount.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          disabled={favoriteBusy}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(product);
          }}
          aria-label={product.isFavorited ? "Remove from favorites" : "Add to favorites"}
          className="vs-focus absolute left-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/70 backdrop-blur transition-colors hover:text-rose-400 disabled:opacity-50"
        >
          <Heart size={14} className={product.isFavorited ? "fill-rose-400 text-rose-400" : ""} />
        </button>
      )}
    </motion.div>
  );
}
