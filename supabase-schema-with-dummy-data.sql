-- ============================================
-- Client Project Portal - Complete Schema + Dummy Data
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CLIENTS TABLE
-- ============================================
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

-- ============================================
-- 2. CLIENT UPDATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS client_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) NOT NULL REFERENCES clients(project_code) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CLIENT MEDIA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS client_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) NOT NULL REFERENCES clients(project_code) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_clients_project_code ON clients(project_code);
CREATE INDEX IF NOT EXISTS idx_client_updates_project_code ON client_updates(project_code);
CREATE INDEX IF NOT EXISTS idx_client_media_project_code ON client_media(project_code);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_updates_updated_at BEFORE UPDATE ON client_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_media ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all SELECT (filtered by application logic)
CREATE POLICY "Clients can view own data" ON clients
    FOR SELECT USING (true);

CREATE POLICY "Clients can view own updates" ON client_updates
    FOR SELECT USING (true);

CREATE POLICY "Clients can view own media" ON client_media
    FOR SELECT USING (true);

-- ============================================
-- DUMMY DATA INSERTION
-- ============================================

-- NOTE: Password hashes below are for passwords "client123" and "password123"
-- To generate new hashes, use: node scripts/hash-password.js <password>

-- ============================================
-- CLIENT 1: E-commerce Website Project
-- ============================================
INSERT INTO clients (
    project_code,
    password_hash,
    client_name,
    project_name,
    total_project_amount,
    amount_paid,
    project_status
) VALUES (
    'PROJ001',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: client123
    'John Smith',
    'E-commerce Website Development',
    75000.00,
    37500.00,
    'Development'
);

-- Updates for Client 1
INSERT INTO client_updates (
    project_code,
    title,
    description,
    links
) VALUES 
(
    'PROJ001',
    'Project Kickoff Complete',
    'We have successfully completed the project kickoff meeting and gathered all requirements. The design phase has begun, and we expect to have initial mockups ready by next week.

Key deliverables discussed:
- User authentication system
- Product catalog with search functionality
- Shopping cart and checkout process
- Admin dashboard for inventory management',
    '["https://figma.com/design/proj001", "https://docs.google.com/document/proj001"]'::jsonb
),
(
    'PROJ001',
    'Development Phase Started',
    'Great news! We have started the development phase. The backend API is 60% complete, and we are making excellent progress on the frontend components.

Current status:
✅ Database schema implemented
✅ Authentication system working
🔄 Product catalog in progress
⏳ Payment integration scheduled for next week

We are on track to meet the deadline!',
    '["https://github.com/company/proj001-backend", "https://staging.proj001.com"]'::jsonb
);

-- Media for Client 1 (using placeholder URLs - replace with actual Supabase Storage URLs)
INSERT INTO client_media (
    project_code,
    image_url,
    image_name,
    uploaded_at
) VALUES 
(
    'PROJ001',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'Homepage Design Mockup',
    NOW() - INTERVAL '5 days'
),
(
    'PROJ001',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    'Product Catalog Wireframe',
    NOW() - INTERVAL '3 days'
);

-- ============================================
-- CLIENT 2: Mobile App Project
-- ============================================
INSERT INTO clients (
    project_code,
    password_hash,
    client_name,
    project_name,
    total_project_amount,
    amount_paid,
    project_status
) VALUES (
    'PROJ002',
    '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- password: password123
    'Sarah Johnson',
    'Fitness Tracking Mobile App',
    95000.00,
    47500.00,
    'Testing'
);

-- Updates for Client 2
INSERT INTO client_updates (
    project_code,
    title,
    description,
    links
) VALUES 
(
    'PROJ002',
    'Beta Version Released',
    'We are excited to announce that the beta version of your fitness tracking app is now available for testing!

Features included in this release:
- User registration and profile setup
- Workout tracking with GPS integration
- Progress charts and statistics
- Social features (coming soon)

Please test thoroughly and provide feedback. We have scheduled a review meeting for next Friday.',
    '["https://testflight.apple.com/proj002", "https://play.google.com/store/apps/details?id=com.fitness.proj002"]'::jsonb
),
(
    'PROJ002',
    'Final Testing Phase',
    'We are in the final testing phase! All major features have been implemented and are being tested for bugs.

Current focus:
✅ Core functionality tested
✅ Performance optimization complete
🔄 UI/UX refinements in progress
⏳ App store submission preparation

We expect to submit to app stores within 2 weeks. Stay tuned for updates!',
    '["https://docs.google.com/spreadsheets/proj002-testing", "https://trello.com/proj002"]'::jsonb
);

-- Media for Client 2 (using placeholder URLs - replace with actual Supabase Storage URLs)
INSERT INTO client_media (
    project_code,
    image_url,
    image_name,
    uploaded_at
) VALUES 
(
    'PROJ002',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'App Home Screen Design',
    NOW() - INTERVAL '7 days'
),
(
    'PROJ002',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    'Workout Tracking Interface',
    NOW() - INTERVAL '4 days'
);

-- ============================================
-- VERIFICATION QUERIES (Optional - run to verify data)
-- ============================================

-- View all clients
-- SELECT * FROM clients;

-- View all updates
-- SELECT * FROM client_updates ORDER BY created_at DESC;

-- View all media
-- SELECT * FROM client_media ORDER BY uploaded_at DESC;

-- View complete project data for PROJ001
-- SELECT 
--     c.*,
--     (SELECT COUNT(*) FROM client_updates WHERE project_code = c.project_code) as update_count,
--     (SELECT COUNT(*) FROM client_media WHERE project_code = c.project_code) as media_count
-- FROM clients c;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Password hashes are for:
--    - PROJ001: password is "client123"
--    - PROJ002: password is "password123"
--
-- 2. Image URLs are placeholder Unsplash images.
--    In production, replace with actual Supabase Storage URLs
--    after uploading images to the 'client-media' bucket.
--
-- 3. To generate new password hashes, use:
--    node scripts/hash-password.js <your-password>
--
-- 4. Make sure to create the 'client-media' storage bucket
--    in Supabase Dashboard > Storage before uploading images.

