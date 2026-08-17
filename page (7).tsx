"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Wrench, X, Clock, IndianRupee } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Service, ServiceRequest, ServiceRequestStatus } from "@/lib/types";

const STATUS_TONE: Record<ServiceRequestStatus, "green" | "amber" | "rose" | "violet" | "neutral"> = {
  pending: "amber",
  in_review: "violet",
  accepted: "green",
  completed: "green",
  declined: "rose",
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Wrench;
  return <Icon size={22} />;
}

export default function ServicesPage() {
  const { push } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [svcRes, reqRes] = await Promise.all([
        api.get<{ success: boolean; data: { services: Service[] } }>("/services"),
        api.get<{ success: boolean; data: { requests: ServiceRequest[] } }>("/services/requests/mine"),
      ]);
      setServices(svcRes.data.services);
      setRequests(reqRes.data.requests);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load services",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  function openRequest(service: Service) {
    setActiveService(service);
    setMessage("");
    setBudget("");
  }

  async function submitRequest() {
    if (!activeService || !message.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/services/${activeService._id}/request`, {
        message: message.trim(),
        budget: budget ? Number(budget) : undefined,
      });
      push({ variant: "success", title: "Request submitted", description: "Our team will follow up soon." });
      setActiveService(null);
      load();
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't submit request",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Services</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          Request custom development work — plugins, builds, setups — directly from the Visual Studio team.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services available" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service._id} className="vs-panel vs-panel-hover flex flex-col gap-4 rounded-xl2 p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-accent-violet/10 text-accent-violet">
                  <ServiceIcon name={service.icon} />
                </div>
                {service.isFeatured && <Badge tone="amber">Popular</Badge>}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{service.title}</p>
                <p className="mt-1 text-xs text-white/40">{service.shortDescription}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <IndianRupee size={12} /> From ₹{service.priceFrom.toLocaleString("en-IN")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {service.deliveryTime}
                </span>
              </div>
              <Button size="sm" magnetic={false} onClick={() => openRequest(service)} className="mt-auto w-full">
                Request This Service
              </Button>
            </div>
          ))}
        </div>
      )}

      {requests.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Your Requests</h2>
          <div className="mt-4 flex flex-col gap-3">
            {requests.map((req) => (
              <div key={req._id} className="vs-panel flex flex-wrap items-center justify-between gap-3 rounded-xl2 p-4">
                <div>
                  <p className="text-sm font-medium text-white">{req.service?.title ?? "Service"}</p>
                  <p className="mt-1 max-w-lg truncate text-xs text-white/40">{req.message}</p>
                </div>
                <Badge tone={STATUS_TONE[req.status]}>{req.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="vs-panel w-full max-w-md rounded-xl2 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">{activeService.title}</h3>
                <button
                  onClick={() => setActiveService(null)}
                  className="vs-focus text-white/40 hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-1 text-xs text-white/40">
                From ₹{activeService.priceFrom.toLocaleString("en-IN")} · {activeService.deliveryTime}
              </p>

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">What do you need built?</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Describe the project, features, and any deadlines..."
                    className="vs-focus w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-accent-violet/60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">Budget (optional, ₹)</label>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    type="number"
                    min={0}
                    placeholder="e.g. 2000"
                    className="vs-focus h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/30 focus:border-accent-violet/60"
                  />
                </div>
                <Button
                  onClick={submitRequest}
                  isLoading={submitting}
                  disabled={!message.trim()}
                  magnetic={false}
                  className="w-full"
                >
                  Submit Request
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
