"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Shield,
  Users,
  Package,
  ShoppingBag,
  Wrench,
  LayoutGrid,
  IndianRupee,
  Ban,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { api, ApiClientError } from "@/lib/api";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminStats, AdminUser, Order, OrderStatus, Product, ServiceRequest, ServiceRequestStatus } from "@/lib/types";

type Tab = "overview" | "users" | "products" | "orders" | "requests";

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "requests", label: "Service Requests", icon: Wrench },
];

const EMPTY_PRODUCT_FORM = {
  title: "",
  kind: "plugin" as Product["kind"],
  category: "",
  shortDescription: "",
  description: "",
  tags: "",
  price: "0",
  authorName: "",
  minecraftVersion: "1.21",
  version: "1.0.0",
  fileUrl: "",
  isFeatured: false,
  status: "published" as "published" | "draft",
};

export default function AdminPage() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <PlaceholderPage
        icon={ShieldAlert}
        title="Access restricted"
        description="You don't have permission to view this page."
        badge="Admins only"
      />
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white sm:text-3xl">
          <Shield size={24} className="text-accent-violet" /> Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-white/50">Manage users, listings, orders, and service requests.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`vs-focus flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-vs-gradient text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab push={push} />}
      {tab === "users" && <UsersTab push={push} />}
      {tab === "products" && <ProductsTab push={push} />}
      {tab === "orders" && <OrdersTab push={push} />}
      {tab === "requests" && <RequestsTab push={push} />}
    </div>
  );
}

type PushFn = ReturnType<typeof useToast>["push"];

// --- Overview ---------------------------------------------------------------

