import { NextRequest, NextResponse } from 'next/server';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_date?: string;
  salary?: string;
  job_type?: string;
  experience_level?: string;
  scraped_at: string;
}

// Simple fallback scraping using fetch and basic parsing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const keyword = searchParams.get('keyword');

    console.log('Using fallback scraping method...');
    
    const jobs: JobListing[] = [];
    
    // Simple mock jobs for demonstration when Puppeteer fails
    const mockJobs: JobListing[] = [
      {
        id: `fallback-${Date.now()}-1`,
        title: 'Senior Software Engineer',
        company: company || 'Tech Company',
        location: 'San Francisco, CA',
        description: 'We are looking for a Senior Software Engineer to join our team. You will work on building scalable applications using modern technologies.',
        url: 'https://example.com/job/1',
        posted_date: '2 days ago',
        salary: '$120,000 - $180,000',
        job_type: 'Full-time',
        experience_level: 'Senior',
        scraped_at: new Date().toISOString()
      },
      {
        id: `fallback-${Date.now()}-2`,
        title: 'Full Stack Developer',
        company: company || 'Startup Inc',
        location: 'Remote',
        description: 'Join our fast-growing startup as a Full Stack Developer. Work with React, Node.js, and cloud technologies.',
        url: 'https://example.com/job/2',
        posted_date: '1 week ago',
        salary: '$80,000 - $120,000',
        job_type: 'Full-time',
        experience_level: 'Mid-level',
        scraped_at: new Date().toISOString()
      },
      {
        id: `fallback-${Date.now()}-3`,
        title: 'DevOps Engineer',
        company: company || 'Cloud Corp',
        location: 'New York, NY',
        description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and deployment pipelines.',
        url: 'https://example.com/job/3',
        posted_date: '3 days ago',
        salary: '$100,000 - $150,000',
        job_type: 'Full-time',
        experience_level: 'Senior',
        scraped_at: new Date().toISOString()
      }
    ];

    // Filter by keyword if provided
    const filteredJobs = keyword 
      ? mockJobs.filter(job => 
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(keyword.toLowerCase())
        )
      : mockJobs;

    jobs.push(...filteredJobs);

    console.log(`Fallback scraping completed: ${jobs.length} jobs found`);

    return NextResponse.json({
      success: true,
      jobs: jobs,
      total: jobs.length,
      message: 'Fallback scraping completed - using mock data'
    });

  } catch (error) {
    console.error('Fallback scraping error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fallback scraping failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
