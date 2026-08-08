"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { CrmSiteHeader } from "@/components/crm-site-header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type JobRow = {
  id: string;
  company_name: string;
  role_title: string;
  date_applied: string;
  status: string;
  notes: string | null;
  follow_up_at: string | null;
};

type TimelineEvent = {
  id: string;
  title: string;
  body: string | null;
  event_at: string;
};

const STATUSES = ["applied", "interview", "offer", "rejected"] as const;

export function CrmJobsClient() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [selected, setSelected] = useState<JobRow | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const loadJobs = useCallback(async () => {
    const res = await fetch("/api/crm/jobs");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    setJobs(data.jobs ?? []);
  }, []);

  const loadTimeline = useCallback(async (id: string) => {
    const res = await fetch(`/api/crm/jobs/${id}/timeline`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    setTimeline(data.events ?? []);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (selected) loadTimeline(selected.id);
    else setTimeline([]);
  }, [selected, loadTimeline]);

  return (
    <>
      <CrmSiteHeader title="Job tracker" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:p-6">
        <div className="flex-1 space-y-4">
          <AddJobForm onAdded={loadJobs} />
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow
                    key={j.id}
                    className={
                      selected?.id === j.id ? "bg-muted/50" : "cursor-pointer"
                    }
                    onClick={() => setSelected(j)}
                  >
                    <TableCell className="font-medium">
                      {j.company_name}
                    </TableCell>
                    <TableCell>{j.role_title}</TableCell>
                    <TableCell>{j.date_applied}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{j.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {j.follow_up_at
                        ? dayjs(j.follow_up_at).format("MMM D, YYYY HH:mm")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(j);
                        }}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {selected && (
          <div className="w-full shrink-0 space-y-4 md:w-[380px]">
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold">Edit</h3>
              <JobEditor
                job={selected}
                onSaved={() => {
                  loadJobs();
                  loadTimeline(selected.id);
                }}
                onClose={() => setSelected(null)}
              />
            </div>
            <div className="rounded-xl border bg-card p-4">
              <h3 className="mb-2 text-sm font-semibold">Timeline</h3>
              <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
                {timeline.map((ev) => (
                  <li key={ev.id} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{ev.title}</div>
                    {ev.body && (
                      <p className="text-xs text-muted-foreground">{ev.body}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {dayjs(ev.event_at).format("MMM D, YYYY HH:mm")}
                    </p>
                  </li>
                ))}
              </ul>
              <TimelineAdd jobId={selected.id} onAdded={() => loadTimeline(selected.id)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AddJobForm({ onAdded }: { onAdded: () => void }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [applied, setApplied] = useState(dayjs().format("YYYY-MM-DD"));
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: company,
        role_title: role,
        date_applied: applied,
        notes,
        follow_up_at: followUp ? new Date(followUp).toISOString() : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Job added");
    setCompany("");
    setRole("");
    setNotes("");
    setFollowUp("");
    onAdded();
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-3"
    >
      <div className="space-y-1">
        <Label>Company</Label>
        <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Role</Label>
        <Input value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Date applied</Label>
        <Input
          type="date"
          value={applied}
          onChange={(e) => setApplied(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label>Follow-up reminder</Label>
        <Input
          type="datetime-local"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
      </div>
      <Button type="submit" className="md:col-span-3">
        Add job
      </Button>
    </form>
  );
}

function JobEditor({
  job,
  onSaved,
  onClose,
}: {
  job: JobRow;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.notes || "");
  const [followUp, setFollowUp] = useState(
    job.follow_up_at ? dayjs(job.follow_up_at).format("YYYY-MM-DDTHH:mm") : ""
  );

  useEffect(() => {
    setStatus(job.status);
    setNotes(job.notes || "");
    setFollowUp(
      job.follow_up_at ? dayjs(job.follow_up_at).format("YYYY-MM-DDTHH:mm") : ""
    );
  }, [job]);

  const save = async () => {
    const res = await fetch(`/api/crm/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        notes,
        follow_up_at: followUp ? new Date(followUp).toISOString() : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Saved");
    onSaved();
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="space-y-1">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label>Follow-up</Label>
        <Input
          type="datetime-local"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={save}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            if (!confirm("Delete this job?")) return;
            const res = await fetch(`/api/crm/jobs/${job.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              const err = await res.json();
              toast.error(err?.error);
              return;
            }
            onClose();
            onSaved();
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function TimelineAdd({
  jobId,
  onAdded,
}: {
  jobId: string;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/crm/jobs/${jobId}/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    setTitle("");
    setBody("");
    onAdded();
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2 border-t pt-3">
      <Input
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Note (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs"
      />
      <Button type="submit" size="sm" className="w-full">
        Add timeline event
      </Button>
    </form>
  );
}
