import { NextRequest, NextResponse } from 'next/server';

// Fallback in-memory storage for demo purposes
interface LikedJobMemory {
  id: string;
  job_id: string;
  liked_at: string;
}

let likedJobsStorage: LikedJobMemory[] = [];

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
    const { supabase } = await import('@/lib/supabase-client');
    return supabase;
  } catch {
    console.error('Supabase not configured, using fallback storage');
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = await getSupabaseClient();

    if (supabase) {
      // Use Supabase if configured
      try {
        // Get liked jobs for the authenticated user
        const { data: likedJobs, error } = await supabase.rpc('get_liked_jobs', {
          limit_count: limit,
          offset_count: offset
        });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        // Get total count
        const { count } = await supabase
          .from('liked_jobs')
          .select('*', { count: 'exact', head: true });

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
          success: true,
          jobs: likedJobs || [],
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
    const total = likedJobsStorage.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedJobs = likedJobsStorage.slice(offset, offset + limit);

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
    console.error('Error fetching liked jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch liked jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    if (supabase) {
      // Use Supabase if configured
      try {
        // Add job to liked jobs
        const { data, error } = await supabase
          .from('liked_jobs')
          .insert({ job_id: jobId })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            return NextResponse.json(
              { success: false, error: 'Job already liked' },
              { status: 409 }
            );
          }
          console.error('Supabase error:', error);
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Job liked successfully in Supabase',
          likedJob: data
        });
      } catch (supabaseError) {
        console.error('Supabase error, falling back to in-memory storage:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    const existingLike = likedJobsStorage.find(like => like.job_id === jobId);
    if (existingLike) {
      return NextResponse.json(
        { success: false, error: 'Job already liked' },
        { status: 409 }
      );
    }

    const newLike = {
      id: `like-${jobId}-${Date.now()}`,
      job_id: jobId,
      liked_at: new Date().toISOString()
    };

    likedJobsStorage.push(newLike);

    return NextResponse.json({
      success: true,
      message: 'Job liked successfully in memory',
      likedJob: newLike
    });

  } catch (error) {
    console.error('Error liking job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like job' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    if (supabase) {
      // Use Supabase if configured
      try {
        // Remove job from liked jobs
        const { error } = await supabase
          .from('liked_jobs')
          .delete()
          .eq('job_id', jobId);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Job unliked successfully in Supabase'
        });
      } catch (supabaseError) {
        console.error('Supabase error, falling back to in-memory storage:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    const initialLength = likedJobsStorage.length;
    likedJobsStorage = likedJobsStorage.filter(like => like.job_id !== jobId);
    
    if (likedJobsStorage.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Job not found in liked jobs' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job unliked successfully in memory'
    });

  } catch (error) {
    console.error('Error unliking job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlike job' },
      { status: 500 }
    );
  }
}