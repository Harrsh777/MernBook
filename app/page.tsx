// app/page.tsx
"use client"

// Removed unused Metadata import to satisfy ESLint

import React from 'react';
import { useRouter } from 'next/navigation';
import { Space_Grotesk, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { FaArrowRight } from 'react-icons/fa';

import SocialCarousel from './components/SocialCarousel';
import ExperienceTimeline from './components/experience';
import PortfolioGrid from './components/PortfolioGrid';
import LeetCodeDashboard from './components/dsa';
import CertificationsCarousel from './components/certification';
import TestimonialFooter from './components/footer';
import Skills from './components/Skills';
import { StaggeredMenu } from './components/menu';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function Home() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [menuParticles, setMenuParticles] = React.useState<Array<{ size: number; left: number; top: number; opacity: number }>>([]);
    const [openModal, setOpenModal] = React.useState<string | null>(null);

    // Service content for modals
    const serviceContents = {
        'WEB DEVELOPMENT': 'I specialize in building robust, scalable web applications using modern technologies like React, Next.js, and Node.js. My expertise includes creating responsive user interfaces, implementing RESTful APIs, and optimizing performance for seamless user experiences. Whether you need a simple landing page or a complex enterprise application, I deliver solutions that are both functional and visually appealing.',
        'APP DEVELOPMENT': 'I develop high-performance mobile applications for both iOS and Android platforms. With expertise in React Native and native development, I create intuitive apps that deliver exceptional user experiences while maintaining code quality and scalability. From concept to deployment, I ensure your app meets the highest standards of performance and user satisfaction.',
        'VISUAL GRAPHIC DESIGN': 'I craft compelling visual identities and designs that communicate your brand\'s message effectively. From logo design to complete brand systems, I combine creativity with strategic thinking to create designs that resonate with your target audience and drive engagement. My work helps businesses establish a strong visual presence that sets them apart in the market.'
    };

    // Generate menu particles only on client side to avoid hydration mismatch
    React.useEffect(() => {
        const particles = Array.from({ length: 50 }).map(() => ({
            size: Math.random() * 1.5 + 0.5,
            left: Math.random() * 100,
            top: Math.random() * 100,
            opacity: Math.random() * 0.6 + 0.4
        }));
        setMenuParticles(particles);
    }, []);

    // Handle menu item clicks for navigation
    React.useEffect(() => {
        const handleMenuClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a[href]') as HTMLAnchorElement;
            
            if (link) {
                const href = link.getAttribute('href');
                if (href) {
                    // Close menu
                    const menuButton = document.querySelector('.staggered-menu-container .sm-toggle') as HTMLButtonElement;
                    if (menuButton && isMenuOpen) {
                        setTimeout(() => {
                            menuButton.click();
                        }, 100);
                    }
                    
                    // Handle navigation
                    if (href.startsWith('#')) {
                        // Scroll to section
                        e.preventDefault();
                        const element = document.querySelector(href);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else if (href.startsWith('/') && href !== '/') {
                        // Internal route (except home)
                        e.preventDefault();
                        router.push(href);
                    }
                    // External links and home will work normally
                }
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleMenuClick);
            return () => document.removeEventListener('click', handleMenuClick);
        }
    }, [isMenuOpen, router]);

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

    // Email Button Component with Particles - Fixed Position, Top Left
    const EmailButton = () => {
        const [isHovered, setIsHovered] = React.useState(false);
        const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

        React.useEffect(() => {
            if (isHovered) {
                const newParticles = Array.from({ length: 120 }).map((_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.6 + 0.4
                }));
                setParticles(newParticles);
            } else {
                setParticles([]);
            }
        }, [isHovered]);

        const handleEmailClick = () => {
            window.location.href = 'mailto:harrshh077@gmail.com';
        };

        return (
            <motion.button
                onClick={handleEmailClick}
                className="fixed z-[10000] bg-black text-white px-4 py-2 font-semibold text-xs md:text-sm cursor-pointer rounded-full overflow-hidden mobile-email-button"
                style={{ 
                    position: 'fixed',
                    top: '0.5cm',
                    left: '1cm',
                    zIndex: 10000
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Particles Background - Only visible on hover */}
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute rounded-full"
                                style={{
                                    backgroundColor: '#9CA3AF',
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, particle.opacity, particle.opacity * 0.7, 0],
                                    x: [particle.x + '%', (particle.x + (Math.random() - 0.5) * 30) + '%'],
                                    y: [particle.y + '%', (particle.y + (Math.random() - 0.5) * 30) + '%'],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Button Text */}
                <span className={`relative z-10 ${spaceGrotesk.className}`}>harrshh077@gmail.com</span>
            </motion.button>
        );
    };

    // Menu Button Component with Particles - Fixed Position
    const MenuButton = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean; setIsMenuOpen: (val: boolean) => void }) => {
        const [isHovered, setIsHovered] = React.useState(false);
        const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

        React.useEffect(() => {
            if (isHovered) {
                const newParticles = Array.from({ length: 120 }).map((_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.6 + 0.4
                }));
                setParticles(newParticles);
            } else {
                setParticles([]);
            }
        }, [isHovered]);

        return (
            <motion.button
                onClick={() => {
                    // Find and click the hidden toggle button to trigger menu animation
                    const menuButton = document.querySelector('.staggered-menu-container .sm-toggle') as HTMLButtonElement;
                    if (menuButton) {
                        // Make button temporarily visible to click, then hide again
                        menuButton.style.display = 'block';
                        menuButton.style.opacity = '0';
                        menuButton.style.pointerEvents = 'auto';
                        menuButton.click();
                        setTimeout(() => {
                            menuButton.style.display = 'none';
                        }, 100);
                    }
                    setIsMenuOpen(!isMenuOpen);
                }}
                className="fixed z-[10000] bg-black text-white px-6 py-3 font-semibold text-sm md:text-base cursor-pointer rounded-full overflow-hidden mobile-menu-button"
                style={{ 
                    position: 'fixed',
                    top: '0.5cm',
                    right: '1cm',
                    zIndex: 10000
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Particles Background - Only visible on hover */}
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute rounded-full"
                                style={{
                                    backgroundColor: '#9CA3AF',
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, particle.opacity, particle.opacity * 0.7, 0],
                                    x: [particle.x + '%', (particle.x + (Math.random() - 0.5) * 30) + '%'],
                                    y: [particle.y + '%', (particle.y + (Math.random() - 0.5) * 30) + '%'],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Button Text */}
                <span className="relative z-10">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </motion.button>
        );
    };

    // Particle Button Component with Hover Effect
    const ParticleButton = ({ children, onClick, href, className, ...props }: { 
        children: React.ReactNode; 
        onClick?: () => void;
        href?: string;
        className?: string;
        [key: string]: unknown;
    }) => {
        const [isHovered, setIsHovered] = React.useState(false);
        const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

        React.useEffect(() => {
            if (isHovered) {
                const newParticles = Array.from({ length: 120 }).map((_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.6 + 0.4
                }));
                setParticles(newParticles);
            } else {
                setParticles([]);
            }
        }, [isHovered]);

        const ButtonContent = (
            <div
                className={`relative overflow-hidden rounded-full ${className || ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                style={{ position: 'relative', display: 'inline-block' }}
            >
                {/* Particles Background - Only visible on hover */}
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute rounded-full"
                                style={{
                                    backgroundColor: '#9CA3AF',
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, particle.opacity, particle.opacity * 0.7, 0],
                                    x: [particle.x + '%', (particle.x + (Math.random() - 0.5) * 30) + '%'],
                                    y: [particle.y + '%', (particle.y + (Math.random() - 0.5) * 30) + '%'],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Button Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );

        if (href) {
            return (
                <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block' }}
                    {...props}
                >
                    {ButtonContent}
                </motion.a>
            );
        }

        return (
            <motion.div {...props}>
                {ButtonContent}
            </motion.div>
        );
    };

    // Service Modal Component
    const ServiceModal = ({ isOpen, onClose, serviceTitle, content }: { 
        isOpen: boolean; 
        onClose: () => void; 
        serviceTitle: string;
        content: string;
    }) => {
        if (!isOpen) return null;

        // Different client messages for each service
        const clientMessages: { [key: string]: string } = {
            'WEB DEVELOPMENT': 'I\'ve successfully delivered web solutions for over 20+ satisfied clients, helping businesses establish a strong online presence and drive growth through cutting-edge web technologies.',
            'APP DEVELOPMENT': 'With over 20+ successful app launches, I\'ve helped clients transform their ideas into powerful mobile applications that engage users and deliver measurable business results.',
            'VISUAL GRAPHIC DESIGN': 'I\'ve created impactful visual designs for over 20+ clients, helping brands establish memorable identities that connect with their audience and drive brand recognition.'
        };

        // Different call-to-action messages
        const ctaMessages: { [key: string]: string } = {
            'WEB DEVELOPMENT': 'Ready to build your next web project? Let\'s discuss how I can help bring your vision to life.',
            'APP DEVELOPMENT': 'Have an app idea? Let\'s explore how we can turn it into a successful mobile application.',
            'VISUAL GRAPHIC DESIGN': 'Looking to elevate your brand\'s visual identity? Let\'s create something remarkable together.'
        };

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white border-2 border-black rounded-lg shadow-2xl max-w-2xl w-full p-8 md:p-12"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Content */}
                        <div className="space-y-6">
                            <h2 className={`text-3xl md:text-4xl font-bold text-black uppercase ${spaceGrotesk.className}`}>
                                {serviceTitle}
                            </h2>
                            
                            <div className="space-y-4">
                                <p className={`text-base md:text-lg text-gray-700 leading-relaxed ${spaceGrotesk.className}`}>
                                    {content}
                                </p>
                                
                                <div className="bg-black text-white p-6 rounded-lg">
                                    <p className={`text-base md:text-lg font-semibold mb-2 ${spaceGrotesk.className}`}>
                                        Over 20+ Happy Clients
                                    </p>
                                    <p className={`text-sm md:text-base text-gray-300 ${spaceGrotesk.className}`}>
                                        {clientMessages[serviceTitle] || 'I\'ve successfully delivered projects for clients across various industries, helping them achieve their business goals through innovative solutions.'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t-2 border-gray-200">
                                    <p className={`text-base md:text-lg text-gray-700 mb-4 ${spaceGrotesk.className}`}>
                                        {ctaMessages[serviceTitle] || 'If you want to talk more about your project, feel free to reach out:'}
                                    </p>
                                    <a
                                        href="mailto:harrshh077@gmail.com"
                                        className={`inline-flex items-center gap-2 text-black font-semibold hover:underline ${spaceGrotesk.className}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        harrshh077@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    };

    // Service Card Component with Hover Particle Effect
    const ServiceCard = ({ title, icon, index, onReadMore }: { 
        title: string; 
        icon: React.ReactNode; 
        index: number;
        onReadMore: () => void;
    }) => {
        const [isHovered, setIsHovered] = React.useState(false);
        const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
        const isFirst = index === 0;

        React.useEffect(() => {
            if (isHovered || isFirst) {
                // Generate particles for hover effect - grey particles like in particles-config
                const newParticles = Array.from({ length: 120 }).map((_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.6 + 0.4
                }));
                setParticles(newParticles);
            } else {
                setParticles([]);
            }
        }, [isHovered, isFirst]);

        const isBlack = isFirst || isHovered;

        // Handle mouse events
        const handleMouseEnter = () => {
            if (!isFirst) {
                setIsHovered(true);
            }
        };

        const handleMouseLeave = () => {
            if (!isFirst) {
                setIsHovered(false);
            }
        };

        return (
            <motion.div
                className="relative overflow-hidden rounded-lg border-2 cursor-pointer service-card-wrapper-mobile"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ minHeight: '280px' }}
                initial={false}
                animate={{
                    backgroundColor: isBlack ? '#000000' : '#FFFFFF',
                    borderColor: '#000000',
                }}
                transition={{
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1] // Enhanced easing for ultra-smooth transitions
                }}
            >
                {/* Particles Background - Visible when black */}
                {(isHovered || isFirst) && (
                    <motion.div 
                        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute rounded-full bg-gray-400"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: [0, particle.opacity, particle.opacity * 0.7, 0],
                                    x: [particle.x + '%', (particle.x + (Math.random() - 0.5) * 30) + '%'],
                                    y: [particle.y + '%', (particle.y + (Math.random() - 0.5) * 30) + '%'],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Card Content */}
                <motion.div 
                    className={`relative z-10 p-4 md:p-6 lg:p-8 flex flex-col h-full min-h-[220px] md:min-h-[280px] lg:min-h-[300px] pointer-events-auto service-card-mobile`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    animate={{
                        color: isBlack ? '#FFFFFF' : '#000000',
                    }}
                    transition={{
                        duration: 0.7,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                >
                    {/* Icon */}
                    <motion.div 
                        className="mb-3 md:mb-4 lg:mb-6 service-icon-mobile"
                        animate={{
                            color: isBlack ? '#FFFFFF' : '#000000',
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        {icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-base md:text-lg lg:text-xl xl:text-2xl font-bold uppercase mb-auto leading-tight ${spaceGrotesk.className}`}>
                        {title.split(' ').map((word, i) => (
                            <React.Fragment key={i}>
                                {word}
                                {i < title.split(' ').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </h3>

                    {/* Read More */}
                    <button
                        onClick={onReadMore}
                        className="mt-4 md:mt-6 lg:mt-8 flex items-center gap-2 group/readmore cursor-pointer"
                    >
                        <span className={`text-[10px] md:text-xs lg:text-sm font-semibold uppercase ${spaceGrotesk.className}`}>READ MORE</span>
                        <motion.div
                            animate={{
                                color: isBlack ? '#FFFFFF' : '#000000',
                            }}
                            transition={{
                                duration: 0.7,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                        >
                            <FaArrowRight className="text-xs md:text-sm transition-transform duration-300 group-hover/readmore:translate-x-1" />
                        </motion.div>
                    </button>
                </motion.div>
            </motion.div>
        );
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

            {/* Staggered Menu - Fixed Position, Only on Main Page */}
            <div 
                className="staggered-menu-container" 
                style={{ 
                    height: '17cm', 
                    maxHeight: '17cm',
                    overflow: 'visible',
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <StaggeredMenu
                    position="right"
                    items={[
                        { label: 'Home', ariaLabel: 'Go to home page', link: '#' },
                        { label: 'BOOK', ariaLabel: 'View book page', link: '/book' },
                        { label: 'Projects', ariaLabel: 'View projects', link: '#case-study' },
                        { label: 'Skills', ariaLabel: 'View skills', link: '#skills' },
                        { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
                    ]}
                    socialItems={[
                        { label: 'GitHub', link: 'https://github.com/Harrsh777' },
                        { label: 'LinkedIn', link: 'https://www.linkedin.com/in/harrshh/' },
                        { label: 'LeetCode', link: 'https://leetcode.com/u/Harrshh077/' }
                    ]}
                    router={router}
                    displaySocials={true}
                    displayItemNumbering={true}
                    menuButtonColor="#000"
                    openMenuButtonColor="#000"
                    changeMenuColorOnOpen={true}
                    colors={['#B19EEF', '#5227FF']}
                    accentColor="#000"
                    isFixed={true}
                    onMenuOpen={() => setIsMenuOpen(true)}
                    onMenuClose={() => setIsMenuOpen(false)}
                />
            </div>
            
            {/* Email Button - Fixed Position, Top Left */}
            <EmailButton />

            {/* Custom MENU/CLOSE Button - Fixed Position, Top Right, Only on Main Page */}
            <MenuButton
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />

            {/* Additional styles to limit menu panel height to 16cm, hide header buttons, and keep menu fixed */}
            <style jsx global>{`
                /* Ensure menu button stays fixed */
                button[class*="fixed"][style*="position: fixed"] {
                    position: fixed !important;
                }
                
                .staggered-menu-container {
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    z-index: 9999 !important;
                }
                .staggered-menu-container .staggered-menu-header {
                    display: none !important;
                }
                .staggered-menu-container .staggered-menu-panel {
                    max-height: 17cm !important;
                    height: 17cm !important;
                    overflow-y: auto;
                    top: 0 !important;
                    right: 0 !important;
                    left: auto !important;
                    position: fixed !important;
                    z-index: 9998 !important;
                }
                
                /* Hide menu panel by default, only show when data-open is present */
                .staggered-menu-container .staggered-menu-wrapper:not([data-open]) .staggered-menu-panel {
                    pointer-events: none !important;
                    visibility: hidden !important;
                }
                
                .staggered-menu-container .staggered-menu-wrapper[data-open] .staggered-menu-panel {
                    pointer-events: auto !important;
                    visibility: visible !important;
                }
                .staggered-menu-container .staggered-menu-panel * {
                    pointer-events: auto !important;
                }
                .staggered-menu-container .staggered-menu-panel a,
                .staggered-menu-container .staggered-menu-panel button {
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }
                .staggered-menu-container .staggered-menu-wrapper {
                    height: 17cm !important;
                    max-height: 17cm !important;
                    overflow: visible !important;
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    z-index: 9997 !important;
                    pointer-events: auto !important;
                    width: auto !important;
                }
                .staggered-menu-container .staggered-menu-wrapper[data-open] {
                    pointer-events: auto !important;
                }
                .staggered-menu-container .sm-prelayers {
                    max-height: 17cm !important;
                    height: 17cm !important;
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    z-index: 9996 !important;
                }
                .staggered-menu-container .sm-prelayer {
                    max-height: 17cm !important;
                    height: 17cm !important;
                }
                .staggered-menu-container .sm-logo {
                    display: none !important;
                }
                .staggered-menu-container .sm-toggle {
                    opacity: 0 !important;
                    pointer-events: auto !important;
                    position: absolute !important;
                    visibility: hidden !important;
                }
                
                /* Make staggered menu 7cm height and 5cm width in mobile view, hide blue background */
                @media (max-width: 1279px) {
                    .staggered-menu-container {
                        height: 7cm !important;
                        max-height: 7cm !important;
                    }
                    
                    .staggered-menu-container .staggered-menu-panel {
                        max-height: 7cm !important;
                        height: 7cm !important;
                        width: 3cm !important;
                        max-width: 3cm !important;
                        padding: 0.8em 0.6em 0.6em 0.6em !important;
                        overflow-y: auto !important;
                        right: 0 !important;
                        left: auto !important;
                    }
                    
                    .staggered-menu-container .staggered-menu-wrapper {
                        height: 7cm !important;
                        max-height: 7cm !important;
                        width: 3.5cm !important;
                        right: 0 !important;
                        left: auto !important;
                    }
                    
                    /* Ensure menu panel is on the right side */
                    .staggered-menu-container .staggered-menu-wrapper[data-position="right"] .staggered-menu-panel,
                    .staggered-menu-container .staggered-menu-panel {
                        right: 0 !important;
                        left: auto !important;
                    }
                    
                    /* Override any left positioning */
                    .staggered-menu-container[data-position="right"] .staggered-menu-panel {
                        right: 0 !important;
                        left: auto !important;
                    }
                    
                    /* Hide blue prelayers (animation layers) - only show white panel */
                    .staggered-menu-container .sm-prelayers {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                    
                    .staggered-menu-container .sm-prelayer {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                    
                    /* Ensure menu is hidden by default in mobile - let GSAP handle transform */
                    .staggered-menu-container .staggered-menu-wrapper:not([data-open]) .staggered-menu-panel {
                        pointer-events: none !important;
                    }
                    
                    .staggered-menu-container .staggered-menu-wrapper[data-open] .staggered-menu-panel {
                        pointer-events: auto !important;
                    }
                    
                    /* Reduce menu content sizes to fit properly */
                    .staggered-menu-container .sm-panel-inner {
                        gap: 0.25rem !important;
                        flex: 1 !important;
                        min-height: 0 !important;
                    }
                    
                    .staggered-menu-container .sm-panel-item {
                        font-size: 0.9rem !important;
                        padding-right: 1.2em !important;
                        letter-spacing: -0.5px !important;
                        line-height: 1.1 !important;
                    }
                    
                    .staggered-menu-container .sm-panel-list {
                        gap: 0.15rem !important;
                    }
                    
                    .staggered-menu-container .sm-panel-title {
                        font-size: 0.6rem !important;
                    }
                    
                    .staggered-menu-container .sm-socials {
                        margin-top: auto !important;
                        padding-top: 0.4rem !important;
                        gap: 0.3rem !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .staggered-menu-container .sm-socials-title {
                        font-size: 0.55rem !important;
                        margin-bottom: 0.2rem !important;
                    }
                    
                    .staggered-menu-container .sm-socials-link {
                        font-size: 0.40rem !important;
                    }
                    
                    .staggered-menu-container .sm-socials-list {
                        gap: 0.4rem !important;
                        flex-wrap: wrap !important;
                    }
                    
                    .staggered-menu-container .sm-panel-list[data-numbering] .sm-panel-item::after {
                        font-size: 8px !important;
                        right: 0.3em !important;
                        top: 0.1em !important;
                        font-weight: 400 !important;
                    }
                    
                    /* Ensure proper overflow handling */
                    .staggered-menu-container .sm-panel-itemLabel {
                        display: block !important;
                        white-space: nowrap !important;
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                    }
                }
            `}</style>

            {/* Hero Section - Light Minimal Design */}
            <section className="bg-[#F5F5F5] min-h-screen flex items-start relative z-10 overflow-hidden pt-0">

                {/* Desktop Layout - Keep unchanged */}
                <div className="hidden xl:block relative w-full h-screen pt-4 md:pt-6 lg:pt-8">
                    {/* Left Column - Text Content */}
                    <motion.div
                        className="absolute left-4 md:left-6 lg:left-8 xl:left-12 top-4 md:top-6 lg:top-8 z-10 flex flex-col space-y-4 md:space-y-6 max-w-lg"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {/* Top Label - Removed, moved to fixed position button */}

                        {/* Subheading */}
                        <h2 className={`text-sm md:text-base lg:text-lg text-black mt-20 ${playfairDisplay.className} font-normal`}>
                            Hey, I&apos;m Harsh,
                        </h2>

                        {/* Main Heading */}
                        <h1 className="space-y-1 md:space-y-2">
                            <span className={`block text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                A FULL-STACK
                            </span>
                            <span className={`block text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                & <span className={`${playfairDisplay.className} font-normal`}>MLOPS</span>
                            </span>
                            <span className={`block text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                DEVELOPER
                            </span>
                        </h1>

                        {/* Description Paragraph */}
                        <p className={`text-black text-xs md:text-sm lg:text-base leading-relaxed max-w-lg mt-4 ${playfairDisplay.className} font-normal`}>
                        Transforming ideas into scalable software, Development that powers reliable, intelligent products.
                        </p>

                        {/* Contact and Resume Buttons */}
                        <div className="flex items-center gap-3 md:gap-4 mt-2">
                            <ParticleButton
                                onClick={() => router.push('/contact')}
                                className="group bg-black text-white px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 font-semibold text-xs md:text-sm lg:text-base w-fit border-2 border-white cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span>Get in touch</span>
                                    <FaArrowRight className="text-white text-xs md:text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </ParticleButton>
                            
                            <ParticleButton
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = '/Harsh_Resume.pdf';
                                    link.download = 'Harsh_Resume.pdf';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="group bg-white text-black px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 font-semibold text-xs md:text-sm lg:text-base w-fit border-2 border-black cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span>Resume</span>
                                    <svg className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-y-[-2px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                            </ParticleButton>
                        </div>
                    </motion.div>

                    {/* Image Container with U-shaped Structure - 10cm from left */}
                    <motion.div
                        className="absolute top-0 flex justify-center items-start"
                        style={{
                            left: '19cm'
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {/* U-shaped container - 8cm width, 13cm height, starts from top, 10cm from left */}
                        <div 
                            className="relative flex items-center justify-center bg-[#E5E5E5] overflow-hidden"
                            style={{
                                width: '10cm',
                                height: '17cm',
                                borderRadius: '0 0 4cm 4cm', // U-shape: rounded bottom corners, creating U at the bottom
                                marginTop: '0', // Starts from top
                            }}
                        >
                            {/* Image container filling the U-box */}
                            <div 
                                className="relative w-full h-full overflow-hidden"
                                style={{
                                    borderRadius: '0 0 4cm 4cm', // Match the U-shape
                                }}
                            >
                                <Image
                                    src="/author.jpeg"
                                    alt="Harsh - UI/UX & Brand Designer"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Horizontal Menu Bar - Below Photo Section */}
                    <div 
                        className="absolute left-0 right-0 z-20 flex items-center justify-center overflow-hidden"
                        style={{
                            top: '17.5cm',
                            height: '1cm',
                            backgroundColor: '#000',
                            position: 'absolute'
                        }}
                    >
                        {/* Particle Background Effect - Starry Sky */}
                        <div className="absolute inset-0">
                            {menuParticles.map((particle, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-gray-400"
                                    style={{
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        left: `${particle.left}%`,
                                        top: `${particle.top}%`,
                                        opacity: particle.opacity
                                    }}
                                />
                            ))}
                        </div>

                        {/* Diagonal Line */}
                        <div 
                            className="absolute bg-white"
                            style={{
                                width: '1px',
                                height: '300%',
                                top: '-100%',
                                left: '12%',
                                transform: 'rotate(12deg)',
                                transformOrigin: 'center',
                                zIndex: 1
                            }}
                        />

                        {/* Menu Items */}
                        <div 
                            className={`relative z-10 flex items-center justify-center px-4 md:px-8 ${spaceGrotesk.className}`}
                            style={{ gap: '1cm' }}
                        >
                            <span className="text-white uppercase font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.1em] whitespace-nowrap">WEB DEVELOPMENT</span>
                            <span className="text-white text-sm md:text-base">✦</span>
                            <span className="text-white uppercase font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.1em] whitespace-nowrap">APP DEVELOPMENT</span>
                            <span className="text-white text-sm md:text-base">✦</span>
                            <span className="text-white uppercase font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.1em] whitespace-nowrap">WRITING</span>
                            <span className="text-white text-sm md:text-base">✦</span>
                            <span className="text-white uppercase font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.1em] whitespace-nowrap">WEB FLOW</span>
                            <span className="text-white text-sm md:text-base">✦</span>
                            <span className="text-white uppercase font-bold text-[10px] md:text-xs lg:text-sm tracking-[0.1em] whitespace-nowrap">BRANDING.</span>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Responsive Layout */}
                <div className="xl:hidden relative w-full min-h-screen pt-16 md:pt-20 pb-0 md:pb-8 px-4 md:px-6 mobile-hero-container">
                    <div className="flex flex-row items-start gap-3 md:gap-6 lg:gap-8 max-w-6xl mx-auto mobile-hero-content">
                        {/* Left Column - Text Content */}
                        <motion.div
                            className="flex-1 flex flex-col space-y-2 md:space-y-4 lg:space-y-6 z-10 min-w-0"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {/* Subheading */}
                            <h2 className={`text-xs md:text-sm lg:text-base text-black ${playfairDisplay.className} font-normal mobile-hey-harsh`}>
                                Hey, I&apos;m Harsh,
                            </h2>

                            {/* Main Heading */}
                            <h1 className="space-y-0.5 md:space-y-1 lg:space-y-2">
                                <span className={`block text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                    A FULL-STACK
                                </span>
                                <span className={`block text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                    & <span className={`${playfairDisplay.className} font-normal`}>MLOPS</span>
                                </span>
                                <span className={`block text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-[1.1] ${spaceGrotesk.className}`}>
                                    DEVELOPER
                                </span>
                            </h1>

                            {/* Description Paragraph */}
                            <p className={`text-black text-[9px] md:text-[10px] lg:text-xs leading-relaxed mt-2 md:mt-4 ${playfairDisplay.className} font-normal mobile-description`}>
                            <span className="block">Transforming ideas into scalable software,</span>
                            <span className="block">Development that powers reliable,</span>
                            <span className="block">intelligent products.</span>
                            </p>

                            {/* Contact and Resume Buttons */}
                            <div className="flex flex-row items-center gap-2 md:gap-3 lg:gap-4 mt-2">
                                <ParticleButton
                                    onClick={() => router.push('/contact')}
                                    className="group bg-black text-white px-3 py-1.5 md:px-5 md:py-2.5 lg:px-6 lg:py-3 font-semibold text-[10px] md:text-xs lg:text-sm w-fit border-2 border-white cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                                        <span>Get in touch</span>
                                        <FaArrowRight className="text-white text-[10px] md:text-xs lg:text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </ParticleButton>
                                
                                <ParticleButton
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = '/Harsh_Resume.pdf';
                                        link.download = 'Harsh_Resume.pdf';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="group bg-white text-black px-3 py-1.5 md:px-5 md:py-2.5 lg:px-6 lg:py-3 font-semibold text-[10px] md:text-xs lg:text-sm w-fit border-2 border-black cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                                        <span>Resume</span>
                                        <svg className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 group-hover:translate-y-[-2px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </ParticleButton>
                            </div>
                        </motion.div>

                        {/* Right Column - Smaller Image */}
                        <motion.div
                            className="flex-shrink-0 w-32 sm:w-40 md:w-56 lg:w-72 xl:w-96 mobile-photo-left"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            style={{
                                marginTop: 0
                            }}
                        >
                            <div 
                                className="relative flex items-start justify-center bg-[#E5E5E5] overflow-hidden rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl mobile-photo-container"
                                style={{
                                    width: '100%',
                                    aspectRatio: '3/4',
                                    maxHeight: '400px',
                                    marginTop: 0
                                }}
                            >
                                <div 
                                    className="relative w-full h-full overflow-hidden rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl"
                                >
                                    <Image
                                        src="/author.jpeg"
                                        alt="Harsh - Full-Stack & MLOPS Developer"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Horizontal Menu Bar - Mobile/Tablet */}
                    <div 
                        className="mt-8 md:mt-12 w-full z-20 flex items-center justify-center overflow-hidden bg-black py-1 md:py-3 lg:py-4 mobile-menu-bar"
                        style={{ width: '100%', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}
                    >
                        {/* Particle Background Effect - Starry Sky */}
                        <div className="absolute inset-0">
                            {menuParticles.map((particle, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-gray-400"
                                    style={{
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        left: `${particle.left}%`,
                                        top: `${particle.top}%`,
                                        opacity: particle.opacity
                                    }}
                                />
                            ))}
                        </div>

                        {/* Menu Items - Responsive */}
                        <div 
                            className={`relative z-10 flex items-center justify-center flex-wrap px-4 ${spaceGrotesk.className}`}
                            style={{ gap: '0.5rem' }}
                        >
                            <span className="text-white uppercase font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em]">WEB DEV</span>
                            <span className="text-white text-xs md:text-sm">✦</span>
                            <span className="text-white uppercase font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em]">APP DEV</span>
                            <span className="text-white text-xs md:text-sm">✦</span>
                            <span className="text-white uppercase font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em]">WRITING</span>
                            <span className="text-white text-xs md:text-sm">✦</span>
                            <span className="text-white uppercase font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em]">WEB FLOW</span>
                            <span className="text-white text-xs md:text-sm">✦</span>
                            <span className="text-white uppercase font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em]">BRANDING</span>
                        </div>
                    </div>

                    {/* Social Media Carousel - Mobile/Tablet - Right below menu bar */}
                    <motion.div 
                        className="relative z-10 px-4 carousel-mobile-wrapper mobile-carousel-gap"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <SocialCarousel />
                    </motion.div>
                </div>
            </section>
            
            {/* Style override for mobile carousel padding and size */}
            <style jsx global>{`
                .carousel-mobile-wrapper > div {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                }
                
                @media (max-width: 1279px) {
                    .carousel-mobile-wrapper > div {
                        padding-bottom: 0 !important;
                    }
                }
                
                /* Make social carousel smaller in mobile view */
                @media (max-width: 1279px) {
                    .carousel-mobile-wrapper {
                        max-width: 100% !important;
                    }
                    
                    .carousel-mobile-wrapper .carousel-scroll {
                        gap: 0.5rem !important;
                        padding-left: 0.75rem !important;
                        padding-right: 0.75rem !important;
                    }
                    
                    .carousel-mobile-wrapper button {
                        min-width: 90px !important;
                        max-width: 90px !important;
                        height: 30px !important;
                        padding-left: 0.5rem !important;
                        padding-right: 0.5rem !important;
                        gap: 0.375rem !important;
                    }
                    
                    .carousel-mobile-wrapper button svg,
                    .carousel-mobile-wrapper button .react-icons {
                        width: 12px !important;
                        height: 12px !important;
                    }
                    
                    .carousel-mobile-wrapper button span {
                        font-size: 0.50rem !important;
                    }
                    
                    .carousel-mobile-wrapper > div {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                }
                
                /* Remove all spacing between social carousel and services in mobile */
                @media (max-width: 1279px) {
                    /* Remove margin-top from carousel wrapper and motion.div */
                    .carousel-mobile-wrapper {
                        margin-top: 0 !important;
                        margin-bottom: 0 !important;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Target motion.div specifically */
                    .carousel-mobile-wrapper[class*="motion"],
                    div[class*="motion"].carousel-mobile-wrapper {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Remove all spacing from carousel inner elements - target SocialCarousel component */
                    .carousel-mobile-wrapper > div,
                    .carousel-mobile-wrapper > div.social-carousel-mobile {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        margin-top: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Target the social-carousel-mobile class directly - override py-2 from component */
                    .social-carousel-mobile {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        margin-top: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Override py-2 class from SocialCarousel component */
                    .social-carousel-mobile[class*="py-"] {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Remove padding from carousel scroll container */
                    .carousel-mobile-wrapper .carousel-scroll {
                        margin-top: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Remove padding-top from services section - override Tailwind py-2 and pull it up */
                    section.mobile-services-section {
                        padding-top: 0 !important;
                        padding-bottom: 0.5rem !important; /* Keep bottom padding */
                        margin-top: -2rem !important; /* Very aggressive negative margin to pull up */
                    }
                    
                    /* Override Tailwind py-2 utility class specifically */
                    section.mobile-services-section[class*="py-"] {
                        padding-top: 0 !important;
                    }
                    
                    /* Target the first div inside services section */
                    section.mobile-services-section > div {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }
                    
                    /* Remove any spacing from hero section and ensure it ends exactly at carousel */
                    section.bg-\\[\\#F5F5F5\\] {
                        padding-bottom: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Ensure the last child of hero section (carousel wrapper) has no bottom spacing */
                    section.bg-\\[\\#F5F5F5\\] .carousel-mobile-wrapper:last-child {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Remove any line-height or other spacing that might create gaps */
                    section.bg-\\[\\#F5F5F5\\] + section.mobile-services-section {
                        line-height: 0 !important;
                    }
                    
                    section.mobile-services-section {
                        line-height: normal !important;
                    }
                    
                    /* Remove padding from hero container */
                    .mobile-hero-container {
                        padding-bottom: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Target the hero section container that wraps carousel */
                    section.bg-\\[\\#F5F5F5\\] > div > div:last-child {
                        padding-bottom: 0 !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Remove any gap between sections - pull services section up to carousel */
                    section.bg-\\[\\#F5F5F5\\] + section.mobile-services-section,
                    section.bg-\\[\\#F5F5F5\\] ~ section.mobile-services-section {
                        margin-top: -2rem !important; /* Very aggressive negative margin to eliminate gap */
                        padding-top: 0 !important;
                        position: relative !important;
                        top: 0 !important;
                    }
                    
                    /* Ensure carousel wrapper has no spacing after it */
                    .carousel-mobile-wrapper + section,
                    .carousel-mobile-wrapper ~ section {
                        margin-top: -2rem !important; /* Pull services section up */
                        padding-top: 0 !important;
                    }
                    
                    /* Target motion.div wrapper if it has spacing */
                    .carousel-mobile-wrapper.motion-div,
                    .carousel-mobile-wrapper[class*="motion"] {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Ensure section elements have no default margins */
                    section {
                        margin-top: 0 !important;
                    }
                    
                    /* Specifically target the gap between hero and services */
                    section.bg-\\[\\#F5F5F5\\] {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    /* Make sure services section starts right after hero */
                    section.mobile-services-section:first-of-type,
                    section.bg-white.mobile-services-section {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }
                    
                    /* Remove padding from services section inner container */
                    section.mobile-services-section > div {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }
                }
                
                /* Make menu button and email button smaller in mobile and position at corners */
                @media (max-width: 1279px) {
                    .mobile-menu-button {
                        padding: 0.375rem 0.75rem !important;
                        font-size: 0.625rem !important;
                        top: 0.25cm !important;
                        right: 0.25cm !important;
                    }
                    
                    .mobile-email-button {
                        padding: 0.375rem 0.75rem !important;
                        font-size: 0.625rem !important;
                        top: 0.25cm !important;
                        left: 0.25cm !important;
                    }
                    
                    .mobile-email-button span {
                        font-size: 0.625rem !important;
                    }
                }
                
                /* Move "Hey, I'm Harsh" paragraph 1cm down in mobile */
                @media (max-width: 1279px) {
                    .mobile-hey-harsh {
                        margin-top: 1.5cm !important;
                    }
                }
                
                /* Shift photo more to left and stick to top in mobile */
                @media (max-width: 1279px) {
                    .mobile-hero-container {
                        padding-top: 0 !important;
                    }
                    
                    .mobile-hero-content {
                        position: relative !important;
                        align-items: flex-start !important;
                        overflow: visible !important;
                    }
                    
                    .mobile-hero-container {
                        overflow: visible !important;
                    }
                    
                    .mobile-photo-left {
                        margin-left: 0 !important;
                        transform: translateX(-2cm) !important;
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                        align-self: flex-start !important;
                        position: relative !important;
                    }
                    
                    .mobile-photo-left .mobile-photo-container {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                        height: 6cm !important;
                        max-height: 6cm !important;
                        aspect-ratio: auto !important;
                        border-radius: 0 0 1cm 1cm !important; /* U-shape: rounded bottom corners */
                    }
                    
                    .mobile-photo-left .mobile-photo-container > div {
                        height: 6cm !important;
                        max-height: 6cm !important;
                    }
                }
                
                /* Make menu bar full width and smaller in mobile */
                @media (max-width: 1279px) {
                    .mobile-menu-bar {
                        width: 100vw !important;
                        max-width: 100vw !important;
                        padding-top: 0.2rem !important;
                        padding-bottom: 0.2rem !important;
                        margin-left: calc(-50vw + 50%) !important;
                        margin-right: calc(-50vw + 50%) !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        position: relative !important;
                    }
                    
                    /* Ensure parent container doesn't limit width */
                    .mobile-hero-container .mobile-menu-bar {
                        width: 100vw !important;
                        margin-left: calc(-50vw + 50%) !important;
                        margin-right: calc(-50vw + 50%) !important;
                    }
                }
                
                /* Add 0.5cm gap between menu items and social carousel in mobile */
                @media (max-width: 1279px) {
                    .mobile-carousel-gap {
                        margin-top: 0.5cm !important;
                    }
                }
                
                /* Make description text display in 3 lines on mobile */
                @media (max-width: 1279px) {
                    .mobile-description {
                        display: block !important;
                        line-height: 1.4 !important;
                        max-width: 100% !important;
                    }
                    
                    .mobile-description span {
                        display: block !important;
                    }
                }
                
                /* Make service cards smaller in mobile */
                @media (max-width: 1279px) {
                    .service-card-wrapper-mobile {
                        min-height: 200px !important;
                    }
                    
                    .service-card-mobile {
                        min-height: 180px !important;
                    }
                    
                    .service-card-mobile .service-icon-mobile svg {
                        width: 2.5rem !important;
                        height: 2.5rem !important;
                    }
                }
                
                /* Fix overlapping between Skills and LeetCode Dashboard in mobile */
                @media (max-width: 1279px) {
                    .mobile-skills-section {
                        padding-bottom: 1rem !important;
                    }
                    
                    .mobile-skills-section #skills {
                        padding-bottom: 2rem !important;
                        max-height: none !important;
                    }
                    
                    .mobile-leetcode-spacing {
                        margin-top: 3rem !important;
                        padding-top: 2rem !important;
                    }
                    
                    .mobile-leetcode-container {
                        padding-top: 1rem !important;
                        min-height: auto !important;
                    }
                }
            `}</style>

            {/* Social Media Carousel - Desktop */}
            <motion.div 
                className="hidden xl:block relative z-10 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <SocialCarousel />
            </motion.div>

            {/* Services Section - WHAT I'M OFFERING */}
            <section className="relative bg-white py-2 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8 mobile-services-section">
                <div className="max-w-7xl mx-auto">
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
                        {/* Left Side */}
                        <div className="flex-1">
                            <div className="mb-2">
                                <div className="w-12 h-0.5 bg-black mb-4"></div>
                                <p className={`text-black uppercase text-xs md:text-sm tracking-[0.2em] mb-4 ${spaceGrotesk.className}`}>
                                    MY SERVICES?
                                </p>
                            </div>
                            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight ${spaceGrotesk.className}`}>
                                WHAT I&apos;M<br />OFFERING
                            </h2>
                        </div>

                        {/* Right Side - Content and Button */}
                        <div className="flex-1 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
                            <p className={`text-black text-sm md:text-base max-w-md ${spaceGrotesk.className}`} style={{ 
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
                            </p>
                            <ParticleButton className="bg-black text-white px-6 py-3 uppercase text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 cursor-pointer">
                                ALL SERVICE
                            </ParticleButton>
                        </div>
                    </div>

                    {/* Service Cards with Scroll Indicator */}
                    <div className="relative">
                        {/* Scroll Down Indicator - Left Side - Hidden on mobile, visible on desktop */}
                        <div className="hidden md:flex absolute left-0 top-0 flex-col items-center z-10">
                            <div className="flex flex-col items-center">
                                <span className={`text-black uppercase text-[10px] md:text-xs tracking-[0.3em] ${spaceGrotesk.className}`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                    SCROLL DOWN
                                </span>
                                <div className="w-0.5 h-24 md:h-32 bg-black mt-3 md:mt-4"></div>
                                <button 
                                    onClick={() => {
                                        const caseStudySection = document.getElementById('case-study');
                                        if (caseStudySection) {
                                            caseStudySection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center mt-3 md:mt-4 hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Service Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:ml-20">
                        {/* Web Development Card */}
                        <ServiceCard
                            title="WEB DEVELOPMENT"
                            icon={
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            }
                            index={0}
                            onReadMore={() => setOpenModal('WEB DEVELOPMENT')}
                        />

                        {/* App Development Card */}
                        <ServiceCard
                            title="APP DEVELOPMENT"
                            icon={
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            }
                            index={1}
                            onReadMore={() => setOpenModal('APP DEVELOPMENT')}
                        />

                        {/* Visual Graphic Design Card */}
                        <ServiceCard
                            title="VISUAL GRAPHIC DESIGN"
                            icon={
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            }
                            index={2}
                            onReadMore={() => setOpenModal('VISUAL GRAPHIC DESIGN')}
                        />
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="about">
                <ExperienceTimeline/>
            </section>
            
            {/* Case Study Section */}
            <section id="case-study">
                <PortfolioGrid/>
            </section>
            
            <section id="skills" className="mobile-skills-section">
                <Skills />
                <div className="mobile-leetcode-spacing">
                    <LeetCodeDashboard/>
                </div>
            </section>
            
            <section id="certifications">
                <CertificationsCarousel/>
            </section>
            
            {/* Book Promotion Section */}
            <section className="relative bg-white py-16 md:py-24 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        {/* Text Content */}
                        <motion.div 
                            className="max-w-xl text-black"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black ${spaceGrotesk.className}`}>
                                Get Your Copy of The MERN Stack Alchemist
                            </h2>
                            <p className={`text-base md:text-lg text-gray-700 mb-8 leading-relaxed ${spaceGrotesk.className}`}>
                                Learn how to build full-stack apps using the MERN stack with real-world projects.
                                Start your journey from zero to FAANG-ready with this beginner-friendly guide.
                            </p>
                            <ParticleButton 
                                onClick={() => router.push('/books')}
                                className="bg-black text-white px-8 py-4 uppercase text-sm md:text-base font-semibold border-2 border-black"
                            >
                                <span className={`${spaceGrotesk.className} flex items-center gap-2`}>
                                    Order Now - Limited Time Offer
                                    <FaArrowRight className="text-sm" />
                                </span>
                            </ParticleButton>
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
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                            <motion.div 
                                className="absolute inset-0 border-2 border-black pointer-events-none opacity-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.2 }}
                                transition={{ 
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 2
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <TestimonialFooter/>

            {/* Service Modals */}
            {openModal && (
                <ServiceModal
                    isOpen={!!openModal}
                    onClose={() => setOpenModal(null)}
                    serviceTitle={openModal}
                    content={serviceContents[openModal as keyof typeof serviceContents] || ''}
                />
            )}
        </>
    );
}

