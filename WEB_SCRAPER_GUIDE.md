# 🚀 Web Scraper Setup Guide

## Overview
This web scraper automatically fetches job listings from major tech companies' career pages and provides a responsive search interface.

## Features
- ✅ **Multi-Company Scraping**: Google, Microsoft, Amazon, Meta, Apple
- ✅ **Advanced Search**: Keywords, company, location, job type filters
- ✅ **Responsive UI**: Beautiful, mobile-friendly interface
- ✅ **Real-time Scraping**: On-demand job fetching
- ✅ **Automated Scheduling**: Daily job updates (configurable)
- ✅ **Interactive Dashboard**: Job details, pagination, statistics

## Setup Instructions

### 1. Install Dependencies
```bash
npm install cheerio puppeteer node-cron @types/node-cron
```

### 2. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Run the Application
```bash
npm run dev
```

### 4. Access the Dashboard
Visit: `http://localhost:3000/dashboard`

## How to Use

### Manual Scraping
1. Go to the dashboard
2. Click "Scrape Jobs" button
3. Wait for scraping to complete
4. Browse and filter results

### Search & Filter
- **Keywords**: Search job titles and descriptions
- **Company**: Filter by specific companies
- **Location**: Filter by location (Remote, San Francisco, etc.)
- **Job Type**: Full-time, Part-time, Contract, etc.
- **Quick Tech Tags**: Click popular tech keywords

### Advanced Features
- **Pagination**: Navigate through job listings
- **Job Details**: Click "View Details" for full job information
- **External Links**: Direct links to company career pages
- **Statistics**: Real-time job and company counts

## API Endpoints

### Scrape Jobs
```
GET /api/scrape-jobs?company=Google&keyword=React
POST /api/jobs (store scraped jobs)
GET /api/jobs?keyword=Python&location=Remote&page=1
```

### Daily Automation
```
POST /api/cron/scrape-daily
```

## Configuration

### Adding New Companies
Edit `app/api/scrape-jobs/route.ts`:

```typescript
const companyConfigs: ScrapingConfig[] = [
  {
    name: 'Your Company',
    baseUrl: 'https://careers.yourcompany.com/jobs',
    selectors: {
      jobContainer: '.job-listing',
      title: 'h3 a',
      company: '.company-name',
      location: '.location',
      description: '.job-description',
      url: 'h3 a'
    }
  }
];
```

### Customizing Selectors
Each company needs specific CSS selectors:
- `jobContainer`: Wrapper for each job listing
- `title`: Job title element
- `company`: Company name element
- `location`: Location element
- `description`: Job description
- `url`: Link to job posting

## Production Deployment

### 1. Vercel Deployment
```bash
npm run build
vercel deploy
```

### 2. Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_BASE_URL=https://your-domain.com`
- `NODE_ENV=production`

### 3. Scheduled Scraping
Use Vercel Cron Jobs:
```json
{
  "crons": [
    {
      "path": "/api/cron/scrape-daily",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Scraping Fails**
   - Check if company websites are accessible
   - Verify CSS selectors are correct
   - Check browser console for errors

2. **No Jobs Found**
   - Try different search keywords
   - Check if selectors match current website structure
   - Ensure website allows scraping

3. **Performance Issues**
   - Reduce number of pages scraped
   - Increase delays between requests
   - Use headless browser optimization

### Debug Mode
Enable detailed logging:
```typescript
console.log('Scraping URL:', url);
console.log('Found jobs:', jobs.length);
```

## Best Practices

### Ethical Scraping
- Respect robots.txt files
- Add delays between requests (2-3 seconds)
- Don't overload servers
- Cache results to reduce requests

### Performance Optimization
- Use headless browser efficiently
- Implement proper error handling
- Cache frequently accessed data
- Optimize database queries

### Legal Considerations
- Check website terms of service
- Respect rate limits
- Don't scrape personal data
- Follow data protection laws

## Advanced Features

### Database Integration
Replace in-memory storage with:
- PostgreSQL
- MongoDB
- Supabase
- Firebase

### Real-time Updates
- WebSocket connections
- Server-sent events
- Push notifications

### Analytics
- Track popular keywords
- Monitor scraping success rates
- User engagement metrics

## Support

For issues or questions:
1. Check the console logs
2. Verify API endpoints
3. Test individual components
4. Review error messages

## License

This project is for educational purposes. Please respect website terms of service when scraping.
