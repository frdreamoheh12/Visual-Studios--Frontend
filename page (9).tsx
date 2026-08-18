"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Receipt } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_TONE: Record<OrderStatus, "green" | "amber" | "rose" | "neutral"> = {
  completed: "green",
  pending: "amber",
  refunded: "neutral",
  failed: "rose",
};

export default function OrdersPage() {
  const { push } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { orders: Order[] } }>("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load your orders",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Orders</h1>
        <p className="mt-2 text-sm text-white/50">Your purchase history and receipts.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl2" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet."
          description="Your purchase history will show up here once you buy something."
          action={
            <Link href="/marketplace">
              <Button size="sm" magnetic={false}>
                Explore Marketplace
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order._id} className="vs-panel rounded-xl2 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-accent-violet">
                    <Receipt size={17} />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-white">{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.paymentMethod === "credits" ? "Paid with credits" : "Card payment"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
                  <p className="font-display text-sm font-semibold text-white">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5 border-t border-white/5 pt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-white/60">
                    <span>{item.title}</span>
                    <span className="font-mono text-white/40">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
