"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = useMemo(() => params.get("redirectTo") || "/dashboard", [params]);

  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setBusy(false);
      setError(signInError.message);
      return;
    }

    router.replace(redirectTo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-[0.25em]">
                Client Portal
              </p>
              <h1 className="text-3xl font-semibold tracking-tight mt-2">
                Welcome back
              </h1>
              <p className="text-white/60 text-sm mt-2">
                Sign in to see projects, milestones, and updates.
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-white/10" />
          </div>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-xs text-white/50 pt-2">
              <span>New here?</span>
              <Link
                href="/auth/signup"
                className="text-white/80 hover:text-white underline underline-offset-4"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-white/10 bg-black/20">
          <p className="text-[11px] text-white/45 leading-relaxed">
            Tip: If you&apos;re an admin, you&apos;ll see create actions once you
            sign in.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md" />}>
      <LoginPageContent />
    </Suspense>
  );
}

