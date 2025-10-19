import { NextRequest, NextResponse } from 'next/server';

// Fallback in-memory storage for demo purposes
interface InMemoryJob {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_date?: string | null;
  salary?: string | null;
  job_type?: string | null;
  experience_level?: string | null;
  scraped_at: string;
}

let jobsStorage: InMemoryJob[] = [];

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
         process.env.SUPABASE_SERVICE_ROLE_KEY;
};

// Dynamic import for Supabase (only if configured)
const getSupabaseClient = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-client');
    return supabaseAdmin;
  } catch {
    console.error('Supabase not configured, using fallback storage');
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const company = searchParams.get('company') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabaseAdmin = await getSupabaseClient();

    if (supabaseAdmin) {
      // Use Supabase if configured
      try {
        const searchParamsForRpc = {
          search_query: keyword,
          company_filter: company,
          location_filter: location,
          job_type_filter: type,
          limit_count: limit,
          offset_count: offset
        };

        const { data: jobs, error: supaErr } = await supabaseAdmin.rpc('search_jobs', searchParamsForRpc);

        if (supaErr) {
          console.error('Supabase search error:', supaErr);
          throw supaErr;
        }

        // Get total count for pagination
        const { count } = await supabaseAdmin
          .from('jobs')
          .select('*', { count: 'exact', head: true });

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
          success: true,
          jobs: jobs || [],
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        });
      } catch (supabaseError) {
        console.error('Supabase error, falling back to in-memory storage:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    let filteredJobs = [...jobsStorage];

    // Apply filters
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keywordLower) ||
        job.description.toLowerCase().includes(keywordLower) ||
        job.company.toLowerCase().includes(keywordLower)
      );
    }

    if (company) {
      filteredJobs = filteredJobs.filter(job => 
        job.company.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filteredJobs = filteredJobs.filter(job => 
        (job.job_type || '').toLowerCase().includes(type.toLowerCase())
      );
    }

    // Sort by scraped date (newest first)
    filteredJobs.sort((a, b) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime());

    // Apply pagination
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobs } = body;

    if (!Array.isArray(jobs)) {
      return NextResponse.json(
        { success: false, error: 'Jobs must be an array' },
        { status: 400 }
      );
    }

    const supabaseAdmin = await getSupabaseClient();

    if (supabaseAdmin) {
      // Use Supabase if configured
      try {
        // Transform jobs to match database schema
        type IncomingJob = {
          title: string;
          company: string;
          location: string;
          description: string;
          url: string;
          postedDate?: string | null;
          salary?: string | null;
          type?: string | null;
          experience?: string | null;
          scrapedAt: string | Date;
        };

        const transformedJobs = (jobs as IncomingJob[]).map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          url: job.url,
          posted_date: job.postedDate || null,
          salary: job.salary || null,
          job_type: job.type || null,
          experience_level: job.experience || null,
          scraped_at: new Date(job.scrapedAt).toISOString()
        }));

        // Insert jobs with conflict resolution (upsert)
        const { data, error } = await supabaseAdmin
          .from('jobs')
          .upsert(transformedJobs, {
            onConflict: 'url',
            ignoreDuplicates: false
          })
          .select();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: `Stored ${transformedJobs.length} jobs in Supabase`,
          stored: data?.length || 0
        });
      } catch (supabaseError) {
        console.error('Supabase error, falling back to in-memory storage:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    // Remove duplicates based on URL
    const existingUrls = new Set(jobsStorage.map(job => job.url));
    type IncomingJob = {
      title: string;
      company: string;
      location: string;
      description: string;
      url: string;
      postedDate?: string | null;
      salary?: string | null;
      type?: string | null;
      experience?: string | null;
      scrapedAt: string | Date;
    };
    const newJobs: InMemoryJob[] = (jobs as IncomingJob[])
      .filter((job) => !existingUrls.has(job.url))
      .map((job): InMemoryJob => ({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        posted_date: job.postedDate || null,
        salary: job.salary || null,
        job_type: job.type || null,
        experience_level: job.experience || null,
        scraped_at: new Date(job.scrapedAt).toISOString()
      }));
    
    // Add new jobs to storage
    jobsStorage.push(...newJobs);

    return NextResponse.json({
      success: true,
      message: `Stored ${newJobs.length} jobs in memory`,
      stored: newJobs.length,
      total: jobsStorage.length
    });

  } catch (error) {
    console.error('Error storing jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to store jobs' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabaseAdmin = await getSupabaseClient();

    if (supabaseAdmin) {
      // Use Supabase if configured
      try {
        const { error } = await supabaseAdmin
          .from('jobs')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
          console.error('Supabase delete error:', error);
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'All jobs cleared from Supabase'
        });
      } catch (supabaseError) {
        console.error('Supabase error, falling back to in-memory storage:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    jobsStorage = [];

    return NextResponse.json({
      success: true,
      message: 'All jobs cleared from memory'
    });

  } catch (error) {
    console.error('Error clearing jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear jobs' },
      { status: 500 }
    );
  }
}
