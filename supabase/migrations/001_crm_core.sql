-- CRM admin dashboard: run in Supabase SQL editor or via CLI migrate.
-- Extends existing projects / milestones / profiles from the client portal.
--
-- Admin access: create a user in Authentication, add a profiles row with role
-- 'client' from signup, then run:
--   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';

-- Activity log (project-scoped; dashboard aggregates globally)
CREATE TABLE IF NOT EXISTS project_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_activity_project ON project_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_created ON project_activity(created_at DESC);

-- Payment rows (pending vs paid) for revenue + pending totals
CREATE TABLE IF NOT EXISTS project_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at timestamptz,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_payments_project ON project_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_payments_status ON project_payments(status);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0;

ALTER TABLE milestones ADD COLUMN IF NOT EXISTS due_date date;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS access_disabled boolean DEFAULT false;

-- Optional: allow service role full access; tighten RLS in Supabase UI as needed.
