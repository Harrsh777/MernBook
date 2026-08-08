"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { CrmSiteHeader } from "@/components/crm-site-header";
import { CrmTaskKanban, type CrmTaskRow } from "@/components/crm-task-kanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

type ProjectOpt = { id: string; title: string };
type MeetingRow = {
  id: string;
  title: string;
  starts_at: string;
  meet_url: string | null;
  project_id: string | null;
};

export function CrmTasksClient({
  initialProjects,
}: {
  initialProjects: ProjectOpt[];
}) {
  const [tasks, setTasks] = useState<CrmTaskRow[]>([]);
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [month, setMonth] = useState(() => dayjs().format("YYYY-MM"));
  const [assignees, setAssignees] = useState<
    { id: string; name: string | null; email: string | null }[]
  >([]);

  const loadTasks = useCallback(async () => {
    const q =
      projectFilter === "all"
        ? ""
        : `?project_id=${encodeURIComponent(projectFilter)}`;
    const res = await fetch(`/api/crm/tasks${q}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed to load tasks");
      return;
    }
    setTasks(data.tasks ?? []);
  }, [projectFilter]);

  const loadMeetings = useCallback(async () => {
    const start = dayjs(month).startOf("month").toISOString();
    const end = dayjs(month).endOf("month").toISOString();
    let url = `/api/crm/meetings?from=${encodeURIComponent(start)}&to=${encodeURIComponent(end)}`;
    if (projectFilter !== "all") {
      url += `&project_id=${encodeURIComponent(projectFilter)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed to load meetings");
      return;
    }
    setMeetings(data.meetings ?? []);
  }, [month, projectFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/crm/assignees");
      const data = await res.json();
      if (res.ok) setAssignees(data.assignees ?? []);
    })();
  }, []);

  const onStatusChange = async (taskId: string, status: string) => {
    const inColumn = tasks.filter((t) => t.status === status);
    const sort_order =
      inColumn.reduce((m, t) => Math.max(m, t.sort_order), -1) + 1;
    const res = await fetch(`/api/crm/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, sort_order }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Update failed");
      return;
    }
    await loadTasks();
  };

  const calendarTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.deadline) return false;
      const d = dayjs(t.deadline);
      return d.format("YYYY-MM") === month;
    });
  }, [tasks, month]);

  const daysInMonth = dayjs(month).daysInMonth();
  const startWeekday = dayjs(month).startOf("month").day();

  return (
    <>
      <CrmSiteHeader title="Tasks & schedule" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label>Filter by project</Label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {initialProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CreateTaskDialog
            projects={initialProjects}
            assignees={assignees}
            onCreated={loadTasks}
            defaultProjectId={
              projectFilter === "all" ? null : projectFilter
            }
          />
        </div>

        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-4">
            <CrmTaskKanban tasks={tasks} onStatusChange={onStatusChange} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Label className="w-24">Month</Label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-44"
              />
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="p-2">
                  {d}
                </div>
              ))}
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = dayjs(month).date(day).format("YYYY-MM-DD");
                const dayTasks = calendarTasks.filter(
                  (t) => t.deadline && t.deadline.slice(0, 10) === dateStr
                );
                const dayMeetings = meetings.filter(
                  (m) => m.starts_at.slice(0, 10) === dateStr
                );
                return (
                  <div
                    key={day}
                    className="min-h-[88px] rounded-md border bg-card p-1 text-left align-top"
                  >
                    <div className="text-[11px] font-semibold">{day}</div>
                    <div className="mt-1 space-y-0.5">
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className="truncate rounded bg-primary/15 px-1 text-[10px]"
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayMeetings.map((m) => (
                        <div
                          key={m.id}
                          className="truncate rounded bg-amber-500/20 px-1 text-[10px]"
                          title={m.title}
                        >
                          📹 {m.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="mt-4 space-y-4">
            <MeetingForm
              projects={initialProjects}
              onCreated={loadMeetings}
              defaultProjectId={
                projectFilter === "all" ? null : projectFilter
              }
            />
            <ul className="space-y-2">
              {meetings.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {dayjs(m.starts_at).format("MMM D, YYYY HH:mm")}
                    </div>
                  </div>
                  {m.meet_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={m.meet_url} target="_blank" rel="noreferrer">
                        Join meet
                      </a>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function CreateTaskDialog({
  projects,
  assignees,
  onCreated,
  defaultProjectId,
}: {
  projects: ProjectOpt[];
  assignees: { id: string; name: string | null; email: string | null }[];
  onCreated: () => void;
  defaultProjectId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [projectId, setProjectId] = useState<string>(defaultProjectId || "");
  const [assignedTo, setAssignedTo] = useState<string>("");

  useEffect(() => {
    setProjectId(defaultProjectId || "");
  }, [defaultProjectId, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        project_id: projectId || null,
        assigned_to: assignedTo || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Task created");
    setOpen(false);
    setTitle("");
    setDescription("");
    setDeadline("");
    onCreated();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>New task</Button>
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create task</SheetTitle>
        </SheetHeader>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Deadline</Label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Project (optional)</Label>
            <Select
              value={projectId || "none"}
              onValueChange={(v) => setProjectId(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (global)</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Assigned to (optional)</Label>
            <Select
              value={assignedTo || "none"}
              onValueChange={(v) => setAssignedTo(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {(a.name || a.email || a.id).slice(0, 40)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function MeetingForm({
  projects,
  onCreated,
  defaultProjectId,
}: {
  projects: ProjectOpt[];
  onCreated: () => void;
  defaultProjectId: string | null;
}) {
  const [title, setTitle] = useState("");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [url, setUrl] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || "");

  useEffect(() => {
    setProjectId(defaultProjectId || "");
  }, [defaultProjectId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!starts) {
      toast.error("Start time required");
      return;
    }
    const res = await fetch("/api/crm/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        starts_at: new Date(starts).toISOString(),
        ends_at: ends ? new Date(ends).toISOString() : null,
        meet_url: url || null,
        project_id: projectId || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Meeting scheduled");
    setTitle("");
    setStarts("");
    setEnds("");
    setUrl("");
    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
    >
      <div className="space-y-1 md:col-span-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Starts</Label>
        <Input
          type="datetime-local"
          value={starts}
          onChange={(e) => setStarts(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Ends (optional)</Label>
        <Input
          type="datetime-local"
          value={ends}
          onChange={(e) => setEnds(e.target.value)}
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label>Meet URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://meet.google.com/..."
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label>Project (optional)</Label>
        <Select
          value={projectId || "none"}
          onValueChange={(v) => setProjectId(v === "none" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="md:col-span-2">
        Schedule meeting
      </Button>
    </form>
  );
}
