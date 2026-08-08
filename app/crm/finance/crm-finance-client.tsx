"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { CrmSiteHeader } from "@/components/crm-site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type ProjectOpt = { id: string; title: string };

type Summary = {
  month: string;
  incomeMonth: number;
  expensesMonth: number;
  profitMonth: number;
  burnRate: number;
  upcomingPayments: {
    id: string;
    project_id: string;
    project_title: string | null;
    phase: string;
    amount: number;
    due_date: string;
    overdue: boolean;
  }[];
};

export function CrmFinanceClient({
  initialProjects,
}: {
  initialProjects: ProjectOpt[];
}) {
  const [month, setMonth] = useState(() => dayjs().format("YYYY-MM"));
  const [summary, setSummary] = useState<Summary | null>(null);
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [expenses, setExpenses] = useState<Record<string, unknown>[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [milestones, setMilestones] = useState<Record<string, unknown>[]>([]);
  const [projectValue, setProjectValue] = useState<number | null>(null);

  const loadSummary = useCallback(async () => {
    const res = await fetch(
      `/api/crm/finance/summary?month=${encodeURIComponent(month)}`
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed summary");
      return;
    }
    setSummary(data);
  }, [month]);

  const loadInvoices = useCallback(async () => {
    const res = await fetch("/api/crm/invoices");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed invoices");
      return;
    }
    setInvoices(data.invoices ?? []);
  }, []);

  const loadExpenses = useCallback(async () => {
    const start = dayjs(month).startOf("month").format("YYYY-MM-DD");
    const end = dayjs(month).endOf("month").format("YYYY-MM-DD");
    const res = await fetch(
      `/api/crm/expenses?from=${start}&to=${end}`
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed expenses");
      return;
    }
    setExpenses(data.expenses ?? []);
  }, [month]);

  const loadMilestones = useCallback(async () => {
    if (!projectId) {
      setMilestones([]);
      return;
    }
    const res = await fetch(
      `/api/crm/payment-milestones?project_id=${encodeURIComponent(projectId)}`
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed milestones");
      return;
    }
    setMilestones(data.milestones ?? []);
  }, [projectId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  useEffect(() => {
    if (!projectId) {
      setProjectValue(null);
      return;
    }
    (async () => {
      const res = await fetch(`/api/crm/projects/${projectId}`);
      const data = await res.json();
      if (res.ok && data.project) {
        setProjectValue(
          data.project.price != null ? Number(data.project.price) : null
        );
      }
    })();
  }, [projectId]);

  const formatInr = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <CrmSiteHeader title="Finance" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Personal dashboard</TabsTrigger>
            <TabsTrigger value="milestones">Payment milestones</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Label>Month</Label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-44"
              />
            </div>
            {summary && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Income (month)"
                  value={formatInr(summary.incomeMonth)}
                />
                <MetricCard
                  label="Expenses (month)"
                  value={formatInr(summary.expensesMonth)}
                />
                <MetricCard
                  label="Profit (month)"
                  value={formatInr(summary.profitMonth)}
                />
                <MetricCard
                  label="Burn rate (avg / mo)"
                  value={formatInr(summary.burnRate)}
                  hint="Rolling ~3 months expenses"
                />
              </div>
            )}
            <div className="rounded-xl border">
              <div className="border-b px-4 py-2 text-sm font-semibold">
                Upcoming payment milestones
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(summary?.upcomingPayments ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-muted-foreground">
                        No unpaid milestones with due dates.
                      </TableCell>
                    </TableRow>
                  )}
                  {summary?.upcomingPayments.map((u) => (
                    <TableRow key={String(u.id)}>
                      <TableCell>{u.project_title || "—"}</TableCell>
                      <TableCell>{u.phase}</TableCell>
                      <TableCell>{u.due_date}</TableCell>
                      <TableCell>{formatInr(Number(u.amount))}</TableCell>
                      <TableCell>
                        {u.overdue ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label>Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-[260px]">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {projectId && (
                <MilestoneQuickAdd
                  projectId={projectId}
                  onAdded={loadMilestones}
                />
              )}
            </div>
            {projectId && projectValue != null && (
              <p className="text-sm text-muted-foreground">
                Total project value (from project record):{" "}
                {formatInr(projectValue)}
              </p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phase</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((m) => (
                  <TableRow key={String(m.id)}>
                    <TableCell>{String(m.phase)}</TableCell>
                    <TableCell>{(m.label as string) || "—"}</TableCell>
                    <TableCell>{formatInr(Number(m.amount))}</TableCell>
                    <TableCell>
                      {(m.due_date as string) || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          m.derived_status === "overdue"
                            ? "destructive"
                            : m.derived_status === "paid"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {String(m.derived_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!m.paid_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const res = await fetch(
                              `/api/crm/payment-milestones/${m.id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  paid_at: new Date().toISOString(),
                                }),
                              }
                            );
                            if (!res.ok) {
                              const err = await res.json();
                              toast.error(err?.error || "Failed");
                              return;
                            }
                            toast.success("Marked paid");
                            loadMilestones();
                            loadSummary();
                          }}
                        >
                          Mark paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4 space-y-4">
            <InvoiceForm
              projects={initialProjects}
              onCreated={() => {
                loadInvoices();
                loadSummary();
              }}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={String(inv.id)}>
                    <TableCell>{String(inv.invoice_number)}</TableCell>
                    <TableCell>{String(inv.client_email)}</TableCell>
                    <TableCell>{formatInr(Number(inv.amount))}</TableCell>
                    <TableCell>{String(inv.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const res = await fetch(
                            `/api/crm/invoices/${inv.id}/download`
                          );
                          const data = await res.json();
                          if (data.url) window.open(data.url, "_blank");
                        }}
                      >
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="expenses" className="mt-4 space-y-4">
            <ExpenseForm
              onCreated={() => {
                loadExpenses();
                loadSummary();
              }}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((ex) => (
                  <TableRow key={String(ex.id)}>
                    <TableCell>{String(ex.expense_date)}</TableCell>
                    <TableCell>{String(ex.category)}</TableCell>
                    <TableCell>{(ex.vendor as string) || "—"}</TableCell>
                    <TableCell>{formatInr(Number(ex.amount))}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (!confirm("Delete expense?")) return;
                          const res = await fetch(
                            `/api/crm/expenses/${ex.id}`,
                            { method: "DELETE" }
                          );
                          if (!res.ok) {
                            const err = await res.json();
                            toast.error(err?.error);
                            return;
                          }
                          loadExpenses();
                          loadSummary();
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function MilestoneQuickAdd({
  projectId,
  onAdded,
}: {
  projectId: string;
  onAdded: () => void;
}) {
  const [phase, setPhase] = useState("advance");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/payment-milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        phase,
        amount: Number(amount),
        due_date: due || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Milestone added");
    setAmount("");
    setDue("");
    onAdded();
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <Select value={phase} onValueChange={setPhase}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="advance">Advance</SelectItem>
          <SelectItem value="mid">Mid</SelectItem>
          <SelectItem value="final">Final</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-28"
        required
      />
      <Input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="w-40"
      />
      <Button type="submit">Add</Button>
    </form>
  );
}

function InvoiceForm({
  projects,
  onCreated,
}: {
  projects: ProjectOpt[];
  onCreated: () => void;
}) {
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [sendEmail, setSendEmail] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_email: clientEmail,
        client_name: clientName,
        amount: Number(amount),
        project_id: projectId || null,
        send_email: sendEmail,
        line_items: [{ description: "Services", amount: Number(amount) }],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || data?.hint || "Failed");
      return;
    }
    toast.success("Invoice created");
    if (data.email && !data.email.sent) {
      toast.message(String(data.email.reason || "Email not sent"));
    }
    setClientEmail("");
    setClientName("");
    setAmount("");
    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
    >
      <div className="space-y-1">
        <Label>Client email</Label>
        <Input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Client name</Label>
        <Input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Amount (₹)</Label>
        <Input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
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
      <div className="flex items-center gap-2 md:col-span-2">
        <Checkbox
          id="sendinv"
          checked={sendEmail}
          onCheckedChange={(v) => setSendEmail(v === true)}
        />
        <Label htmlFor="sendinv" className="font-normal">
          Send PDF to client (Resend)
        </Label>
      </div>
      <Button type="submit" className="md:col-span-2">
        Generate PDF & save
      </Button>
    </form>
  );
}

function ExpenseForm({ onCreated }: { onCreated: () => void }) {
  const [category, setCategory] = useState("tools");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [recurring, setRecurring] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/crm/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        vendor,
        amount: Number(amount),
        expense_date: date,
        is_recurring: recurring,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed");
      return;
    }
    toast.success("Expense recorded");
    setVendor("");
    setAmount("");
    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-3"
    >
      <div className="space-y-1">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tools">Tools (e.g. AWS)</SelectItem>
            <SelectItem value="apis">APIs</SelectItem>
            <SelectItem value="salary">Salaries</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Vendor</Label>
        <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Amount</Label>
        <Input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-2 pt-6">
        <Checkbox
          id="rec"
          checked={recurring}
          onCheckedChange={(v) => setRecurring(v === true)}
        />
        <Label htmlFor="rec" className="font-normal">
          Recurring
        </Label>
      </div>
      <div className="flex items-end">
        <Button type="submit">Add expense</Button>
      </div>
    </form>
  );
}
