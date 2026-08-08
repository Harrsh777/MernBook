"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CrmSiteHeader } from "@/components/crm-site-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CrmCreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/crm/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        clientName,
        clientEmail,
        startDate: startDate || null,
        deadline: deadline || null,
        budget: budget ? Number(budget) : null,
        useMagicLink,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(data?.error || "Could not create project");
      return;
    }
    if (data.temporaryPassword) {
      toast.success("Project created — copy the temporary password shown.");
      toast.message(`Temp password: ${data.temporaryPassword}`, {
        duration: 20000,
      });
    } else {
      toast.success("Project created.");
    }
    if (!data.emailSent && data.emailNote) {
      toast.message(data.emailNote, { duration: 8000 });
    }
    router.push(`/crm/projects/${data.projectId}`);
    router.refresh();
  };

  return (
    <>
      <CrmSiteHeader title="Create project" />
      <div className="mx-auto max-w-xl flex-1 space-y-6 p-4 md:p-6">
        <p className="text-sm text-muted-foreground">
          Creates the project, links or creates the client, seeds milestones, logs
          activity, and sends the welcome email when Resend is configured.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              placeholder="Scope and success criteria"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">Deadline</Label>
              <Input
                id="due"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cname">Client name</Label>
            <Input
              id="cname"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cemail">Client email</Label>
            <Input
              id="cemail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="magic"
              checked={useMagicLink}
              onCheckedChange={(v) => setUseMagicLink(v === true)}
            />
            <Label htmlFor="magic" className="font-normal text-muted-foreground">
              New clients: invite via Supabase email (magic link) instead of
              generated password
            </Label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/crm">Cancel</Link>
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create project"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
