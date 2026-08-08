"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CrmTaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  deadline: string | null;
  assigned_to: string | null;
  project_id: string | null;
  status: string;
  sort_order: number;
};

const STATUSES = ["todo", "in_progress", "done"] as const;
const LABELS: Record<string, string> = {
  todo: "Todo",
  in_progress: "In progress",
  done: "Done",
};

function TaskCard({
  task,
  isDragging,
}: {
  task: CrmTaskRow;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none p-3 text-sm shadow-sm active:cursor-grabbing",
        isDragging && "opacity-60"
      )}
    >
      <div className="font-medium leading-snug">{task.title}</div>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="text-[10px]">
          {task.priority}
        </Badge>
        {task.deadline && (
          <span className="text-[10px] text-muted-foreground">
            {task.deadline.slice(0, 10)}
          </span>
        )}
      </div>
    </Card>
  );
}

function Column({
  status,
  tasks,
  activeId,
}: {
  status: (typeof STATUSES)[number];
  tasks: CrmTaskRow[];
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex min-h-[420px] flex-1 flex-col rounded-xl border bg-muted/30">
      <div className="border-b px-3 py-2 text-sm font-semibold">
        {LABELS[status]}
        <span className="ml-2 text-muted-foreground">({tasks.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 p-2",
          isOver && "bg-primary/5"
        )}
      >
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} isDragging={activeId === t.id} />
        ))}
      </div>
    </div>
  );
}

export function CrmTaskKanban({
  tasks,
  onStatusChange,
}: {
  tasks: CrmTaskRow[];
  onStatusChange: (taskId: string, status: string) => Promise<void>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const grouped = useMemo(() => {
    const g: Record<string, CrmTaskRow[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    for (const t of tasks) {
      const s = STATUSES.includes(t.status as (typeof STATUSES)[number])
        ? t.status
        : "todo";
      g[s].push(t);
    }
    for (const k of STATUSES) {
      g[k].sort((a, b) => a.sort_order - b.sort_order);
    }
    return g;
  }, [tasks]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const resolveColumn = (overId: string): (typeof STATUSES)[number] | null => {
    if (STATUSES.includes(overId as (typeof STATUSES)[number])) {
      return overId as (typeof STATUSES)[number];
    }
    const hit = tasks.find((x) => x.id === overId);
    if (hit && STATUSES.includes(hit.status as (typeof STATUSES)[number])) {
      return hit.status as (typeof STATUSES)[number];
    }
    return null;
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const taskId = String(active.id);
    const col = resolveColumn(String(over.id));
    if (!col) return;
    const t = tasks.find((x) => x.id === taskId);
    if (t && t.status !== col) {
      await onStatusChange(taskId, col);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        {STATUSES.map((s) => (
          <Column
            key={s}
            status={s}
            tasks={grouped[s]}
            activeId={activeId}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
