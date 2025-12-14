'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const certifications = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services (AWS)",
    issued: "Nov 2024",
    expires: "Nov 2027",
    skills: [
      "AWS Lambda", "Cloud Infrastructure", "Amazon EBS", "Amazon EC2", "Amazon SQS", "SaaS", "Amazon S3",
      "Scalable Architecture", "Disaster Recovery", "Cloud Security"
    ],
    imageUrl: "/aws.png"
  },
  {
    id: 2,
    title: "Hackbyte 3.0",
    issuer: "IIITDM Jabalpur",
    issued: "Apr 2025",
    skills: [
      "Competitive Programming", "Team Collaboration", "System Design", "Web Development", "REST APIs"
    ],
    imageUrl: "/hack.png"
  },
  {
    id: 3,
    title: "AI in Production: Kubernetes for LLM Deployment",
    issuer: "IJFMR",
    issued: "Jan 2025",
    skills: [
      "Large Language Models", "MLOps", "Kubernetes", "Model Deployment", "Scalability", "Docker", "Inference Optimization"
    ],
    imageUrl: "/ijfmr.png"
  },
  {
    id: 4,
    title: "Hack4Health Hackathon",
    issuer: "VIT Bhopal",
    issued: "Dec 2024",
    skills: [
      "Healthcare AI", "Problem Solving", "Rapid Prototyping", "React", "Node.js", "Pitching"
    ],
    imageUrl: "/hack.png"
  },
  {
    id: 5,
    title: "Cyber Security Basics",
    issuer: "Great Learning",
    issued: "Nov 2024",
    skills: [
      "Cybersecurity", "Ethical Hacking", "OWASP Top 10", "Network Security", "Incident Response"
    ],
    imageUrl: "/cyber.png"
  },
  {
    id: 6,
    title: "Linux Essentials",
    issuer: "Great Learning",
    issued: "Nov 2024",
    skills: [
      "Linux System Administration", "Shell Scripting", "Cron Jobs", "File Permissions", "Networking"
    ],
    imageUrl: "/linux.png"
  },
  {
    id: 7,
    title: "UI/UX Design Basics",
    issuer: "UniAthena",
    issued: "Nov 2024",
    skills: [
      "UI/UX", "Front-End Development", "User Interface Design", "Figma", "Wireframing", "User Testing"
    ],
    imageUrl: "/ui.jpeg"
  },
  {
    id: 8,
    title: "DevOps",
    issuer: "Intellipaat",
    issued: "Sep 2024",
    credentialId: "31679-1655-194105",
    skills: [
      "DevOps", "Kubernetes", "CI/CD", "Jenkins", "Docker", "Infrastructure as Code", "Monitoring", "GitOps"
    ],
    imageUrl: "/devops.png"
  },
  {
    id: 9,
    title: "JavaScript Expert",
    issuer: "Udemy",
    issued: "Sep 2024",
    credentialId: "UC-b2038564-866d-4b80-9237-4458f06fb05c",
    skills: [
      "JavaScript", "Async/Await", "DOM Manipulation", "Event Loop", "Functional Programming", "ES6+"
    ],
    imageUrl: "/javascript.jpeg"
  },
  {
    id: 10,
    title: "SQL Advanced",
    issuer: "HackerRank",
    issued: "Sep 2024",
    skills: [
      "SQL", "Window Functions", "Joins", "Indexing", "Query Optimization", "Database Design"
    ],
    imageUrl: "/sql.jpeg"
  },
  {
    id: 11,
    title: "Google Cloud Professional Architect",
    issuer: "Udemy",
    issued: "Aug 2024",
    credentialId: "UC-5a49ff2e-5e80-4c8b-a306-2f7d5234d60e",
    skills: [
      "Google Cloud", "BigQuery", "Cloud SQL", "GKE", "Cloud Architecture", "Load Balancing", "IAM"
    ],
    imageUrl: "/gcp.jpeg"
  },
  {
    id: 12,
    title: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    issued: "Aug 2024",
    skills: [
      "Azure Fundamentals", "Azure AD", "ARM Templates", "Virtual Machines", "Azure Functions"
    ],
    imageUrl: "/microsoft.png"
  },
  {
    id: 13,
    title: "MongoDB",
    issuer: "Udemy",
    issued: "Aug 2024",
    skills: [
      "Databases", "MongoDB", "Aggregation Pipeline", "Schema Design", "NoSQL", "Mongoose"
    ],
    imageUrl: "/mongo.png"
  },
  {
    id: 14,
    title: "Machine Learning From Basic To Advanced",
    issuer: "Udemy",
    issued: "Jul 2024",
    credentialId: "UC-414bed86-cdf4-4e82-bb85-6892add80e81",
    skills: [
      "Machine Learning", "Scikit-Learn", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"
    ],
    imageUrl: "/ml.png"
  },
  {
    id: 15,
    title: "Problem Solving (Intermediate)",
    issuer: "HackerRank",
    issued: "May 2024",
    credentialId: "B134E0CD2631",
    skills: [
      "Data Structures", "Algorithms", "Dynamic Programming", "Greedy Algorithms", "Problem Solving"
    ],
    imageUrl: "/prob.jpeg"
  },
  {
    id: 16,
    title: "SolVIT",
    issuer: "VIT Bhopal",
    issued: "Mar 2025",
    skills: [
      "Team Collaboration", "Frontend Engineering", "Pitching Ideas", "Rapid Development", "Design Thinking"
    ],
    imageUrl: "/a.jpg"
  }
];

const CertificationsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate effect
  useEffect(() => {
    const startAutoRotate = () => {
      intervalRef.current = setInterval(() => {
        setDirection('right');
        setActiveIndex(prev => (prev + 1) % certifications.length);
      }, 5000);
    };

    startAutoRotate();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pause on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 5000);
  };

  // Manual navigation
  const goToPrev = () => {
    setDirection('left');
    setActiveIndex(prev => (prev - 1 + certifications.length) % certifications.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 5000);
  };

  const goToNext = () => {
    setDirection('right');
    setActiveIndex(prev => (prev + 1) % certifications.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 5000);
  };

  // Smoother animation variants
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <section className="relative bg-white py-16 md:py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 border-2 border-gray-200 rotate-45 opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 md:w-32 md:h-32 border-2 border-gray-200 rotate-12 opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Top Center Icon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>

          {/* Top Right Graphic */}
          <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((i * Math.PI) / 4)}
                  y2={50 + 40 * Math.sin((i * Math.PI) / 4)}
                  stroke="black"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div className="mt-12">
            <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-6 ${spaceGrotesk.className}`}>
              CERTIFICATIONS
            </h2>
            <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-gray-600 ${spaceGrotesk.className}`} style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              Industry-recognized certifications demonstrating my technical proficiency and commitment to continuous learning.
            </p>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative h-[450px] md:h-[500px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <motion.button 
            onClick={goToPrev}
            className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white border-2 border-black rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-black hover:text-white ${spaceGrotesk.className}`}
            aria-label="Previous certification"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button 
            onClick={goToNext}
            className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white border-2 border-black rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-black hover:text-white ${spaceGrotesk.className}`}
            aria-label="Next certification"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Animated Carousel */}
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full max-w-4xl h-full">
                <div className="relative w-full h-full bg-white border-2 border-black overflow-hidden">
                  {/* Certification content */}
                  <div className="relative h-full flex flex-col md:flex-row">
                    {/* Image section */}
                    <div className="w-full md:w-2/5 h-1/2 md:h-full bg-gray-50 flex items-center justify-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
                      <motion.div 
                        className="relative w-full h-full"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <Image
                          src={certifications[activeIndex].imageUrl}
                          alt={certifications[activeIndex].title}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Details section */}
                    <div className="w-full md:w-3/5 h-1/2 md:h-full p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="space-y-4"
                      >
                        <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 ${spaceGrotesk.className}`}>
                          {certifications[activeIndex].title}
                        </h3>
                        <p className={`text-lg md:text-xl text-gray-700 mb-6 ${spaceGrotesk.className}`}>
                          {certifications[activeIndex].issuer}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {certifications[activeIndex].skills?.slice(0, 6).map((skill) => (
                            <span 
                              key={skill}
                              className={`px-3 py-1 bg-white border-2 border-black text-sm text-black ${spaceGrotesk.className}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className={`grid grid-cols-2 gap-4 text-sm ${spaceGrotesk.className}`}>
                          <div>
                            <p className="font-semibold text-black mb-1">Issued</p>
                            <p className="text-gray-700">{certifications[activeIndex].issued}</p>
                          </div>
                          {certifications[activeIndex].expires && (
                            <div>
                              <p className="font-semibold text-black mb-1">Expires</p>
                              <p className="text-gray-700">{certifications[activeIndex].expires}</p>
                            </div>
                          )}
                          {certifications[activeIndex].credentialId && (
                            <div className="col-span-2">
                              <p className="font-semibold text-black mb-1">Credential ID</p>
                              <p className="text-gray-700 font-mono text-xs break-all">
                                {certifications[activeIndex].credentialId}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {certifications.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 'right' : 'left');
                  setActiveIndex(index);
                }}
                className={`h-3 rounded-full transition-all ${index === activeIndex ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400 w-3'}`}
                aria-label={`Go to certification ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsCarousel;
