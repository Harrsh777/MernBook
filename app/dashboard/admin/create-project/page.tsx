"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";

type ClientOption = { id: string; name: string | null; email: string | null };

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState<number>(0);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadingClients(true);
      const { data } = await supabase
        .from("profiles")
        .select("id,name,email,role")
        .eq("role", "client")
        .order("created_at", { ascending: false });
      setClients((data || []).map((d: ClientOption) => ({ id: d.id, name: d.name, email: d.email })));
      setLoadingClients(false);
    };
    load();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/dashboard/admin/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        clientId,
        deadline: deadline || null,
        price: price || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      setError(data?.error || "Failed to create project");
      return;
    }
    router.push(`/dashboard/project/${data.projectId}`);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-xl"
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
        <h1 className="text-2xl font-semibold tracking-tight">Create project</h1>
        <p className="text-white/55 text-sm mt-2">
          Assign a project to a client. It becomes visible immediately on their dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-28 rounded-2xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="What are we building? What does success look like?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Assign client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            >
              <option value="" disabled>
                {loadingClients ? "Loading clients..." : "Select a client"}
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.name || "Client") + (c.email ? ` (${c.email})` : "")}
                </option>
              ))}
            </select>
            {!loadingClients && clients.length === 0 && (
              <p className="text-white/40 text-xs">
                No clients found. Create a client first.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70">Deadline</label>
              <input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                type="date"
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70">Price (₹)</label>
              <input
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                min={0}
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-12 px-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold shadow-[0_12px_40px_rgba(59,130,246,0.18)] hover:brightness-110 transition disabled:opacity-60"
            >
              {busy ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

