-- Client Project Portal Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    total_project_amount DECIMAL(10, 2) DEFAULT 0,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    project_status VARCHAR(50) DEFAULT 'Planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client updates table
CREATE TABLE IF NOT EXISTS client_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) NOT NULL REFERENCES clients(project_code) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client media table
CREATE TABLE IF NOT EXISTS client_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) NOT NULL REFERENCES clients(project_code) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_project_code ON clients(project_code);
CREATE INDEX IF NOT EXISTS idx_client_updates_project_code ON client_updates(project_code);
CREATE INDEX IF NOT EXISTS idx_client_media_project_code ON client_media(project_code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_updates_updated_at BEFORE UPDATE ON client_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_media ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only view their own data
CREATE POLICY "Clients can view own data" ON clients
    FOR SELECT USING (true); -- Will be filtered by application logic

CREATE POLICY "Clients can view own updates" ON client_updates
    FOR SELECT USING (true); -- Will be filtered by application logic

CREATE POLICY "Clients can view own media" ON client_media
    FOR SELECT USING (true); -- Will be filtered by application logic

-- Admin policies (will be handled by service role key in admin routes)
-- Service role key bypasses RLS, so admin routes should use service role

-- Insert sample data (for testing - remove in production)
-- Password: "test123" hashed with bcrypt
-- INSERT INTO clients (project_code, password_hash, client_name, project_name, total_project_amount, amount_paid, project_status)
-- VALUES ('PROJ001', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'John Doe', 'E-commerce Website', 50000.00, 25000.00, 'Development');

