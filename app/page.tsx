// app/page.tsx
"use client"

import type { Metadata } from 'next';

// NEW: Import hooks and particle engine dependencies
import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
 // Make sure you have particles.ts in the same directory or adjust path

import { Inter, Space_Grotesk } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { FaEnvelope, FaDownload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import SocialCarousel from './components/SocialCarousel';
import ExperienceTimeline from './components/experience';
import PortfolioGrid from './components/PortfolioGrid';
import LeetCodeDashboard from './components/dsa';
import CertificationsCarousel from './components/certification';
import TestimonialFooter from './components/footer';
import Skills from './components/Skills';
import { particlesOptions } from './particles-config';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();

    // NEW: State to manage particle engine initialization
    const [init, setInit] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // SEO Structured Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Harsh Srivastava",
        "jobTitle": "AWS Certified Solutions Architect",
        "description": "Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, Jenkins, Git, System Design. Cyber Security Intern at MP Police, Full Stack Developer at BUILD AI ENGINE.",
        "url": "https://www.harshsrivastava.in/",
        "image": "https://www.harshsrivastava.in/profile.jpg",
        "sameAs": [
            "https://github.com/Harrsh777",
            "https://www.linkedin.com/in/harrshh/",
            "https://twitter.com/harrshh"
        ],
        "worksFor": [
            {
                "@type": "Organization",
                "name": "MP Police",
                "jobTitle": "Cyber Security Intern"
            },
            {
                "@type": "Organization", 
                "name": "BUILD AI ENGINE",
                "jobTitle": "Full Stack Developer Intern"
            },
            {
                "@type": "Organization",
                "name": "MyTripGoal",
                "jobTitle": "Software Engineer Intern"
            }
        ],
        "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "VIT (Vellore Institute of Technology)"
        },
        "award": [
            "5× Hackathon Winner",
            "AWS Certified Solutions Architect",
            "Certified Kubernetes Administrator",
            "GSoC 2024 Participant"
        ],
        "knowsAbout": [
            "MERN Stack",
            "TypeScript", 
            "Spring Boot",
            "REST APIs",
            "Microservices",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Jenkins",
            "Git",
            "System Design",
            "Cyber Security",
            "AI/ML",
            "DevOps",
            "JavaScript",
            "React",
            "Node.js",
            "MongoDB",
            "MySQL",
            "PostgreSQL"
        ],
        "hasOccupation": {
            "@type": "Occupation",
            "name": "Full-Stack Developer",
            "occupationLocation": {
                "@type": "Country",
                "name": "India"
            }
        },
        "birthPlace": {
            "@type": "Place",
            "name": "India"
        },
        "nationality": "Indian",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "India"
        },
        "hasCredential": [
            {
                "@type": "EducationalOccupationalCredential",
                "name": "AWS Certified Solutions Architect",
                "credentialCategory": "Professional Certification"
            },
            {
                "@type": "EducationalOccupationalCredential", 
                "name": "Certified Kubernetes Administrator",
                "credentialCategory": "Professional Certification"
            }
        ]
    };

    // NEW: useEffect to initialize the particles engine on component mount
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // NEW: Define the height for the particle banner. You can change this value.
    const particleBannerHeight = '23cm'

    const handleScroll = (distance: number) => {
        if (typeof window !== 'undefined') {
            window.scrollBy({
                top: distance,
                behavior: 'smooth'
            });
        }
    };

    const handleDownloadCV = () => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            const cvUrl = '/Harsh_Resume.pdf';
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = 'Harsh_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const backgroundTextVariants = {
        animate: {
            x: [0, -100, 0, 100, 0],
            y: [0, 50, 0, -50, 0],
            transition: {
                duration: 30,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <>
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden relative ${inter.className}`}>
            
            {/* Enhanced Particle Banner Container with Glassmorphism */}
            {init && (
                 <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: particleBannerHeight,
                    pointerEvents: 'none',
                    zIndex: 0
                 }}>
                    <Particles
                        id="tsparticles"
                        options={particlesOptions}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/20" />
                </div>
            )}
            
            {/* Animated background text */}
            <motion.div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                variants={backgroundTextVariants}
                animate="animate"
            >
                {[
                    { fontSize: 4.2, left: 15, top: 20, rotate: 45 },
                    { fontSize: 6.1, left: 85, top: 30, rotate: 120 },
                    { fontSize: 3.8, left: 25, top: 60, rotate: 200 },
                    { fontSize: 5.5, left: 70, top: 15, rotate: 300 },
                    { fontSize: 4.7, left: 40, top: 80, rotate: 150 },
                    { fontSize: 6.3, left: 90, top: 70, rotate: 80 },
                    { fontSize: 3.9, left: 10, top: 40, rotate: 250 },
                    { fontSize: 5.2, left: 60, top: 50, rotate: 180 },
                    { fontSize: 4.8, left: 35, top: 25, rotate: 90 },
                    { fontSize: 6.0, left: 80, top: 85, rotate: 320 },
                    { fontSize: 3.6, left: 5, top: 75, rotate: 60 },
                    { fontSize: 5.8, left: 95, top: 45, rotate: 140 },
                    { fontSize: 4.1, left: 50, top: 10, rotate: 220 },
                    { fontSize: 6.5, left: 20, top: 90, rotate: 350 },
                    { fontSize: 3.7, left: 75, top: 35, rotate: 110 },
                    { fontSize: 5.4, left: 45, top: 65, rotate: 280 },
                    { fontSize: 4.9, left: 65, top: 5, rotate: 30 },
                    { fontSize: 6.2, left: 30, top: 55, rotate: 160 },
                    { fontSize: 3.5, left: 55, top: 95, rotate: 40 },
                    { fontSize: 5.7, left: 12, top: 12, rotate: 270 }
                ].map((item, i) => (
                    <motion.span
                        key={i}
                        className={`absolute text-white opacity-5 blur-md ${spaceGrotesk.className}`}
                        style={{
                            fontSize: `${item.fontSize}rem`,
                            left: `${item.left}%`,
                            top: `${item.top}%`,
                            rotate: `${item.rotate}deg`,
                        }}
                    >
                        HARSH
                    </motion.span>
                ))}
            </motion.div>

            {/* Enhanced Navbar with Glassmorphism */}
            <motion.nav 
                className="container mx-auto px-4 py-3 flex justify-between items-center relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div 
                    className={`text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent ${spaceGrotesk.className}`}
                    whileHover={{ scale: 1.05 }}
                >
                    Harsh
                </motion.div>
                <div className="hidden md:flex space-x-6 items-center">
                    {[
                        { name: 'About', action: () => handleScroll(400), icon: '👨‍💻', href: '#about' },
                        { name: 'Projects', action: () => handleScroll(1800), icon: '💼', href: '#projects' },
                        { name: 'Skills', action: () => handleScroll(2500), icon: '⚡', href: '#skills' },
                        { name: 'Certifications', action: () => handleScroll(4700), icon: '🏆', href: '#certifications' },
                        
                        { name: 'Book', action: () => router.push('/book'), icon: '📚', href: '/book' },
                        
                    ].map((item) => (
                        <motion.a
                            key={item.name}
                            href={item.href}
                            onClick={item.action}
                            className="text-gray-300 hover:text-white transition-all duration-300 relative group flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/10 text-sm"
                            whileHover={{ y: -2, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-sm">{item.icon}</span>
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <motion.a
                        href="mailto:Harrshh077@gmail.com"
                        className="hidden md:flex items-center gap-1 bg-gradient-to-r from-white to-gray-100 text-black px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaEnvelope className="text-red-500" />
                        <span className="font-medium">Harrshh077@gmail.com</span>
                    </motion.a>
                    
                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </motion.button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50"
                    >
                        <div className="container mx-auto px-6 py-4 space-y-4">
                            {[
                                { name: 'Resume', action: () => { router.push('/resume'); setIsMobileMenuOpen(false); }, icon: '📄' },
                                { name: 'Job Scraper', action: () => { router.push('/dashboard'); setIsMobileMenuOpen(false); }, icon: '🚀' },
                                { name: 'Projects', action: () => { handleScroll(1800); setIsMobileMenuOpen(false); }, icon: '💼' },
                                { name: 'Skills', action: () => { handleScroll(2500); setIsMobileMenuOpen(false); }, icon: '⚡' },
                                { name: 'Certifications', action: () => { handleScroll(4700); setIsMobileMenuOpen(false); }, icon: '🏆' },
                                { name: 'Book', action: () => { router.push('/book'); setIsMobileMenuOpen(false); }, icon: '📚' },
                                { name: 'Contact', action: () => { router.push('/contact'); setIsMobileMenuOpen(false); }, icon: '📧' }
                            ].map((item, index) => (
                                <motion.button
                                    key={item.name}
                                    onClick={item.action}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.name}
                                </motion.button>
                            ))}
                            <motion.a
                                href="mailto:Harrshh077@gmail.com"
                                className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 text-black px-4 py-3 rounded-lg font-medium mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <FaEnvelope className="text-red-500" />
                                Harrshh077@gmail.com
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Main content with modern design */}
            <main className="container mx-auto px-4 py-12 md:py-16 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Enhanced Text Section */}
                  <motion.div 
                    className="w-full lg:w-1/2 mb-6 lg:mb-0 px-4 sm:px-0"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-green-300 text-xs font-medium mb-4"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Available for new opportunities
                  </motion.div>

                  <motion.h1 
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-center lg:text-left mb-4 ${spaceGrotesk.className}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      Full-Stack
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Developer
                    </span>
                    <br />
                    
                  </motion.h1>

                  <motion.h1 
                    className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl text-center lg:text-left mb-8 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Hi, I&apos;m <span className="text-yellow-400 font-semibold">Harsh Srivastava</span>, an <span className="text-orange-400 font-semibold">AWS Certified Solutions Architect</span> and passionate developer specializing in 
                    <span className="text-blue-400 font-semibold"> AI/ML integration</span>, 
                    <span className="text-purple-400 font-semibold"> full-stack development</span>, 
                    <span className="text-green-400 font-semibold"> MLOps</span>, and 
                    <span className="text-cyan-400 font-semibold"> scalable cloud solutions</span>. 
                    <span className="text-indigo-400 font-semibold"> Certified Kubernetes Administrator</span>, 
 5× Hackathon Winner, published author, and AI enthusiast building the future of web applications.
                  </motion.h1> 

                  {/* Enhanced CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8"
                  >
                    <motion.button
                      onClick={handleDownloadCV}
                      className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center gap-2 relative z-10">
                        <FaDownload className="text-base" />
                        Download CV
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => router.push('/contact')}
                      className="group px-6 py-3 border-2 border-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full font-semibold text-base hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>📧</span>
                        Let&apos;s Connect
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                  </motion.div>

                  {/* Tech Stack Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex flex-wrap items-center gap-2 text-xs text-gray-400"
                  >
                    <span className="text-gray-500">Tech Stack:</span>
                    {['React', 'Next.js', 'Python', 'TensorFlow', 'OpenAI', 'AWS'].map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="px-2 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 text-xs"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Enhanced Image Section with 3D Effects */}
                <motion.div 
                  className="w-full lg:w-1/2 mt-4 lg:mt-0 relative flex justify-center px-4 sm:px-0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="relative group">
                    {/* Main Image Container with Glassmorphism */}
                    <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] md:w-[360px] md:h-[450px] lg:w-[400px] lg:h-[500px] xl:w-[12cm] xl:h-[14cm] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                      <Image
                        src="/profile.jpg"
                        alt="Harsh - AI/ML Developer"
                        fill
                        className="object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Floating Tech Icons */}
                  
                    </div>

                    {/* Enhanced Floating Elements with AI Theme */}
                    <motion.div 
                      className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 blur-xl"
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 blur-xl"
                      animate={{ 
                        scale: [1, 1.4, 1], 
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [360, 180, 0]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.div 
                      className="absolute top-1/2 -left-8 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-25 blur-lg"
                      animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.25, 0.4, 0.25],
                        y: [-10, 10, -10]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />

                    {/* AI/ML Badge */}
                    <motion.div
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                    >
                      Software Developer
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </main>



            {/* Social Media Carousel */}
            <motion.div 
                className="relative z-10 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <SocialCarousel />
            </motion.div>
            
            <section id="about">
                <ExperienceTimeline/>
            </section>
            
            <section id="projects">
                <PortfolioGrid/>
            </section>
            
            <section id="skills">
                <Skills />
                <LeetCodeDashboard/>
            </section>
            
            <section id="certifications">
                <CertificationsCarousel/>
            </section>
            
            <div className="container mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    {/* Text Content */}
                    <motion.div 
                        className="max-w-xl text-white"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                            Get Your Copy of &quot;Master MERN to Crack FAANG&quot;
                        </h2>
                        <p className="text-lg text-purple-100 mb-8">
                            Learn how to build full-stack apps using the MERN stack with real-world projects.
                            Start your journey from zero to FAANG-ready with this beginner-friendly guide.
                        </p>
                        <motion.button 
                            onClick={() => router.push('/payment')}
                            className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-4 rounded-lg text-lg"
                            whileHover={{ 
                                y: -3,
                                boxShadow: "0 10px 25px rgba(234, 179, 8, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">Order Now - Limited Time Offer</span>
                            <motion.span 
                                className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-700 opacity-0 hover:opacity-100 transition-opacity"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.button>
                    </motion.div>
    
                    {/* Book Image with 3D Effect */}
                    <motion.div
                        className="relative w-64 md:w-80"
                        initial={{ opacity: 0, x: 30, rotateY: 60 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 15 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        whileHover={{
                            y: -10,
                            rotateY: 20,
                            transition: { duration: 0.3 }
                        }}
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: "1000px"
                        }}
                    >
                        <Image
                            src="/1.png"
                            alt="MERN Stack Book Cover"
                            width={320}
                            height={420}
                            className="w-full h-auto object-contain rounded-lg shadow-xl"
                        />
                        <motion.div 
                            className="absolute inset-0 rounded-lg border-2 border-yellow-400 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ 
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 2
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            <TestimonialFooter/>
        </div>
        </>
    );
}

