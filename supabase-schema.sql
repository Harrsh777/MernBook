-- Supabase Database Schema for Job Scraper

-- Enable Row Level Security
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS liked_jobs ENABLE ROW LEVEL SECURITY;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  posted_date TEXT,
  salary TEXT,
  job_type TEXT,
  experience_level TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create liked_jobs table
CREATE TABLE IF NOT EXISTS liked_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_scraped_at ON jobs(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_liked_jobs_user_id ON liked_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_jobs_job_id ON liked_jobs(job_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for jobs table
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Jobs table policies (public read access)
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
CREATE POLICY "Jobs are viewable by everyone" ON jobs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Jobs are insertable by service role" ON jobs;
CREATE POLICY "Jobs are insertable by service role" ON jobs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Jobs are updatable by service role" ON jobs;
CREATE POLICY "Jobs are updatable by service role" ON jobs
    FOR UPDATE USING (auth.role() = 'service_role');

-- Liked jobs policies (user-specific)
DROP POLICY IF EXISTS "Users can view their own liked jobs" ON liked_jobs;
CREATE POLICY "Users can view their own liked jobs" ON liked_jobs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own liked jobs" ON liked_jobs;
CREATE POLICY "Users can insert their own liked jobs" ON liked_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own liked jobs" ON liked_jobs;
CREATE POLICY "Users can delete their own liked jobs" ON liked_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create a view for jobs with like status (for authenticated users)
CREATE OR REPLACE VIEW jobs_with_likes AS
SELECT 
    j.*,
    CASE 
        WHEN lj.user_id IS NOT NULL THEN true 
        ELSE false 
    END as is_liked,
    lj.liked_at
FROM jobs j
LEFT JOIN liked_jobs lj ON j.id = lj.job_id AND lj.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON jobs_with_likes TO authenticated;

-- Create a function to search jobs with full-text search
CREATE OR REPLACE FUNCTION search_jobs(
    search_query TEXT DEFAULT '',
    company_filter TEXT DEFAULT '',
    location_filter TEXT DEFAULT '',
    job_type_filter TEXT DEFAULT '',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company TEXT,
    location TEXT,
    description TEXT,
    url TEXT,
    posted_date TEXT,
    salary TEXT,
    job_type TEXT,
    experience_level TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE,
    is_liked BOOLEAN,
    liked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.company,
        j.location,
        j.description,
        j.url,
        j.posted_date,
        j.salary,
        j.job_type,
        j.experience_level,
        j.scraped_at,
        CASE 
            WHEN lj.user_id IS NOT NULL THEN true 
            ELSE false 
        END as is_liked,
        lj.liked_at
    FROM jobs j
    LEFT JOIN liked_jobs lj ON j.id = lj.job_id AND lj.user_id = auth.uid()
    WHERE 
        (search_query = '' OR 
         to_tsvector('english', j.title || ' ' || j.description || ' ' || j.company) @@ plainto_tsquery('english', search_query))
        AND (company_filter = '' OR j.company ILIKE '%' || company_filter || '%')
        AND (location_filter = '' OR j.location ILIKE '%' || location_filter || '%')
        AND (job_type_filter = '' OR j.job_type ILIKE '%' || job_type_filter || '%')
    ORDER BY j.scraped_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the search function
GRANT EXECUTE ON FUNCTION search_jobs TO authenticated;
GRANT EXECUTE ON FUNCTION search_jobs TO anon;

-- Create a function to get liked jobs for a user
CREATE OR REPLACE FUNCTION get_liked_jobs(
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company TEXT,
    location TEXT,
    description TEXT,
    url TEXT,
    posted_date TEXT,
    salary TEXT,
    job_type TEXT,
    experience_level TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE,
    liked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.company,
        j.location,
        j.description,
        j.url,
        j.posted_date,
        j.salary,
        j.job_type,
        j.experience_level,
        j.scraped_at,
        lj.liked_at
    FROM jobs j
    INNER JOIN liked_jobs lj ON j.id = lj.job_id
    WHERE lj.user_id = auth.uid()
    ORDER BY lj.liked_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the get_liked_jobs function
GRANT EXECUTE ON FUNCTION get_liked_jobs TO authenticated;