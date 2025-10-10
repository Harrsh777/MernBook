#!/usr/bin/env node

/**
 * Simple cron setup for auto-scraping jobs every 180 minutes
 * This script sets up a basic interval-based cron job
 */

const cron = require('node-cron');

// Function to call the scrape API
async function scrapeJobs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/cron/scrape-daily`);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`[${new Date().toISOString()}] Auto-scrape completed:`, result.message);
    } else {
      console.error(`[${new Date().toISOString()}] Auto-scrape failed:`, response.status, response.statusText);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Auto-scrape error:`, error.message);
  }
}

// Schedule job scraping every 180 minutes (3 hours)
// Cron expression: every 180 minutes = 0 */3 * * *
const task = cron.schedule('0 */3 * * *', () => {
  console.log(`[${new Date().toISOString()}] Starting scheduled job scraping...`);
  scrapeJobs();
}, {
  scheduled: false,
  timezone: "UTC"
});

// Start the cron job
console.log('Starting auto-scrape cron job (every 180 minutes)...');
task.start();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\nStopping auto-scrape cron job...');
  task.stop();
  process.exit(0);
});

console.log('Auto-scrape cron job is running. Press Ctrl+C to stop.');
