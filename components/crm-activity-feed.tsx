import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ActivityItem = {
  id: string;
  project_id: string;
  project_title: string | null;
  event_type: string;
  message: string | null;
  created_at: string;
};

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CrmActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No events yet. Creating a project will seed the feed.
          </p>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border bg-card/50 px-3 py-2 text-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-foreground">
                {a.message || a.event_type.replace(/_/g, " ")}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatTime(a.created_at)}
              </span>
            </div>
            {a.project_title && (
              <p className="mt-1 text-xs text-muted-foreground">
                {a.project_title}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
