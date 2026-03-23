import { supabaseServer } from "@/lib/supabase-auth";

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

type Milestone = {
  id: string;
  project_id: string;
  name: string;
  completed: boolean;
  created_at: string;
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

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let project: Project | null = null;
  if (isAdmin) {
    const { data } = await supabase
      .from("projects")
      .select(
        "id,client_id,title,description,status,progress,deadline,price,updated_at"
      )
      .eq("id", id)
      .single<Project>();
    project = data;
  } else {
    const { data } = await supabase
      .from("projects")
      .select(
        "id,client_id,title,description,status,progress,deadline,price,updated_at"
      )
      .eq("id", id)
      .eq("client_id", user.id)
      .single<Project>();
    project = data;
  }

  if (!project) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 text-center">
        <p className="text-white/75 font-semibold">Project not found</p>
        <p className="text-white/50 text-sm mt-2">
          It may have been removed or you don&apos;t have access.
        </p>
      </div>
    );
  }

  const { data: milestones } = await supabase
    .from("milestones")
    .select("id,project_id,name,completed,created_at")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true })
    .returns<Milestone[]>();

  const list = milestones || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white/50 text-xs uppercase tracking-[0.25em]">
            Project
          </p>
          <h1 className="text-3xl font-semibold tracking-tight mt-2 truncate">
            {project.title}
          </h1>
          <p className="text-white/55 text-sm mt-2 max-w-2xl">
            {project.description || "—"}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadge(
            project.status
          )}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Overview */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
          <h2 className="text-sm font-semibold text-white/80">
            Project overview
          </h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
                Deadline
              </p>
              <p className="text-white/85 font-semibold mt-1">
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
                Price
              </p>
              <p className="text-white/85 font-semibold mt-1">
                {project.price != null
                  ? `₹${Number(project.price).toLocaleString("en-IN")}`
                  : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
                Updated
              </p>
              <p className="text-white/85 font-semibold mt-1">
                {project.updated_at
                  ? new Date(project.updated_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-white/55">
              <span>Progress</span>
              <span className="text-white/80 font-medium">
                {project.progress}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Milestones + timeline */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
          <h2 className="text-sm font-semibold text-white/80">Milestones</h2>
          <p className="text-white/50 text-xs mt-2">
            A clean checklist + timeline view.
          </p>

          <div className="mt-5 space-y-3">
            {list.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                No milestones yet.
              </div>
            )}

            {list.map((m, idx) => (
              <div key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      m.completed
                        ? "bg-emerald-500/20 border-emerald-500/30"
                        : "bg-white/5 border-white/15"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        m.completed ? "bg-emerald-300" : "bg-white/30"
                      }`}
                    />
                  </div>
                  {idx < list.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-2" />
                  )}
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white/85">
                    {m.name}
                  </p>
                  <p className="text-xs text-white/45 mt-1">
                    {m.completed ? "Completed" : "In progress"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

