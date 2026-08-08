"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CrmSiteHeader } from "@/components/crm-site-header";
import { Badge } from "@/components/ui/badge";
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
import type { CrmProjectDetail } from "@/lib/crm/queries";
import { toast } from "sonner";

const STATUSES = ["not_started", "in_progress", "review", "completed"] as const;

function daysUntil(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / (86400000));
}

function formatMoney(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CrmProjectDetailClient({
  initial,
}: {
  initial: CrmProjectDetail;
}) {
  const router = useRouter();
  const [bundle, setBundle] = useState(initial);
  const [status, setStatus] = useState(initial.project.status);
  const [paidInput, setPaidInput] = useState(
    String(initial.project.amount_paid ?? 0)
  );
  const [newMilestone, setNewMilestone] = useState("");
  const [newDue, setNewDue] = useState("");
  const [busy, setBusy] = useState(false);

  const countdown = useMemo(
    () => daysUntil(bundle.project.deadline),
    [bundle.project.deadline]
  );

  const refresh = async () => {
    const res = await fetch(`/api/crm/projects/${bundle.project.id}`);
    const data = await res.json();
    if (res.ok && data.project) {
      setBundle({
        project: data.project,
        client: data.client,
        milestones: data.milestones,
        activities: data.activities,
      });
      setStatus(data.project.status);
      setPaidInput(String(data.project.amount_paid ?? 0));
    }
  };

  const patchProject = async (body: Record<string, unknown>) => {
    setBusy(true);
    const res = await fetch(`/api/crm/projects/${bundle.project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Update failed");
      return;
    }
    toast.success("Saved");
    await refresh();
    router.refresh();
  };

  const toggleMilestone = async (id: string, completed: boolean) => {
    setBusy(true);
    const res = await fetch(
      `/api/crm/projects/${bundle.project.id}/milestones/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      }
    );
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    await refresh();
    router.refresh();
  };

  const addMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    setBusy(true);
    const res = await fetch(
      `/api/crm/projects/${bundle.project.id}/milestones`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMilestone.trim(),
          due_date: newDue || null,
        }),
      }
    );
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    setNewMilestone("");
    setNewDue("");
    await refresh();
    router.refresh();
  };

  const resetPassword = async () => {
    setBusy(true);
    const res = await fetch(`/api/crm/projects/${bundle.project.id}/client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_password" }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.message(`New temp password: ${data.temporaryPassword}`, {
      duration: 25000,
    });
    await refresh();
  };

  const setClientDisabled = async (access_disabled: boolean) => {
    setBusy(true);
    const res = await fetch(`/api/crm/projects/${bundle.project.id}/client`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_disabled }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success(access_disabled ? "Access disabled" : "Access enabled");
    await refresh();
    router.refresh();
  };

  const p = bundle.project;
  const budget = p.price ?? 0;
  const paid = p.amount_paid ?? 0;

  return (
    <>
      <CrmSiteHeader title={p.title} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
              <Link href="/crm">← Dashboard</Link>
            </Button>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Project
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {p.description || "—"}
            </p>
          </div>
          <Badge variant="outline">{p.status.replace(/_/g, " ")}</Badge>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-2xl font-semibold">{p.progress ?? 0}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${p.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v);
                    patchProject({ status: v });
                  }}
                  disabled={busy}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="mt-1 font-medium">
                  {p.deadline
                    ? new Date(p.deadline).toLocaleDateString("en-IN")
                    : "—"}
                </p>
                {countdown != null && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {countdown < 0
                      ? `${Math.abs(countdown)} days overdue`
                      : `${countdown} days left`}
                  </p>
                )}
              </div>
              <div className="rounded-xl border bg-card p-4 md:col-span-2">
                <p className="text-xs text-muted-foreground">Budget vs paid</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatMoney(budget)} / {formatMoney(paid)}
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Amount paid (total)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={paidInput}
                      onChange={(e) => setPaidInput(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      patchProject({ amount_paid: Number(paidInput) })
                    }
                  >
                    Update paid
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 pt-4">
            <form
              onSubmit={addMilestone}
              className="flex flex-wrap items-end gap-2 rounded-xl border bg-card p-4"
            >
              <div className="space-y-1">
                <Label>New milestone</Label>
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Name"
                  className="w-56"
                />
              </div>
              <div className="space-y-1">
                <Label>Due date</Label>
                <Input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy}>
                Add
              </Button>
            </form>
            <ul className="space-y-2">
              {bundle.milestones.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{m.name}</span>
                    {m.due_date && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        Due {new Date(m.due_date).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={m.completed ? "secondary" : "default"}
                    disabled={busy}
                    onClick={() => toggleMilestone(m.id, !m.completed)}
                  >
                    {m.completed ? "Reopen" : "Complete"}
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <div className="max-h-[480px] space-y-2 overflow-y-auto rounded-xl border bg-card p-4">
              {bundle.activities.length === 0 && (
                <p className="text-sm text-muted-foreground">No events yet.</p>
              )}
              {bundle.activities.map((a) => (
                <div key={a.id} className="border-b pb-2 text-sm last:border-0">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">
                      {a.message || a.event_type.replace(/_/g, " ")}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-4 pt-4">
            {bundle.client ? (
              <div className="max-w-md space-y-4 rounded-xl border bg-card p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{bundle.client.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{bundle.client.email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Access</p>
                  <p className="font-medium">
                    {bundle.client.access_disabled
                      ? "Disabled"
                      : "Active"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={resetPassword}
                  >
                    Reset password
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={busy || !!bundle.client.access_disabled}
                    onClick={() => setClientDisabled(true)}
                  >
                    Disable access
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busy || !bundle.client.access_disabled}
                    onClick={() => setClientDisabled(false)}
                  >
                    Enable access
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No client record.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
