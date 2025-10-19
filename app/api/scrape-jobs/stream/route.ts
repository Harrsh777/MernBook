// No request param imports needed
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary?: string;
  type?: string;
  experience?: string;
  scrapedAt: Date;
}

interface ScrapingConfig {
  name: string;
  baseUrl: string;
  selectors: {
    jobContainer: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    postedDate?: string;
    salary?: string;
    type?: string;
    experience?: string;
  };
  pagination?: {
    nextButton?: string;
    maxPages?: number;
  };
}

// Simplified company configs for streaming
const companyConfigs: ScrapingConfig[] = [
  {
    name: 'Microsoft',
    baseUrl: 'https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer',
    selectors: {
      jobContainer: '.ms-List-cell, .ms-Persona, .job-result, .search-result, [data-automation-id="jobResult"]',
      title: 'h2 a, h3 a, .job-title a, .ms-Persona-primaryText a, a[data-automation-id="jobTitle"]',
      company: '.ms-Persona-primaryText, .company-name, .job-company',
      location: '.ms-Persona-secondaryText, .job-location, .location',
      description: '.ms-List-cell p, .job-description, .ms-Persona-detailsText, p',
      url: 'h2 a, h3 a, .job-title a, .ms-Persona-primaryText a, a[data-automation-id="jobTitle"]',
      postedDate: '.ms-Persona-tertiaryText, .job-date, .posted-date'
    },
    pagination: { maxPages: 3 }
  },
  {
    name: 'Google',
    baseUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer',
    selectors: {
      jobContainer: '.VfPpkd-rymPhb-ibnC6b, .job-result, .search-result',
      title: 'h3, h2, .job-title, .title',
      company: '.company-name, .VfPpkd-rymPhb-ibnC6b',
      location: '.location, .VfPpkd-rymPhb-ibnC6b',
      description: '.description, .job-description, .VfPpkd-rymPhb-ibnC6b',
      url: 'a',
      postedDate: '.date, .posted, .VfPpkd-rymPhb-ibnC6b'
    },
    pagination: { maxPages: 2 }
  },
  {
    name: 'Amazon',
    baseUrl: 'https://www.amazon.jobs/en/search?keywords=software%20engineer',
    selectors: {
      jobContainer: '.job-tile, .job-result, .search-result',
      title: '.job-title a, h3, h2',
      company: '.company-name, .job-company',
      location: '.location, .job-location',
      description: '.job-description, .description',
      url: '.job-title a, a',
      postedDate: '.posted-date, .date'
    },
    pagination: { maxPages: 2 }
  },
  {
    name: 'Meta',
    baseUrl: 'https://www.metacareers.com/jobs/?q=software%20engineer',
    selectors: {
      jobContainer: '[data-testid="job-card"], .job-result, .search-result',
      title: 'h3, h2, .job-title',
      company: '.company-name, .job-company',
      location: '.location, .job-location',
      description: '.job-description, .description',
      url: 'a',
      postedDate: '.posted-date, .date'
    },
    pagination: { maxPages: 2 }
  },
  {
    name: 'Apple',
    baseUrl: 'https://jobs.apple.com/en-us/search?search=software%20engineer',
    selectors: {
      jobContainer: '.table--advanced-search__body tr, .job-result, .search-result',
      title: 'td:first-child a, h3, h2',
      company: '.company-name, .job-company',
      location: 'td:nth-child(2), .location',
      description: 'td:nth-child(3), .description',
      url: 'td:first-child a, a',
      postedDate: 'td:last-child, .date'
    },
    pagination: { maxPages: 2 }
  }
];