function OverviewTab({ push }: { push: PushFn }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<(Order & { user?: { username: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; data: { stats: AdminStats; recentUsers: AdminUser[]; recentOrders: any[] } }>(
        "/admin/stats"
      )
      .then((res) => {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers);
        setRecentOrders(res.data.recentOrders);
      })
      .catch((err) =>
        push({
          variant: "error",
          title: "Couldn't load stats",
          description: err instanceof ApiClientError ? err.message : "Please try again.",
        })
      )
      .finally(() => setIsLoading(false));
  }, [push]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl2" />
        ))}
      </div>
    );
  }
  if (!stats) return null;

  const cards = [
    { label: "Users", value: stats.users, icon: Users },
    { label: "Products", value: stats.products, icon: Package },
    { label: "Orders", value: stats.orders, icon: ShoppingBag },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Pending Requests", value: stats.pendingServiceRequests, icon: Wrench },
    { label: "Banned Users", value: stats.bannedUsers, icon: Ban },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="vs-panel rounded-xl2 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-violet">
              <c.icon size={16} />
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-white">{c.value}</p>
            <p className="mt-1 text-xs text-white/40">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="vs-panel rounded-xl2 p-5">
          <h2 className="font-display text-sm font-semibold text-white">Recent Users</h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{u.username}</span>
                <span className="text-xs text-white/30">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vs-panel rounded-xl2 p-5">
          <h2 className="font-display text-sm font-semibold text-white">Recent Orders</h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {recentOrders.map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{o.user?.username ?? "—"}</span>
                <span className="font-mono text-xs text-white/40">₹{o.total.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Users -------------------------------------------------------------------

function UsersTab({ push }: { push: PushFn }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await api.get<{ success: boolean; data: { users: AdminUser[] } }>(`/admin/users?${params}`);
      setUsers(res.data.users);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load users",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, push]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function toggleBan(u: AdminUser) {
    setBusyId(u._id);
    try {
      const res = await api.patch<{ success: boolean; data: { user: AdminUser } }>(`/admin/users/${u._id}`, {
        isBanned: !u.isBanned,
      });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? res.data.user : x)));
    } catch (err) {
      push({
        variant: "error",
        title: "Action failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function toggleRole(u: AdminUser) {
    setBusyId(u._id);
    try {
      const nextRole = u.role === "admin" ? "user" : "admin";
      const res = await api.patch<{ success: boolean; data: { user: AdminUser } }>(`/admin/users/${u._id}`, {
        role: nextRole,
      });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? res.data.user : x)));
    } catch (err) {
      push({
        variant: "error",
        title: "Action failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Search Users"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="vs-panel overflow-x-auto rounded-xl2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-white/40">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Credits</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/30">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/30">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 last:border-0">
                  <td className="p-4">
                    <p className="text-white">{u.username}</p>
                    <p className="text-xs text-white/40">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <Badge tone={u.role === "admin" ? "violet" : "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="p-4 text-white/60">{u.credits.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge tone={u.isBanned ? "rose" : "green"}>{u.isBanned ? "Banned" : "Active"}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        magnetic={false}
                        isLoading={busyId === u._id}
                        onClick={() => toggleRole(u)}
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </Button>
                      <Button
                        size="sm"
                        variant={u.isBanned ? "secondary" : "danger"}
                        magnetic={false}
                        isLoading={busyId === u._id}
                        onClick={() => toggleBan(u)}
                      >
                        {u.isBanned ? <ShieldCheck size={14} /> : <Ban size={14} />}
                        {u.isBanned ? "Unban" : "Ban"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Products ------------------------------------------------------------

function ProductsTab({ push }: { push: PushFn }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY_PRODUCT_FORM | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { products: any[] } }>("/products/admin/all");
      setProducts(
        res.data.products.map((p) => ({
          ...p,
          id: p._id,
          isFree: p.price === 0,
          isFavorited: false,
          isOwned: false,
        }))
      );
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load products",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm({ ...EMPTY_PRODUCT_FORM });
    setEditingId(null);
    setError(null);
  }

  function openEdit(p: Product) {
    setForm({
      title: p.title,
      kind: p.kind,
      category: p.category,
      shortDescription: p.shortDescription,
      description: p.description ?? "",
      tags: p.tags.join(", "),
      price: String(p.price),
      authorName: p.authorName,
      minecraftVersion: p.minecraftVersion,
      version: p.version,
      fileUrl: "",
      isFeatured: p.isFeatured,
      status: "published",
    });
    setEditingId(p.id);
    setError(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await api.del(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      push({ variant: "success", title: "Listing deleted" });
    } catch (err) {
      push({
        variant: "error",
        title: "Delete failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    }
  }

  async function handleSubmit() {
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: form.title,
        kind: form.kind,
        category: form.category,
        shortDescription: form.shortDescription,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price: Number(form.price) || 0,
        authorName: form.authorName,
        minecraftVersion: form.minecraftVersion,
        version: form.version,
        fileUrl: form.fileUrl || undefined,
        isFeatured: form.isFeatured,
        status: form.status,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, body);
        push({ variant: "success", title: "Listing updated" });
      } else {
        await api.post("/products", body);
        push({ variant: "success", title: "Listing created" });
      }
      setForm(null);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" magnetic={false} onClick={openCreate}>
          <Plus size={14} /> New Listing
        </Button>
      </div>

      <div className="vs-panel overflow-x-auto rounded-xl2">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-white/40">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Kind</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Downloads</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-white/30">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-white/30">
                  No listings yet.
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-white">{p.title}</td>
                  <td className="p-4">
                    <Badge tone="violet">{p.kind}</Badge>
                  </td>
                  <td className="p-4 text-white/60">{p.price === 0 ? "Free" : `₹${p.price}`}</td>
                  <td className="p-4">
                    <Badge tone={p.status === "published" ? "green" : "neutral"}>{p.status}</Badge>
                  </td>
                  <td className="p-4 text-white/60">{p.downloadsCount}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" magnetic={false} onClick={() => openEdit(p)}>
                        <Pencil size={13} />
                      </Button>
                      <Button size="sm" variant="danger" magnetic={false} onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {form && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
            onClick={() => setForm(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="vs-panel my-8 w-full max-w-2xl rounded-xl2 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">
                  {editingId ? "Edit Listing" : "New Listing"}
                </h3>
                <button onClick={() => setForm(null)} className="vs-focus text-white/40 hover:text-white" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">Kind</label>
                  <select
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value as Product["kind"] })}
                    className="vs-focus h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white focus:border-accent-violet/60"
                  >
                    <option value="plugin" className="bg-[#0b0b14]">Plugin</option>
                    <option value="resource" className="bg-[#0b0b14]">Resource</option>
                    <option value="build" className="bg-[#0b0b14]">Build</option>
                    <option value="configuration" className="bg-[#0b0b14]">Configuration</option>
                  </select>
                </div>
                <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <Input label="Author" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
                <Input label="Price (₹, 0 = free)" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <Input label="Minecraft Version" value={form.minecraftVersion} onChange={(e) => setForm({ ...form, minecraftVersion: e.target.value })} />
                <Input label="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                <Input label="File URL (optional)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
                <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="sm:col-span-2" />
                <Input
                  label="Short Description"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="sm:col-span-2"
                />
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-white/80">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    className="vs-focus w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-accent-violet/60"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-white/5"
                    />
                    Featured listing
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })}
                    className="vs-focus ml-auto h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white focus:border-accent-violet/60"
                  >
                    <option value="published" className="bg-[#0b0b14]">Published</option>
                    <option value="draft" className="bg-[#0b0b14]">Draft</option>
                  </select>
                </div>
              </div>

              {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

              <Button onClick={handleSubmit} isLoading={saving} magnetic={false} className="mt-5 w-full">
                {editingId ? "Save Changes" : "Create Listing"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Orders ------------------------------------------------------------------

const ORDER_STATUSES: OrderStatus[] = ["completed", "pending", "refunded", "failed"];

function OrdersTab({ push }: { push: PushFn }) {
  const [orders, setOrders] = useState<(Order & { user?: { username: string; email: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { orders: any[] } }>("/orders/admin/all");
      setOrders(res.data.orders);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load orders",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: OrderStatus) {
    setBusyId(id);
    try {
      const res = await api.patch<{ success: boolean; data: { order: Order } }>(`/orders/admin/${id}/status`, {
        status,
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...res.data.order } : o)));
    } catch (err) {
      push({
        variant: "error",
        title: "Update failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="vs-panel overflow-x-auto rounded-xl2">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-xs text-white/40">
            <th className="p-4 font-medium">Order</th>
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Total</th>
            <th className="p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-white/30">
                Loading...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-white/30">
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-mono text-white/70">{o.orderNumber}</td>
                <td className="p-4 text-white/60">{o.user?.username ?? "—"}</td>
                <td className="p-4 text-white/60">₹{o.total.toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    disabled={busyId === o._id}
                    onChange={(e) => updateStatus(o._id, e.target.value as OrderStatus)}
                    className="vs-focus h-9 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs text-white focus:border-accent-violet/60"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#0b0b14]">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- Service Requests ---------------------------------------------------------

const REQUEST_STATUSES: ServiceRequestStatus[] = ["pending", "in_review", "accepted", "completed", "declined"];

function RequestsTab({ push }: { push: PushFn }) {
  const [requests, setRequests] = useState<(ServiceRequest & { user?: { username: string; email: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: { requests: any[] } }>("/services/admin/requests");
      setRequests(res.data.requests);
    } catch (err) {
      push({
        variant: "error",
        title: "Couldn't load requests",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: ServiceRequestStatus) {
    setBusyId(id);
    try {
      const res = await api.patch<{ success: boolean; data: { request: ServiceRequest } }>(
        `/services/admin/requests/${id}/status`,
        { status }
      );
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...res.data.request } : r)));
    } catch (err) {
      push({
        variant: "error",
        title: "Update failed",
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl2" />)
      ) : requests.length === 0 ? (
        <div className="vs-panel rounded-xl2 p-6 text-center text-sm text-white/40">No service requests yet.</div>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="vs-panel flex flex-wrap items-center justify-between gap-3 rounded-xl2 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white">
                {r.service?.title ?? "Service"} — <span className="text-white/50">{r.user?.username}</span>
              </p>
              <p className="mt-1 truncate text-xs text-white/40">{r.message}</p>
            </div>
            <select
              value={r.status}
              disabled={busyId === r._id}
              onChange={(e) => updateStatus(r._id, e.target.value as ServiceRequestStatus)}
              className="vs-focus h-9 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs text-white focus:border-accent-violet/60"
            >
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#0b0b14]">
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </div>
  );
}
