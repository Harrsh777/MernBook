import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Briefcase, CheckCircle, Rocket, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Harsh Srivastava | Serious Developer & Entrepreneur",
  description: "Learn about Harsh Srivastava — Serious Software Developer, Tech Entrepreneur who built & sold 7+ software projects, AWS Certified Solutions Architect, and developer of enterprise-grade software solutions for major clients.",
  keywords: "Harsh Srivastava, Harsh Srivastava about, Harsh Srivastava entrepreneur, Harsh Srivastava developer, sold 7 projects, enterprise software developer, AWS Certified Solutions Architect",
  alternates: {
    canonical: "https://www.harshsrivastava.in/about",
  },
  openGraph: {
    title: "About Harsh Srivastava | Serious Developer & Entrepreneur",
    description: "Serious Software Developer & Entrepreneur who has built and sold over 7 software projects and crafts enterprise-level software solutions for big clients.",
    url: "https://www.harshsrivastava.in/about",
    siteName: "Harsh Srivastava",
    images: [{ url: "/profile.jpg", width: 1200, height: 630, alt: "Harsh Srivastava" }],
  },
};

export default function AboutPage() {
  const highlights = [
    {
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      title: "7+ Projects Built & Sold",
      description: "Successfully built, scaled, and transferred multiple SaaS products and specialized technical tools to active users and buyers."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      title: "Enterprise Client Solutions",
      description: "Engineered robust web applications, logistics platforms, and custom ERPs for enterprise-level clients, moving businesses off legacy infrastructure."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "AWS Certified Solutions Architect",
      description: "Proven expertise in designing highly available, fault-tolerant, microservices, and cost-optimized cloud architectures."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Google Summer of Code '24 & 5× Hackathon Winner",
      description: "Recognized nationally and globally for speed, code craftsmanship, and innovative AI/systems design under strict timelines."
    }
  ];

  const enterpriseProjects = [
    { name: "ClinicOS", category: "AI Healthcare & Growth Platform", status: "Active Product" },
    { name: "MoxSend", category: "Autonomous Cold Outreach Engine", status: "SaaS Platform" },
    { name: "EduCore ERP", category: "Multi-Tenant Educational OS", status: "Deployed Enterprise System" },
    { name: "SDPL Supply Chain", category: "Enterprise Logistics Management", status: "Client Enterprise Delivery" },
    { name: "Plotify", category: "Interactive Real Estate Portal", status: "Acquired / Deployed" },
    { name: "TrekkinGods", category: "High-Load Tour Booking Platform", status: "Client System" },
    { name: "SafeSurf Jr", category: "AI Cybersecurity & Threat Defense", status: "Award-Winning AI Engine" }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between pb-8 border-b border-slate-800">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Main Desktop
          </Link>
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            <Link href="/about" className="text-purple-400 font-semibold">About</Link>
            <Link href="/projects" className="hover:text-purple-400 transition-colors">Projects</Link>
            <Link href="/services" className="hover:text-purple-400 transition-colors">Services</Link>
            <Link href="/resume" className="hover:text-purple-400 transition-colors">Resume</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> Serious Software Developer & Entrepreneur
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Building Scalable Software &amp; Selling Startups that Deliver Real Business Impact
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              I am <strong className="text-white font-semibold">Harsh Srivastava</strong>, a software developer, entrepreneur, and AWS Certified Solutions Architect. Over the years, I have built and sold <strong className="text-purple-400">7+ software projects</strong> and designed custom, mission-critical systems for big enterprise clients.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/projects" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-600/30 transition-all">
                Explore Sold &amp; Enterprise Projects
              </Link>
              <Link href="/contact" className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all">
                Hire for Enterprise Work
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <Image 
                src="/profile.jpg" 
                alt="Harsh Srivastava - Serious Software Developer & Entrepreneur" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-10 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-8">Key Accomplishments &amp; Value Proposition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Track Record (Sold & Enterprise) */}
        <section className="py-10 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-3">Enterprise Systems &amp; Sold Ventures</h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            A glimpse into the systems I have engineered for corporate clients, medical institutions, multi-tenant businesses, and SaaS platforms that have been successfully deployed or sold.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enterpriseProjects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base">{proj.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{proj.category}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-xs text-purple-400">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Enterprise Standard
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Mastery */}
        <section className="py-10 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">Technical Architecture &amp; Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-purple-400 mb-2">Frontend</h3>
              <p className="text-slate-300 text-xs">Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-blue-400 mb-2">Backend &amp; APIs</h3>
              <p className="text-slate-300 text-xs">Node.js, Express, Spring Boot, REST APIs, Microservices, Python</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-emerald-400 mb-2">Cloud &amp; DevOps</h3>
              <p className="text-slate-300 text-xs">AWS Certified, Docker, Kubernetes, CI/CD Pipelines, Nginx</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="font-semibold text-amber-400 mb-2">Databases &amp; AI</h3>
              <p className="text-slate-300 text-xs">PostgreSQL, MongoDB, Redis, Supabase, OpenAI, LangChain</p>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Harsh Srivastava. Serious Software Developer &amp; Entrepreneur.</p>
          <div className="flex gap-4">
            <a href="https://github.com/Harrsh777" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">GitHub</a>
            <a href="https://www.linkedin.com/in/harrshh/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">LinkedIn</a>
            <a href="https://twitter.com/harrshh" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">Twitter</a>
          </div>
        </footer>

      </div>
    </main>
  );
}
