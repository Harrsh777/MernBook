// app/page.tsx
"use client"

// NEW: Import hooks and particle engine dependencies
import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
 // Make sure you have particles.ts in the same directory or adjust path

import { Inter, Space_Grotesk } from 'next/font/google';
import { motion } from 'framer-motion';
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

    // NEW: useEffect to initialize the particles engine on component mount
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // NEW: Define the height for the particle banner. You can change this value.
    const particleBannerHeight = '1000px';

    const handleScroll = (distance: number) => {
        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    };

    const handleDownloadCV = () => {
        const cvUrl = '/Resume.pdf';
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Harsh_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden relative ${inter.className}`}>
            
            {/* NEW: Particle Banner Container */}
            {/* This div creates a container for the particles at the top of the page. */}
            {init && (
                 <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: particleBannerHeight, // Restricts the height
                    pointerEvents: 'none',       // CRITICAL: Allows clicks to pass through to content below
                    zIndex: 0                    // Places it behind your z-10 content
                 }}>
                    <Particles
                        id="tsparticles"
                        options={particlesOptions}
                    />
                </div>
            )}
            
            {/* Animated background text */}
            <motion.div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                variants={backgroundTextVariants}
                animate="animate"
            >
                {[...Array(20)].map((_, i) => (
                    <motion.span
                        key={i}
                        className={`absolute text-white opacity-5 blur-md ${spaceGrotesk.className}`}
                        style={{
                            fontSize: `${Math.random() * 5 + 3}rem`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            rotate: `${Math.random() * 360}deg`,
                        }}
                    >
                        HARSH
                    </motion.span>
                ))}
            </motion.div>

            {/* Navbar */}
            <motion.nav 
                className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className={`text-2xl font-bold text-white ${spaceGrotesk.className}`}>
                    Harsh
                </div>
                <div className="hidden md:flex space-x-8 items-center">
                    {[
                        { name: 'Projects', action: () => handleScroll(1800) },
                        { name: 'Certifications', action: () => handleScroll(4700) },
                        { name: 'Book', action: () => router.push('/book') },
                        { name: 'Contact', action: () => router.push('/contact') }
                    ].map((item) => (
                        <motion.button
                            key={item.name}
                            onClick={item.action}
                            className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                        </motion.button>
                    ))}
                </div>
                <a
                    href="mailto:Harrshh077@gmail.com"
                    className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition-transform"
                >
                    <FaEnvelope className="text-red-500" />
                    Harrshh077@gmail.com
                </a>
            </motion.nav>

            {/* Main content - this hero section will appear inside the particle banner */}
            <main className="container mx-auto px-6 py-16 md:py-24 relative z-10">
              <div className="flex flex-col md:flex-row items-center">
                {/* Text Section */}
                <motion.div 
                  className="w-full md:w-1/2 mb-12 md:mb-0"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-center md:text-left ${spaceGrotesk.className} mb-6`}>
                    Software Developer
                  </h1>
                  <motion.p 
                    className="text-white text-base sm:text-lg md:text-xl opacity-80 text-center md:text-left mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Hi, I@apos;m Harsh, Full-stack engineer specializing in high-performance web apps. National hackathon winner, published author, and freelance developer helping businesses build scalable platforms.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                  >
                    <motion.button
                      onClick={handleDownloadCV}
                      className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload />
                      Download CV
                    </motion.button>
                    <motion.button
                      onClick={() => router.push('/contact')}
                      className="px-6 py-3 border border-yellow-500 text-yellow-500 rounded-lg font-medium"
                      whileHover={{ y: -3, backgroundColor: "rgba(234, 179, 8, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Me
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Image Section */}
                <motion.div 
                  className="w-full md:w-1/2 mt-8 md:mt-0 relative flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-[3/4] rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gray-800 bg-opacity-40 flex items-center justify-center border-2 border-dashed border-gray-600">
                      <span className="text-gray-400">Good Looking Guy</span>
                    </div>
                    <Image
                      src="/profile.jpg"
                      alt="Harsh"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>

                  {/* Floating elements */}
                  <motion.div 
                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-yellow-500 rounded-full opacity-20 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
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
            
            <ExperienceTimeline/>
            
            <section id="projects">
                <PortfolioGrid/>
            </section>
            <Skills />
            <LeetCodeDashboard/>
            
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
    );
}

