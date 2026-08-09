import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects & Sold Startups | Harsh Srivastava - Enterprise Developer",
  description: "Explore 7+ sold software products, SaaS platforms, and enterprise-grade applications engineered by Harsh Srivastava for major clients.",
  keywords: "Harsh Srivastava projects, sold 7 projects, sold software startups, ClinicOS, MoxSend, EduCore ERP, SDPL Supply Chain, TrekkinGods, Plotify, DeployX, enterprise software developer",
  alternates: {
    canonical: "https://www.harshsrivastava.in/projects",
  },
  openGraph: {
    title: "Projects & Sold Startups | Harsh Srivastava",
    description: "Portfolio of 7+ sold software projects and enterprise client applications built by Harsh Srivastava.",
    url: "https://www.harshsrivastava.in/projects",
    siteName: "Harsh Srivastava",
    images: [{ url: "/profile.jpg", width: 1200, height: 630, alt: "Harsh Srivastava Projects" }],
  },
};

export default function ProjectsPage() {
  const projects = [
    {
      title: "ClinicOS",
      tagline: "AI-Powered Healthcare & Practice Growth Platform",
      status: "Active Enterprise Product",
      description: "AI-powered clinic growth platform with automated WhatsApp receptionists, teleconsultation, patient record management, automated billing, and appointment reminders.",
      tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "WhatsApp API", "OpenAI"],
      img: "/clinicos.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Sold / Enterprise SaaS"
    },
    {
      title: "MoxSend",
      tagline: "Autonomous AI Cold Email Outreach Platform",
      status: "SaaS Engine",
      description: "AI cold email outreach platform featuring inbox warm-up automation, dynamic personalization engines, campaign analytics, and deliverability optimization.",
      tech: ["Next.js", "FastAPI", "Redis", "Docker", "LangChain", "MongoDB"],
      img: "/moxsend.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Sold Startup"
    },
    {
      title: "EduCore ERP",
      tagline: "Multi-Tenant Educational Institution OS",
      status: "Deployed Institution System",
      description: "Multi-tenant school ERP with automated timetable generation, real-time student attendance tracking, online fee gateways, and executive dashboards.",
      tech: ["Next.js", "PostgreSQL", "AWS", "Express.js", "Tailwind CSS"],
      img: "/educore.png",
      demoUrl: "https://www.educorerp.in/",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Enterprise Client System"
    },
    {
      title: "SDPL Supply Chain",
      tagline: "Enterprise Distribution & Logistics System",
      status: "Enterprise Client Delivery",
      description: "Comprehensive supply chain platform moving enterprise distribution firms off legacy spreadsheets onto one live management system.",
      tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      img: "/sdpl.png",
      demoUrl: "https://sdpl.vercel.app/",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Enterprise Client"
    },
    {
      title: "SafeSurf Jr",
      tagline: "AI Cybersecurity & Child Safety Platform",
      status: "Award-Winning Product",
      description: "AI-powered child safety platform catching online threats, cyberbullying, and offensive content before children encounter them.",
      tech: ["React", "Node.js", "Machine Learning", "Cybersecurity", "Python"],
      img: "/safesu.png",
      demoUrl: "https://github.com/Harrsh777/SafeSurfJr",
      githubUrl: "https://github.com/Harrsh777/SafeSurfJr",
      highlight: "Sold / Transferred"
    },
    {
      title: "TrekkinGods",
      tagline: "Travel & Outdoor Booking Engine",
      status: "Client System",
      description: "High-performance trek and travel booking marketplace handling tour discovery, scheduling, and payment confirmation in one unified flow.",
      tech: ["Next.js", "REST APIs", "Payments", "Node.js", "Tailwind CSS"],
      img: "/trek.png",
      demoUrl: "https://trekkingGods.com/",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Client Enterprise"
    },
    {
      title: "Plotify",
      tagline: "Premium Real Estate Marketplace",
      status: "Acquired Platform",
      description: "Interactive real estate property marketplace with immersive listings, map integration, and agent-buyer communication portals.",
      tech: ["Next.js", "Supabase", "Tailwind CSS", "PostgreSQL"],
      img: "/plotify.png",
      demoUrl: "https://www.theplotify.com",
      githubUrl: "https://github.com/Harrsh777",
      highlight: "Sold Venture"
    },
    {
      title: "DeployX",
      tagline: "Automated CI/CD & Deployment Engine",
      status: "DevOps Product",
      description: "Push code and let automated pipelines handle container builds, deployments, zero-downtime rollouts, and server monitoring.",
      tech: ["Docker", "Kubernetes", "Node.js", "AWS", "CI/CD"],
      img: "/deployx.png",
      demoUrl: "https://github.com/Harrsh777/DeployX",
      githubUrl: "https://github.com/Harrsh777/DeployX",
      highlight: "Developer Tool"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between pb-8 border-b border-slate-800">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Main Desktop
          </Link>
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
            <Link href="/projects" className="text-purple-400 font-semibold">Projects</Link>
            <Link href="/services" className="hover:text-purple-400 transition-colors">Services</Link>
            <Link href="/resume" className="hover:text-purple-400 transition-colors">Resume</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
          </nav>
        </header>

        {/* Page Title Section */}
        <section className="py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5" /> Proven Track Record
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            7+ Sold Projects &amp; Enterprise Solutions
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            As a serious software developer and entrepreneur, I design, build, scale, and deliver production-ready applications for clients and market acquisitions. Here is a curated selection of my key systems.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <article key={idx} className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col overflow-hidden group">
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <Image 
                  src={proj.img} 
                  alt={proj.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  {proj.highlight}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{proj.title}</h2>
                  <p className="text-xs text-purple-400 font-medium mb-3">{proj.tagline}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{proj.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tech.map((t, tidx) => (
                      <span key={tidx} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                  <a 
                    href={proj.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View System <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                  <a 
                    href={proj.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-slate-400 hover:text-white"
                  >
                    Source Code <Github className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Harsh Srivastava. All rights reserved.</p>
          <Link href="/contact" className="text-purple-400 hover:underline font-medium">Need a Custom Enterprise Solution?</Link>
        </footer>

      </div>
    </main>
  );
}