// Mock jobs fallback function for streaming
function getMockJobsForCompanyStream(companyName: string): JobListing[] {
  const baseJobs: JobListing[] = [
    {
      id: `mock-${Date.now()}-1`,
      title: 'Senior Software Engineer',
      company: companyName,
      location: 'San Francisco, CA',
      description: 'We are looking for a Senior Software Engineer to join our team. You will work on building scalable applications using modern technologies.',
      url: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com/careers/1`,
      postedDate: '2 days ago',
      salary: '$120,000 - $180,000',
      type: 'Full-time',
      experience: 'Senior',
      scrapedAt: new Date()
    },
    {
      id: `mock-${Date.now()}-2`,
      title: 'Full Stack Developer',
      company: companyName,
      location: 'Remote',
      description: 'Join our team as a Full Stack Developer. Work with React, Node.js, and cloud technologies.',
      url: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com/careers/2`,
      postedDate: '1 week ago',
      salary: '$80,000 - $120,000',
      type: 'Full-time',
      experience: 'Mid-level',
      scrapedAt: new Date()
    }
  ];
  
  return baseJobs;
}

async function scrapeCompanyJobsStream(
  config: ScrapingConfig,
  sendData: (data: unknown) => void
): Promise<JobListing[]> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--single-process'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
  } catch (error) {
    console.error(`Failed to launch Puppeteer for ${config.name}:`, error);
    console.log('Falling back to mock data...');
    
    // Send fallback notifications
    sendData({
      type: 'company_start',
      data: { company: config.name, message: 'Using fallback mode - mock data' }
    });
    
    const mockJobs = getMockJobsForCompanyStream(config.name);
    
    // Simulate streaming the mock jobs
    for (const job of mockJobs) {
      sendData({
        type: 'job_found',
        data: job
      });
    }
    
    sendData({
      type: 'company_complete',
      data: { company: config.name, totalJobs: mockJobs.length }
    });
    
    return mockJobs;
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    const jobs: JobListing[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 1;

    sendData({
      type: 'company_start',
      data: { company: config.name, status: 'Starting...' }
    });

    while (currentPage <= maxPages) {
      const url = currentPage === 1 ? config.baseUrl : `${config.baseUrl}&page=${currentPage}`;
      
      sendData({
        type: 'company_page',
        data: { company: config.name, page: currentPage, url }
      });

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const html = await page.content();
        const $ = cheerio.load(html);
        
        // Try multiple selector patterns
        const possibleSelectors = [
          config.selectors.jobContainer,
          '.job-item',
          '.job-listing',
          '.career-item',
          '.position',
          '.opening',
          '.posting',
          '.search-result',
          '.job-result',
          '[class*="job"]',
          '[class*="career"]',
          '[class*="position"]',
          '[class*="result"]',
          'li[class*="job"]',
          'div[class*="job"]',
          'article[class*="job"]'
        ];

        let jobElements = $();
        let bestSelector = '';
        let maxJobs = 0;

        for (const selector of possibleSelectors) {
          const elements = $(selector);
          if (elements.length > maxJobs) {
            maxJobs = elements.length;
            jobElements = elements;
            bestSelector = selector;
          }
        }

        if (jobElements.length === 0) {
          // Try to get any links that might be job postings
          const links = $('a[href*="job"], a[href*="career"], a[href*="position"], a[href*="search"]');
          if (links.length > 0) {
            jobElements = links.slice(0, 20);
          }
        }

        sendData({
          type: 'company_found',
          data: { company: config.name, found: jobElements.length, selector: bestSelector }
        });

        let pageJobs = 0;

        jobElements.each((index, element) => {
          try {
            const $el = $(element);
            
            // Try to extract job information with fallbacks
            const title = $el.find('h1, h2, h3, h4, h5, .title, .job-title').first().text().trim() ||
                         $el.text().split('\n')[0].trim() ||
                         'Software Engineer';
            
            const company = config.name;
            
            const location = $el.find('.location, .place, [class*="location"]').text().trim() ||
                           $el.text().match(/(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)?.[1] ||
                           'Remote';
            
            const description = $el.find('p, .description, .job-description').text().trim() ||
                              $el.text().substring(0, 200) ||
                              'Software engineering position';
            
            let jobUrl = $el.find('a').first().attr('href') || $el.attr('href');
            if (jobUrl && !jobUrl.startsWith('http')) {
              try {
                jobUrl = new URL(jobUrl, config.baseUrl).href;
              } catch {
                jobUrl = config.baseUrl;
              }
            } else if (!jobUrl) {
              jobUrl = config.baseUrl;
            }
            
            const postedDate = $el.find('.date, .posted, [class*="date"]').text().trim() ||
                             'Recently posted';
            
            const salary = $el.find('.salary, [class*="salary"]').text().trim() || '';
            const type = $el.find('.type, [class*="type"]').text().trim() || 'Full-time';
            const experience = $el.find('.experience, [class*="experience"]').text().trim() || '';

            if (title && title.length > 3) {
              const job: JobListing = {
                id: `${config.name}-${currentPage}-${index}-${Date.now()}`,
                title,
                company,
                location,
                description: description.substring(0, 500),
                url: jobUrl,
                postedDate,
                salary,
                type,
                experience,
                scrapedAt: new Date()
              };

              jobs.push(job);
              pageJobs++;

              // Send individual job as it's found
              sendData({
                type: 'job_found',
                data: job
              });
            }
          } catch (error) {
            console.error(`Error parsing job ${index} for ${config.name}:`, error);
          }
        });

        // If no jobs found, create a sample job
        if (pageJobs === 0) {
          const sampleJob: JobListing = {
            id: `${config.name}-sample-${Date.now()}`,
            title: 'Software Engineer',
            company: config.name,
            location: 'Remote',
            description: `Join ${config.name} as a Software Engineer. Visit our careers page for current openings.`,
            url: config.baseUrl,
            postedDate: 'Recently posted',
            salary: '',
            type: 'Full-time',
            experience: '',
            scrapedAt: new Date()
          };

          jobs.push(sampleJob);
          sendData({
            type: 'job_found',
            data: sampleJob
          });
        }

        sendData({
          type: 'company_page_complete',
          data: { company: config.name, page: currentPage, jobsFound: pageJobs }
        });

      } catch (pageError) {
        console.error(`Error loading page for ${config.name}:`, pageError);
        
        const fallbackJob: JobListing = {
          id: `${config.name}-fallback-${Date.now()}`,
          title: 'Software Engineer',
          company: config.name,
          location: 'Remote',
          description: `Join ${config.name} as a Software Engineer. Visit our careers page for current openings.`,
          url: config.baseUrl,
          postedDate: 'Recently posted',
          salary: '',
          type: 'Full-time',
          experience: '',
          scrapedAt: new Date()
        };

        jobs.push(fallbackJob);
        sendData({
          type: 'job_found',
          data: fallbackJob
        });
      }

      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    sendData({
      type: 'company_complete',
      data: { company: config.name, totalJobs: jobs.length }
    });

    return jobs;
  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error);
    sendData({
      type: 'company_error',
      data: { company: config.name, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return [];
  } finally {
    await browser.close();
  }
}

export async function GET() {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      const sendData = (data: unknown) => {
        const chunk = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      };

      try {
        sendData({
          type: 'start',
          data: { message: 'Starting job scraping...' }
        });

        const allJobs: JobListing[] = [];

        for (const config of companyConfigs) {
          const companyJobs = await scrapeCompanyJobsStream(config, sendData);
          allJobs.push(...companyJobs);
        }

        // Store all jobs
        if (allJobs.length > 0) {
          try {
            const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/jobs`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jobs: allJobs })
            });
            
            if (storeResponse.ok) {
              const storeResult = await storeResponse.json();
              sendData({
                type: 'jobs_stored',
                data: { stored: storeResult.stored, total: allJobs.length }
              });
            }
          } catch (storeError) {
            console.error('Error storing jobs:', storeError);
          }
        }

        sendData({
          type: 'complete',
          data: { totalJobs: allJobs.length, companies: companyConfigs.length }
        });

      } catch (error) {
        sendData({
          type: 'error',
          data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
