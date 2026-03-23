import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-auth";

type Role = "admin" | "client";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
};

type Project = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: "in_progress" | "completed" | "review";
  progress: number;
  deadline: string | null;
  price: number | null;
  updated_at: string | null;
};

// Legacy jobs dashboard type so TypeScript stops complaining
type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_date?: string;
  salary?: string;
  job_type?: string;
  experience_level?: string;
  scraped_at: string;
  is_liked?: boolean;
  liked_at?: string;
};

function statusBadge(status: Project["status"]) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
    case "review":
      return "bg-amber-500/15 text-amber-200 border-amber-500/20";
    default:
      return "bg-blue-500/15 text-blue-200 border-blue-500/20";
  }
}

export default async function DashboardPage() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // protected by middleware
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,name,email,role")
    .eq("id", user.id)
    .single<Profile>();

  const role: Role = profile?.role || "client";

  const baseQuery = supabase
    .from("projects")
    .select(
      "id,client_id,title,description,status,progress,deadline,price,updated_at"
    )
    .order("updated_at", { ascending: false })
    .returns<Project[]>();

  let projects: Project[] | null = null;
  if (role === "admin") {
    const { data } = await baseQuery;
    projects = data;
  } else {
    const { data } = await supabase
      .from("projects")
      .select(
        "id,client_id,title,description,status,progress,deadline,price,updated_at"
      )
      .eq("client_id", user.id)
      .order("updated_at", { ascending: false })
      .returns<Project[]>();
    projects = data;
  }

  const safeProjects: Project[] = projects || [];

  const totalProjects = safeProjects.length;
  const activeProjects = safeProjects.filter(
    (p) => p.status === "in_progress"
  ).length;
  const completedProjects = safeProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingPayments = safeProjects.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-[0.25em]">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight mt-2">
            {role === "admin" ? "Admin overview" : "Your projects"}
          </h1>
          <p className="text-white/55 text-sm mt-2">
            {role === "admin"
              ? "Create clients and projects with a clean, premium workflow."
              : "Track progress, milestones, and deadlines — all in one place."}
          </p>
        </div>

        {role === "admin" && (
          <div className="flex gap-3">
            <Link
              href="/dashboard/admin/create-client"
              className="h-11 px-4 rounded-2xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.09] transition flex items-center text-sm font-semibold"
            >
              Create Client
            </Link>
            <Link
              href="/dashboard/admin/create-project"
              className="h-11 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:brightness-110 transition flex items-center text-sm font-semibold shadow-[0_12px_40px_rgba(59,130,246,0.18)]"
            >
              Create Project
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
          <p className="text-white/55 text-xs uppercase tracking-[0.2em]">
            Total Projects
          </p>
          <p className="text-3xl font-semibold mt-2">{totalProjects}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
          <p className="text-white/55 text-xs uppercase tracking-[0.2em]">
            Active Projects
          </p>
          <p className="text-3xl font-semibold mt-2">{activeProjects}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
          <p className="text-white/55 text-xs uppercase tracking-[0.2em]">
            Completed
          </p>
          <p className="text-3xl font-semibold mt-2">{completedProjects}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
          <p className="text-white/55 text-xs uppercase tracking-[0.2em]">
            Pending Payments
          </p>
          <p className="text-3xl font-semibold mt-2">
            ₹{pendingPayments.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeProjects.map((p: Project) => (
          <div
            key={p.id}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 hover:bg-white/[0.06] transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                <p className="text-white/55 text-sm mt-1 line-clamp-2">
                  {p.description || "—"}
                </p>
              </div>
              <span
                className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadge(
                  p.status
                )}`}
              >
                {p.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/55">
                <span>Progress</span>
                <span className="text-white/75 font-medium">{p.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${p.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-white/55 pt-1">
                <span>
                  Deadline:{" "}
                  <span className="text-white/75">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString("en-IN") : "—"}
                  </span>
                </span>
                <span className="text-white/45">
                  Updated{" "}
                  {p.updated_at
                    ? new Date(p.updated_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link
                href={`/dashboard/project/${p.id}`}
                className="text-sm font-semibold text-white/85 hover:text-white transition"
              >
                View details →
              </Link>
              {p.price != null && (
                <span className="text-sm font-semibold text-white/80">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        ))}

        {safeProjects.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 text-center md:col-span-2">
            <p className="text-white/70 font-semibold">No projects yet</p>
            <p className="text-white/50 text-sm mt-2">
              {role === "admin"
                ? "Create a client and assign a project to get started."
                : "Once your admin assigns a project, it will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
