"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CreateClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/dashboard/admin/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      setError(data?.error || "Failed to create client");
      return;
    }
    router.push("/dashboard");
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
        <h1 className="text-2xl font-semibold tracking-tight">Create client</h1>
        <p className="text-white/55 text-sm mt-2">
          This will create a Supabase Auth user and a row in <code className="text-white/80">profiles</code>.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">Temporary password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={6}
              className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            />
            <p className="text-white/40 text-xs">
              Share this with the client. They can change it later in Supabase.
            </p>
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
              {busy ? "Creating..." : "Create client"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

