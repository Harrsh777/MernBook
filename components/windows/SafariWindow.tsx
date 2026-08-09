"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lock,
  Share2,
  Plus,
  ExternalLink,
  BookOpen,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

export default function SafariWindow() {
  const [addressBar, setAddressBar] = useState("harshsrivastava.in/blogs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [history, setHistory] = useState<string[]>(["harshsrivastava.in/blogs"]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const categories = [
    "All",
    "AI & Agents",
    "Backend & DB",
    "Cloud & DevOps",
    "Frontend",
    "Cybersecurity",
    "DevOps",
    "Architecture",
    "Performance",
    "WebRTC",
    "Hackathons",
  ];

  const blogs = [
    {
      id: 1,
      title: "Building Autonomous AI Agents with Next.js 15 & LangChain",
      description:
        "A comprehensive architectural guide on multi-agent orchestrations, function tool calling, long-term vector memory, and real-time streaming UI components in Next.js 15.",
      readTime: "8 min read",
      category: "AI & Agents",
      tags: ["Next.js 15", "LangChain", "OpenAI", "TypeScript"],
      url: "https://nextjs.org/blog/next-15",
      date: "Aug 2025",
    },
    {
      id: 2,
      title: "Scaling PostgreSQL & Redis for High-Throughput Microservices",
      description:
        "Sub-10ms query optimization, connection pooling with PgBouncer, and distributed caching strategies in Node.js and FastAPI microservices.",
      readTime: "10 min read",
      category: "Backend & DB",
      tags: ["PostgreSQL", "Redis", "Node.js", "FastAPI"],
      url: "https://redis.io/docs/latest/develop/use/patterns/",
      date: "Jul 2025",
    },
    {
      id: 3,
      title: "AWS Architecture Patterns for Full-Stack Engineering Leads",
      description:
        "Comparing serverless AWS Lambda setups against containerized ECS Fargate deployments, complete with Infrastructure as Code (Terraform) and GitHub Actions CI/CD.",
      readTime: "12 min read",
      category: "Cloud & DevOps",
      tags: ["AWS", "Docker", "ECS", "Terraform"],
      url: "https://aws.amazon.com/architecture/",
      date: "Jun 2025",
    },
    {
      id: 4,
      title: "The Evolution of Modern React 19 Server Components",
      description:
        "Deep dive into React Server Components (RSC), server actions, streaming SSR, and zero-bundle-size client component boundaries for enterprise web apps.",
      readTime: "7 min read",
      category: "Frontend",
      tags: ["React 19", "Next.js", "RSC", "Performance"],
      url: "https://react.dev/blog/2024/04/25/react-19",
      date: "May 2025",
    },
    {
      id: 5,
      title: "Zero-Trust Security & Forensics in Enterprise Node.js Apps",
      description:
        "OWASP top 10 mitigation strategies, JWT security, rate-limiting algorithms, and automated vulnerability scanning inspired by active cybercrime unit tooling.",
      readTime: "9 min read",
      category: "Cybersecurity",
      tags: ["Security", "Node.js", "OWASP", "OAuth 2.0"],
      url: "https://owasp.org/www-project-top-ten/",
      date: "Apr 2025",
    },
    {
      id: 6,
      title: "Docker & Kubernetes Deployment Runbook for Startups",
      description:
        "From local multi-container Docker Compose environments to production Kubernetes ingress controllers, SSL certificates, and autoscaling policies.",
      readTime: "11 min read",
      category: "DevOps",
      tags: ["Docker", "Kubernetes", "DevOps", "Nginx"],
      url: "https://kubernetes.io/docs/tutorials/",
      date: "Mar 2025",
    },
    {
      id: 7,
      title: "Designing Multi-Tenant SaaS Systems with Row-Level Security",
      description:
        "Isolating customer data using PostgreSQL RLS policies, tenant identifier middleware, and multi-tenant database connection management.",
      readTime: "8 min read",
      category: "Architecture",
      tags: ["SaaS", "PostgreSQL", "RLS", "System Design"],
      url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
      date: "Feb 2025",
    },
    {
      id: 8,
      title: "Optimizing Web Vitals: Achieving 100/100 Lighthouse Scores",
      description:
        "Practical image compression techniques, font subsetting, CSS critical path extraction, and dynamic module loading for sub-second page loads.",
      readTime: "6 min read",
      category: "Performance",
      tags: ["Performance", "Lighthouse", "Web Vitals", "UX"],
      url: "https://web.dev/vitals/",
      date: "Jan 2025",
    },
    {
      id: 9,
      title: "Building Real-Time Chat & Teleconsultation with WebRTC",
      description:
        "Peer-to-peer audio/video connection negotiation, STUN/TURN server configurations, and WebSocket signaling server architecture.",
      readTime: "10 min read",
      category: "WebRTC",
      tags: ["WebRTC", "WebSockets", "Node.js", "Real-Time"],
      url: "https://webrtc.org/getting-started/overview",
      date: "Dec 2024",
    },
    {
      id: 10,
      title: "Lessons Learned Winning 5+ National Level Hackathons",
      description:
        "Key takeaways on rapid prototyping under 24 hours, pitch presentation storytelling, effective team role allocation, and MVP execution strategy.",
      readTime: "7 min read",
      category: "Hackathons",
      tags: ["Hackathons", "Prototyping", "MVP", "Storytelling"],
      url: "https://devpost.com/hackathons",
      date: "Nov 2024",
    },
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = addressBar.replace(/https?:\/\//, "").replace("harshsrivastava.in/blogs", "").replace("/", "").trim();
    setSearchQuery(query);

    const newUrl = addressBar.startsWith("https://") ? addressBar : `https://${addressBar}`;
    if (history[historyIdx] !== newUrl) {
      const updated = [...history.slice(0, historyIdx + 1), newUrl];
      setHistory(updated);
      setHistoryIdx(updated.length - 1);
    }
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      const prev = historyIdx - 1;
      setHistoryIdx(prev);
      setAddressBar(history[prev]);
      setSearchQuery("");
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      const next = historyIdx + 1;
      setHistoryIdx(next);
      setAddressBar(history[next]);
    }
  };

  const handleRefresh = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setAddressBar("harshsrivastava.in/blogs");
  };

  return (
    <div className="h-full w-full bg-transparent text-white flex flex-col select-none overflow-hidden font-sans">
      {/* macOS Safari Browser Toolbar */}
      <div className="h-11 bg-white/10 border-b border-white/10 px-4 flex items-center justify-between gap-3 text-white/80 backdrop-blur-xl shrink-0">
        {/* Nav Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            disabled={historyIdx === 0}
            aria-label="Back"
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIdx >= history.length - 1}
            aria-label="Forward"
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            aria-label="Refresh"
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar Form */}
        <form onSubmit={handleAddressSubmit} className="flex-1 max-w-xl">
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-white/90 shadow-inner">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={addressBar}
              onChange={(e) => {
                setAddressBar(e.target.value);
                setSearchQuery(e.target.value.replace(/https?:\/\//, "").replace("harshsrivastava.in/blogs", "").replace("/", "").trim());
              }}
              placeholder="Search or type URL..."
              className="w-full bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
            />
            <Search className="w-3 h-3 text-white/40 shrink-0" />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button aria-label="Share" className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button aria-label="New Tab" onClick={handleRefresh} className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safari Page Content */}
      <div className="flex-1 bg-transparent p-6 md:p-8 overflow-y-auto select-text backdrop-blur-2xl">
        {/* Page Header */}
        <div className="mb-6 pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-sky-300" />
              <span>Top 10 AI & Fullstack Engineering Articles</span>
            </h1>
            <p className="text-xs text-white/70 mt-1">
              Curated architecture breakdowns, AI agent guides, and systems performance specs by Harsh Srivastava
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 font-medium self-start md:self-auto shrink-0">
            Showing {filteredBlogs.length} of {blogs.length} Articles
          </span>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <Filter className="w-4 h-4 text-white/50 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-sky-500 text-white shadow-md border border-sky-400"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-white/50 text-xs apple-glass-card rounded-2xl">
            No articles found matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try clearing filters or searching for another keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((b) => (
              <div
                key={b.id}
                className="apple-glass-card rounded-2xl p-5 hover:border-white/35 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  {/* Meta header */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-sky-300 font-semibold text-[11px] border border-white/10">
                      {b.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{b.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2">
                    {b.title}
                  </h2>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">{b.description}</p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {b.tags.map((t, tid) => (
                      <span
                        key={tid}
                        onClick={() => setSearchQuery(t)}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white/90 px-2 py-0.5 rounded border border-white/10 font-medium cursor-pointer transition-colors"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50">{b.date}</span>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-white transition-colors"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
