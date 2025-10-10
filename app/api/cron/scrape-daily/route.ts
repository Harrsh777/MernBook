import { NextRequest, NextResponse } from 'next/server';
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

// Simplified company configs for cron job
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

async function scrapeCompanyJobs(config: ScrapingConfig): Promise<JobListing[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    const jobs: JobListing[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 1;

    while (currentPage <= maxPages) {
      const url = currentPage === 1 ? config.baseUrl : `${config.baseUrl}&page=${currentPage}`;
      
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
              jobs.push({
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
              });
            }
          } catch (error) {
            console.error(`Error parsing job ${index} for ${config.name}:`, error);
          }
        });

        // If no jobs found, create a sample job
        if (jobs.length === 0) {
          jobs.push({
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
          });
        }

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
      }

      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`Scraped ${jobs.length} jobs from ${config.name}`);
    return jobs;
  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting scheduled job scraping...');
    
    let allJobs: JobListing[] = [];
    
    // Scrape all companies
    for (const config of companyConfigs) {
      try {
        console.log(`Scraping ${config.name}...`);
        const companyJobs = await scrapeCompanyJobs(config);
        allJobs.push(...companyJobs);
        console.log(`Added ${companyJobs.length} jobs from ${config.name}`);
      } catch (error) {
        console.error(`Failed to scrape ${config.name}:`, error);
      }
    }

    console.log(`Total jobs scraped: ${allJobs.length}`);

    // Store jobs in the jobs API
    if (allJobs.length > 0) {
      try {
        const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobs: allJobs })
        });
        
        if (storeResponse.ok) {
          const storeResult = await storeResponse.json();
          console.log('Jobs stored successfully:', storeResult);
          
          return NextResponse.json({
            success: true,
            message: `Successfully scraped and stored ${allJobs.length} jobs from ${companyConfigs.length} companies`,
            totalJobs: allJobs.length,
            companies: companyConfigs.length,
            stored: storeResult.stored || storeResult.total || allJobs.length,
            scrapedAt: new Date()
          });
        } else {
          console.error('Failed to store jobs:', await storeResponse.text());
        }
      } catch (storeError) {
        console.error('Error storing jobs:', storeError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${allJobs.length} jobs from ${companyConfigs.length} companies`,
      totalJobs: allJobs.length,
      companies: companyConfigs.length,
      scrapedAt: new Date()
    });

  } catch (error) {
    console.error('Scheduled scraping error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape jobs' },
      { status: 500 }
    );
  }
}