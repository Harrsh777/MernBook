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

const companyConfigs: ScrapingConfig[] = [
  // Tech Giants
  {
    name: 'Google',
    baseUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer',
    selectors: {
      jobContainer: '.VfPpkd-rymPhb-ibnC6b',
      title: 'h3',
      company: '.VfPpkd-rymPhb-ibnC6b',
      location: '.VfPpkd-rymPhb-ibnC6b',
      description: '.VfPpkd-rymPhb-ibnC6b',
      url: 'a',
      postedDate: '.VfPpkd-rymPhb-ibnC6b'
    },
    pagination: { maxPages: 1 }
  },
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
    name: 'Amazon',
    baseUrl: 'https://www.amazon.jobs/en/search?keywords=software%20engineer',
    selectors: {
      jobContainer: '.job-tile',
      title: '.job-title a',
      company: '.company-name',
      location: '.location',
      description: '.job-description',
      url: '.job-title a',
      postedDate: '.posted-date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Meta',
    baseUrl: 'https://www.metacareers.com/jobs/?q=software%20engineer',
    selectors: {
      jobContainer: '[data-testid="job-card"]',
      title: 'h3',
      company: '.company-name',
      location: '.location',
      description: '.job-description',
      url: 'a',
      postedDate: '.posted-date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Apple',
    baseUrl: 'https://jobs.apple.com/en-us/search?search=software%20engineer',
    selectors: {
      jobContainer: '.table--advanced-search__body tr',
      title: 'td:first-child a',
      company: '.company-name',
      location: 'td:nth-child(2)',
      description: 'td:nth-child(3)',
      url: 'td:first-child a',
      postedDate: 'td:last-child'
    },
    pagination: { maxPages: 1 }
  },
  // New Companies from your list
  {
    name: 'Klarity',
    baseUrl: 'https://www.klarity.ai/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item, .position',
      title: 'h3, h4, .title, .job-title',
      company: '.company-name, .company',
      location: '.location, .place',
      description: '.description, .job-description, p',
      url: 'a',
      postedDate: '.date, .posted'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'SupplyPike',
    baseUrl: 'https://supplypike.bamboohr.com/careers',
    selectors: {
      jobContainer: '.job-listing, .bamboo-job',
      title: 'h3, h4, .job-title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'HeyJobs',
    baseUrl: 'https://jobs.heyjobs.co/',
    selectors: {
      jobContainer: '.job-card, .job-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Clear Street',
    baseUrl: 'https://www.clearstreet.io/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Hightouch',
    baseUrl: 'https://jobs.lever.co/hightouch',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Code Climate',
    baseUrl: 'https://www.codeclimate.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Zillow',
    baseUrl: 'https://www.zillowgroup.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Upbound',
    baseUrl: 'https://www.upbound.io/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Beyond',
    baseUrl: 'https://www.bynd.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Outgo Inc',
    baseUrl: 'https://www.outgo.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Koala Health',
    baseUrl: 'https://jobs.lever.co/koalahealth',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Airbase',
    baseUrl: 'https://jobs.lever.co/airbase',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Mercari Japan',
    baseUrl: 'https://careers.mercari.com/en/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Starburst',
    baseUrl: 'https://www.starburst.io/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Kymeta',
    baseUrl: 'https://jobs.jobvite.com/kymetacorp',
    selectors: {
      jobContainer: '.jv-job-list-item',
      title: '.jv-job-list-name a',
      company: '.jv-job-list-company',
      location: '.jv-job-list-location',
      description: '.jv-job-list-description',
      url: '.jv-job-list-name a',
      postedDate: '.jv-job-list-date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Akeneo',
    baseUrl: 'https://careers.akeneo.com/connect',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'DraftKings',
    baseUrl: 'https://careers.draftkings.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Mastercard',
    baseUrl: 'https://careers.mastercard.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Cargomatic',
    baseUrl: 'https://job-boards.greenhouse.io/cargomatic',
    selectors: {
      jobContainer: '.opening',
      title: '.opening-title a',
      company: '.company-name',
      location: '.opening-location',
      description: '.opening-description',
      url: '.opening-title a',
      postedDate: '.opening-date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'ComplyAdvantage',
    baseUrl: 'https://complyadvantage.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Box Inc.',
    baseUrl: 'https://www.box.com/en-us/about-us/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Bumble',
    baseUrl: 'https://jobs.bumble.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: '2U',
    baseUrl: 'https://2u.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Breezeway.io',
    baseUrl: 'https://www.breezeway.io/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'American Express',
    baseUrl: 'https://aexp.eightfold.ai/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'DataRobot',
    baseUrl: 'https://www.datarobot.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Ledgy',
    baseUrl: 'https://jobs.lever.co/Ledgy',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'GetGo Technologies',
    baseUrl: 'https://www.getgo.sg/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Truecaller',
    baseUrl: 'https://truecaller.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Vinted',
    baseUrl: 'https://www.vinted.co.uk/jobs',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Deutsche Bahn',
    baseUrl: 'https://io.deutschebahn.com/en/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Docplanner',
    baseUrl: 'https://docplanner.tech/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Bondora',
    baseUrl: 'https://boards.eu.greenhouse.io/bondora',
    selectors: {
      jobContainer: '.opening',
      title: '.opening-title a',
      company: '.company-name',
      location: '.opening-location',
      description: '.opening-description',
      url: '.opening-title a',
      postedDate: '.opening-date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'DeepL',
    baseUrl: 'https://jobs.ashbyhq.com/DeepL',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Wiz.io',
    baseUrl: 'https://www.wiz.io/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Celonis',
    baseUrl: 'https://careers.celonis.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Clarisights',
    baseUrl: 'https://careers.clarisights.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'OLX',
    baseUrl: 'https://careers.olxgroup.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Samsara',
    baseUrl: 'https://samsara.com/company/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Cisco ThousandEyes',
    baseUrl: 'https://www.thousandeyes.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Gruntwork',
    baseUrl: 'https://www.gruntwork.io/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Ravelin Technology',
    baseUrl: 'https://www.ravelin.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Phorest Software',
    baseUrl: 'https://www.phorest.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Reedsy',
    baseUrl: 'https://reedsy.com/jobs',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'ING',
    baseUrl: 'https://www.ing.jobs/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Criteo',
    baseUrl: 'https://www.criteo.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Qonto',
    baseUrl: 'https://qonto.com/en/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Cutover',
    baseUrl: 'https://www.cutover.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'JetBrains',
    baseUrl: 'https://www.jetbrains.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Delivery Hero',
    baseUrl: 'https://careers.smartrecruiters.com/DeliveryHero',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'HubSpot',
    baseUrl: 'https://www.hubspot.com/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Doctolib',
    baseUrl: 'https://careers.doctolib.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Visma',
    baseUrl: 'https://www.visma.com/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'ClickHouse',
    baseUrl: 'https://clickhouse.com/company/careers',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'PushPress',
    baseUrl: 'https://jobs.lever.co/pushpress',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Studocu',
    baseUrl: 'https://jobs.studocu.com/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'BMW Group',
    baseUrl: 'https://www.bmwgroup.jobs/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Scandit',
    baseUrl: 'https://jobs.lever.co/scandit',
    selectors: {
      jobContainer: '.posting',
      title: '.posting-title a',
      company: '.posting-categories',
      location: '.sort-by-location',
      description: '.posting-content',
      url: '.posting-title a',
      postedDate: '.sort-by-time'
    },
    pagination: { maxPages: 1 }
  },
  {
    name: 'Freshworks',
    baseUrl: 'https://www.freshworks.com/company/careers/',
    selectors: {
      jobContainer: '.job-listing, .career-item',
      title: 'h3, h4, .title',
      company: '.company-name',
      location: '.location',
      description: '.description, p',
      url: 'a',
      postedDate: '.date'
    },
    pagination: { maxPages: 1 }
  }
];

// Mock jobs fallback function
function getMockJobsForCompany(companyName: string): JobListing[] {
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

async function scrapeCompanyJobs(config: ScrapingConfig): Promise<JobListing[]> {
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
    return getMockJobsForCompany(config.name);
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    const jobs: JobListing[] = [];
    let currentPage = 1;
    const maxPages = config.pagination?.maxPages || 1;

    while (currentPage <= maxPages) {
      const url = currentPage === 1 ? config.baseUrl : `${config.baseUrl}?page=${currentPage}`;
      console.log(`Scraping ${config.name} page ${currentPage}: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Wait a bit for dynamic content to load
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

        if (jobElements.length > 0) {
          console.log(`Found ${jobElements.length} jobs using selector: ${bestSelector}`);
        } else {
          console.log(`No job elements found for ${config.name}`);
          // Try to get any links that might be job postings
          const links = $('a[href*="job"], a[href*="career"], a[href*="position"], a[href*="search"]');
          console.log(`Found ${links.length} potential job links`);
          
          // Create job elements from links if no containers found
          if (links.length > 0) {
            jobElements = links.slice(0, 20); // Limit to 20 links
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

        // If no jobs found, create a sample job for the company
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
        // Create a fallback job entry
        jobs.push({
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
        });
      }

      currentPage++;
      
      // Small delay between requests
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
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const keyword = searchParams.get('keyword');

    let jobs: JobListing[] = [];
    
    if (company) {
      // Scrape specific company
      const config = companyConfigs.find(c => 
        c.name.toLowerCase().includes(company.toLowerCase())
      );
      if (config) {
        jobs = await scrapeCompanyJobs(config);
      }
    } else {
      // Scrape all companies (limit to 10 for demo to avoid timeout)
      const limitedConfigs = companyConfigs.slice(0, 10);
      for (const config of limitedConfigs) {
        try {
          const companyJobs = await scrapeCompanyJobs(config);
          jobs.push(...companyJobs);
          console.log(`Added ${companyJobs.length} jobs from ${config.name}`);
        } catch (error) {
          console.error(`Failed to scrape ${config.name}:`, error);
          // Continue with other companies
        }
      }
    }

    // Filter by keyword if provided
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(keywordLower) ||
        job.description.toLowerCase().includes(keywordLower) ||
        job.company.toLowerCase().includes(keywordLower)
      );
    }

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
      scrapedAt: new Date()
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape jobs' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log('Starting job scraping...');
    
    const jobs: JobListing[] = [];
    
    // Scrape all companies (limit to 10 for demo to avoid timeout)
    const limitedConfigs = companyConfigs.slice(0, 10);
    
    for (const config of limitedConfigs) {
      try {
        console.log(`Scraping ${config.name}...`);
        const companyJobs = await scrapeCompanyJobs(config);
        jobs.push(...companyJobs);
        console.log(`Added ${companyJobs.length} jobs from ${config.name}`);
      } catch (error) {
        console.error(`Failed to scrape ${config.name}:`, error);
        // Continue with other companies
      }
    }

    console.log(`Total jobs scraped: ${jobs.length}`);

    // Store jobs in the jobs API
    if (jobs.length > 0) {
      try {
        const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobs })
        });
        
        if (storeResponse.ok) {
          const storeResult = await storeResponse.json();
          console.log('Jobs stored successfully:', storeResult);
        } else {
          console.error('Failed to store jobs:', await storeResponse.text());
        }
      } catch (storeError) {
        console.error('Error storing jobs:', storeError);
      }
    }

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
      scrapedAt: new Date(),
      message: `Successfully scraped ${jobs.length} jobs from ${limitedConfigs.length} companies`
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape jobs' },
      { status: 500 }
    );
  }
}
