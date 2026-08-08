-- Tasks & scheduling (global or linked to a project)
CREATE TABLE IF NOT EXISTS crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  deadline timestamptz,
  assigned_to uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_tasks_project ON crm_tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks (status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_deadline ON crm_tasks (deadline);

-- Meetings (with Meet/Zoom URL); optional project link
CREATE TABLE IF NOT EXISTS crm_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  meet_url text,
  project_id uuid REFERENCES projects (id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_meetings_starts ON crm_meetings (starts_at);
CREATE INDEX IF NOT EXISTS idx_crm_meetings_project ON crm_meetings (project_id);

-- Payment milestones per project (Advance / Mid / Final style)
CREATE TABLE IF NOT EXISTS project_payment_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  phase text NOT NULL CHECK (phase IN ('advance', 'mid', 'final', 'other')),
  label text,
  amount numeric NOT NULL CHECK (amount >= 0),
  due_date date,
  paid_at timestamptz,
  notes text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_payment_milestones_project ON project_payment_milestones (project_id);
CREATE INDEX IF NOT EXISTS idx_project_payment_milestones_due ON project_payment_milestones (due_date);

-- Invoices (PDF path points to Supabase Storage)
CREATE TABLE IF NOT EXISTS crm_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects (id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  client_email text,
  client_name text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  pdf_storage_path text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'void')),
  sent_at timestamptz,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_crm_invoices_project ON crm_invoices (project_id);

-- Personal / business expenses
CREATE TABLE IF NOT EXISTS crm_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('tools', 'apis', 'salary', 'other')),
  vendor text,
  description text,
  amount numeric NOT NULL CHECK (amount >= 0),
  expense_date date NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  notes text,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_expenses_date ON crm_expenses (expense_date);
CREATE INDEX IF NOT EXISTS idx_crm_expenses_category ON crm_expenses (category);

-- Job tracker (personal CRM; not tied to client projects)
CREATE TABLE IF NOT EXISTS crm_job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  role_title text NOT NULL,
  date_applied date NOT NULL,
  status text NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied', 'interview', 'offer', 'rejected')),
  notes text,
  follow_up_at timestamptz,
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_job_applications_owner ON crm_job_applications (owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_job_applications_status ON crm_job_applications (status);
CREATE INDEX IF NOT EXISTS idx_crm_job_applications_followup ON crm_job_applications (follow_up_at);

-- Timeline events per job application
CREATE TABLE IF NOT EXISTS crm_job_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_application_id uuid NOT NULL REFERENCES crm_job_applications (id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  event_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_crm_job_timeline_job ON crm_job_timeline_events (job_application_id);

-- -----------------------------------------------------------------------------
-- Storage: In Supabase Dashboard → Storage → New bucket
--   Name: crm-invoices
--   Public: optional (prefer private + signed URLs from API)
-- Service role uploads bypass RLS; add policies if using anon client.
-- -----------------------------------------------------------------------------
