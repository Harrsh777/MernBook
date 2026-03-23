import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-auth";

export default async function AdminIndexPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/50 text-xs uppercase tracking-[0.25em]">
          Admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mt-2">
          Admin control center
        </h1>
        <p className="text-white/55 text-sm mt-2">
          Create clients and projects, and manage your SaaS from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/admin/create-client"
          className="rounded-3xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-2xl p-6 transition shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-lg font-semibold mb-2">Create new client</h2>
          <p className="text-white/60 text-sm">
            Onboard a new client, create their Supabase auth user, and link
            them to future projects.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/create-project"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/40 to-blue-500/30 hover:from-purple-500/55 hover:to-blue-500/45 backdrop-blur-2xl p-6 transition shadow-[0_18px_60px_rgba(59,130,246,0.4)]"
        >
          <h2 className="text-lg font-semibold mb-2">Create new project</h2>
          <p className="text-white/70 text-sm">
            Spin up a new client project with deadlines, pricing, and
            milestones that flow into the client dashboard.
          </p>
        </Link>
      </div>
    </div>
  );
}

