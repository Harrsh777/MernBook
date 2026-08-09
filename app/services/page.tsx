import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Code2, Cpu, Globe2, Layers, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise Services & Consulting | Harsh Srivastava",
  description: "Enterprise software engineering, SaaS product development, AI engine integration, microservices architecture, and cloud infrastructure consulting by Harsh Srivastava.",
  keywords: "Harsh Srivastava services, enterprise software development, SaaS development, AI engine development, AWS cloud consultant, microservices developer",
  alternates: {
    canonical: "https://www.harshsrivastava.in/services",
  },
  openGraph: {
    title: "Enterprise Services & Consulting | Harsh Srivastava",
    description: "Custom software engineering and enterprise architecture services by Harsh Srivastava.",
    url: "https://www.harshsrivastava.in/services",
    siteName: "Harsh Srivastava",
    images: [{ url: "/profile.jpg", width: 1200, height: 630, alt: "Harsh Srivastava Enterprise Services" }],
  },
};

export default function ServicesPage() {
  const services = [
    {
      icon: <Code2 className="w-8 h-8 text-purple-400" />,
      title: "Custom Enterprise SaaS Development",
      description: "End-to-end engineering of scalable web applications, multi-tenant portals, and specialized enterprise platforms built with Next.js, React, Node.js, and PostgreSQL."
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      title: "AI Engine & Automation Systems",
      description: "Custom integration of LLMs, intelligent agents, WhatsApp automation, cold email engines, and real-time processing pipelines to automate business workflows."
    },
    {
      icon: <Globe2 className="w-8 h-8 text-emerald-400" />,
      title: "AWS Cloud Infrastructure & DevOps",
      description: "Production-grade cloud architecture design by an AWS Certified Solutions Architect. Docker containerization, Kubernetes orchestration, zero-downtime CI/CD."
    },
    {
      icon: <Layers className="w-8 h-8 text-amber-400" />,
      title: "Microservices & API Architecture",
      description: "Designing resilient RESTful & gRPC APIs, distributed backend microservices in Spring Boot and Express, and high-performance database indexing."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between pb-8 border-b border-slate-800">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Main Desktop
          </Link>
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
            <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
            <Link href="/projects" className="hover:text-purple-400 transition-colors">Projects</Link>
            <Link href="/services" className="text-purple-400 font-semibold">Services</Link>
            <Link href="/resume" className="hover:text-purple-400 transition-colors">Resume</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
          </nav>
        </header>

        {/* Page Title */}
        <section className="py-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> High-Impact Engineering
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Enterprise Client Services &amp; Systems Architecture
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Partner with a serious software developer and entrepreneur who understands both deep technical execution and commercial business goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-600/30 transition-all">
              Request Project Proposal
            </Link>
            <Link href="/book" className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all">
              Book Technical Consultation
            </Link>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className="p-8 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="mb-6">{svc.icon}</div>
                <h2 className="text-xl font-bold text-white mb-3">{svc.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{svc.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center text-xs text-purple-400 font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Enterprise Quality Guarantee
              </div>
            </div>
          ))}
        </section>

        {/* Engagement Model */}
        <section className="py-12 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How We Work Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-3xl font-black text-purple-400 mb-2 block">01</span>
              <h3 className="font-bold text-white mb-2">Discovery &amp; System Specs</h3>
              <p className="text-xs text-slate-400">Deep dive into enterprise requirements, data schemas, security standards, and operational flow.</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-3xl font-black text-blue-400 mb-2 block">02</span>
              <h3 className="font-bold text-white mb-2">Agile Engineering &amp; Sprints</h3>
              <p className="text-xs text-slate-400">Rapid development with staging builds, automated tests, and clear milestone progress updates.</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-3xl font-black text-emerald-400 mb-2 block">03</span>
              <h3 className="font-bold text-white mb-2">Cloud Deployment &amp; Handoff</h3>
              <p className="text-xs text-slate-400">AWS infrastructure provisioning, zero-downtime launch, monitoring setup, and full documentation.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Harsh Srivastava. Enterprise Consultancy.</p>
          <Link href="/contact" className="text-purple-400 hover:underline">Get in Touch →</Link>
        </footer>

      </div>
    </main>
  );
}
