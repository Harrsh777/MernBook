"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaClock, 
  FaExternalLinkAlt,
  FaFilter,
  FaSync,
  FaDownload,
  FaStar,
  FaCode,
  FaDatabase,
  FaCloud,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';

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
  is_liked?: boolean;
  liked_at?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function JobDashboard() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    company: '',
    location: '',
    type: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());
  const [autoScraping, setAutoScraping] = useState(false);
  const [lastScraped, setLastScraped] = useState<Date | null>(null);

  // Popular companies for quick selection
  const popularCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Uber'
  ];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'
  ];

  const techKeywords = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'
  ];

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchFilters]);

  useEffect(() => {
    // Initialize liked jobs from the fetched jobs
    const likedSet = new Set(jobs.filter(job => job.is_liked).map(job => job.id));
    setLikedJobs(likedSet);
  }, [jobs]);

  // Auto-scrape every 180 minutes (3 hours)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-scraping jobs (every 180 minutes)...');
      setAutoScraping(true);
      scrapeJobs().finally(() => {
        setAutoScraping(false);
        setLastScraped(new Date());
      });
    }, 180 * 60 * 1000); // 180 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  // Initial auto-scrape on page load (after 5 seconds to let page load)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Initial auto-scrape starting...');
      setAutoScraping(true);
      scrapeJobs().finally(() => {
        setAutoScraping(false);
        setLastScraped(new Date());
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, value]) => value.trim())
        )
      });

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrapeJobs = async (company?: string) => {
    setScraping(true);
    try {
      // Use the streaming endpoint for real-time updates
      const response = await fetch('/api/scrape-jobs/stream');
      
      if (!response.ok) {
        throw new Error('Failed to start scraping');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'start':
                  console.log('Scraping started:', data.data.message);
                  break;
                  
                case 'company_start':
                  console.log(`Starting ${data.data.company}...`);
                  break;
                  
                case 'company_page':
                  console.log(`Scraping ${data.data.company} page ${data.data.page}`);
                  break;
                  
                case 'company_found':
                  console.log(`Found ${data.data.found} jobs for ${data.data.company}`);
                  break;
                  
                case 'job_found':
                  // Add job to the list immediately
                  setJobs(prev => {
                    const updated = [...prev, data.data];
                    // Sort by scraped_at (newest first)
                    return updated.sort((a, b) => 
                      new Date(b.scraped_at || b.scrapedAt).getTime() - 
                      new Date(a.scraped_at || a.scrapedAt).getTime()
                    );
                  });
                  break;
                  
                case 'company_page_complete':
                  console.log(`Completed ${data.data.company} page ${data.data.page}: ${data.data.jobsFound} jobs`);
                  break;
                  
                case 'company_complete':
                  console.log(`Completed ${data.data.company}: ${data.data.totalJobs} jobs`);
                  break;
                  
                case 'jobs_stored':
                  console.log(`Stored ${data.data.stored} jobs in database`);
                  break;
                  
                case 'complete':
                  console.log(`Scraping complete: ${data.data.totalJobs} total jobs from ${data.data.companies} companies`);
                  break;
                  
                case 'error':
                  console.error('Scraping error:', data.data.error);
                  break;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }

      // Final refresh to get all jobs
      await fetchJobs();
      
    } catch (error) {
      console.error('Error scraping jobs:', error);
    } finally {
      setScraping(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchFilters({ keyword: '', company: '', location: '', type: '' });
    setCurrentPage(1);
  };

  const getCompanyIcon = (company: string) => {
    const companyLower = company.toLowerCase();
    if (companyLower.includes('google')) return <FaCode className="text-blue-500" />;
    if (companyLower.includes('microsoft')) return <FaDatabase className="text-blue-600" />;
    if (companyLower.includes('amazon')) return <FaCloud className="text-orange-500" />;
    return <FaBuilding className="text-gray-500" />;
  };

  const toggleLikeJob = async (jobId: string) => {
    try {
      const isLiked = likedJobs.has(jobId);
      
      if (isLiked) {
        // Unlike job
        const response = await fetch(`/api/liked-jobs?jobId=${jobId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setLikedJobs(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
        }
      } else {
        // Like job
        const response = await fetch('/api/liked-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId })
        });
        
        if (response.ok) {
          setLikedJobs(prev => new Set([...prev, jobId]));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🚀 Job Scraper Dashboard
            </motion.h1>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => scrapeJobs()}
                      disabled={scraping || autoScraping}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <FaSync className={scraping || autoScraping ? 'animate-spin' : ''} />
                      {scraping ? 'Scraping...' : autoScraping ? 'Auto-Scraping...' : 'Scrape Jobs'}
                    </button>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaFilter />
                      Filters
                    </button>

                    {/* Auto-scrape status */}
                    {(autoScraping || lastScraped) && (
                      <div className="flex items-center gap-2 text-sm">
                        {autoScraping && (
                          <span className="flex items-center gap-1 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Auto-scraping...
                          </span>
                        )}
                        {lastScraped && !autoScraping && (
                          <span className="text-gray-400">
                            Last scraped: {lastScraped.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Search & Filters</h3>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Keywords
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="React, Python, AWS..."
                    className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Company Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <select
                  value={searchFilters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Companies</option>
                  {popularCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="San Francisco, Remote..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Type
                </label>
                <select
                  value={searchFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Quick Tech Keywords */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quick Tech Search
                </label>
                <div className="flex flex-wrap gap-2">
                  {techKeywords.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => handleFilterChange('keyword', keyword)}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Jobs</p>
                    <p className="text-white text-2xl font-bold">{pagination?.total || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <FaClock className="text-green-500 text-xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Last Updated</p>
                    <p className="text-white text-sm">
                      {jobs.length > 0 ? new Date(jobs[0].scraped_at).toLocaleTimeString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-500 text-xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Companies</p>
                    <p className="text-white text-2xl font-bold">
                      {new Set(jobs.map(job => job.company)).size}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Job Cards */}
            <AnimatePresence>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getCompanyIcon(job.company)}
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-gray-400 text-sm">{job.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLikeJob(job.id)}
                            className={`p-2 transition-colors ${
                              likedJobs.has(job.id) 
                                ? 'text-red-500 hover:text-red-400' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            {likedJobs.has(job.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          <button
                            onClick={() => window.open(job.url, '_blank')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <FaExternalLinkAlt />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {job.location}
                        </div>
                        {job.posted_date && (
                          <div className="flex items-center gap-1">
                            <FaClock />
                            {job.posted_date}
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {job.job_type && (
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                              {job.job_type}
                            </span>
                          )}
                          {job.experience_level && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                              {job.experience_level}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <FaSearch className="text-gray-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-gray-400 text-lg mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or scrape new jobs</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {getCompanyIcon(selectedJob.company)}
                  <div>
                    <p className="text-white font-semibold">{selectedJob.company}</p>
                    <p className="text-gray-400">{selectedJob.location}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedJob.job_type && (
                    <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-full">
                      {selectedJob.job_type}
                    </span>
                  )}
                  {selectedJob.experience_level && (
                    <span className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-full">
                      {selectedJob.experience_level}
                    </span>
                  )}
                  {selectedJob.salary && (
                    <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-full">
                      {selectedJob.salary}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.open(selectedJob.url, '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
                  >
                    <FaExternalLinkAlt />
                    Apply Now
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedJob.url);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaDownload />
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
