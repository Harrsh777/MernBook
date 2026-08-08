"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrmProjectRow } from "@/lib/crm/queries";

const statusVariant = (s: string) => {
  if (s === "completed") return "default";
  if (s === "review") return "secondary";
  if (s === "not_started") return "outline";
  return "outline";
};

function formatMoney(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const columns: ColumnDef<CrmProjectRow>[] = [
  {
    accessorKey: "title",
    header: "Project",
    cell: ({ row }) => (
      <div className="max-w-[220px]">
        <div className="font-medium leading-tight">{row.original.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.client_name || row.original.client_email || "—"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {row.original.status.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => `${row.original.progress ?? 0}%`,
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) =>
      row.original.deadline
        ? new Date(row.original.deadline).toLocaleDateString("en-IN")
        : "—",
  },
  {
    id: "budget",
    header: "Budget",
    cell: ({ row }) => formatMoney(row.original.price),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/crm/projects/${row.original.id}`}>Open</Link>
      </Button>
    ),
  },
];

export function CrmProjectsTable({ projects }: { projects: CrmProjectRow[] }) {
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border bg-card px-4 py-3 lg:px-6">
      <h2 className="mb-3 text-sm font-semibold">All projects</h2>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-muted-foreground"
              >
                No projects yet. Create one to get started.
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
