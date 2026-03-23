"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (signUpError) {
      setBusy(false);
      setError(signUpError.message);
      return;
    }

    // Create profile row (RLS policy: insert own)
    const userId = data.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        name,
        email,
        role: "client",
      });
    }

    router.replace("/dashboard");
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
          <p className="text-white/60 text-xs uppercase tracking-[0.25em]">
            Client Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight mt-2">
            Create your account
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Minimal onboarding. A premium dashboard experience.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="Your name"
                required
              />
            </div>
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
                autoComplete="new-password"
                className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="At least 6 characters"
                minLength={6}
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
              {busy ? "Creating..." : "Create account"}
            </button>

            <div className="flex items-center justify-between text-xs text-white/50 pt-2">
              <span>Already have an account?</span>
              <Link
                href="/auth/login"
                className="text-white/80 hover:text-white underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

