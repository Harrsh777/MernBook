'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';


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
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate effect
  useEffect(() => {
    const startAutoRotate = () => {
      intervalRef.current = setInterval(() => {
        setDirection('right');
        setActiveIndex(prev => (prev + 1) % certifications.length);
      }, 4000);
    };

    startAutoRotate();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pause on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 4000);
  };

  // Manual navigation
  const goToPrev = () => {
    setDirection('left');
    setActiveIndex(prev => (prev - 1 + certifications.length) % certifications.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 4000);
  };

  const goToNext = () => {
    setDirection('right');
    setActiveIndex(prev => (prev + 1) % certifications.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex(prev => (prev + 1) % certifications.length);
    }, 4000);
  };

  // Animation variants
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5 }
    })
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden">
      {/* Floating tech bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0, 50, 0],
              x: [0, 20, 0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
              Verified Expertise
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Industry-recognized certifications demonstrating my technical proficiency and commitment to continuous learning.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative h-[500px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Previous certification"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Next certification"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Auto-rotate indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
            <div className={`w-3 h-3 rounded-full ${isHovered ? 'bg-gray-500' : 'bg-blue-400'} transition-colors`} />
            <span className="text-xs text-gray-300">
              {isHovered ? 'Paused' : 'Auto-rotating'}
            </span>
          </div>

          {/* Animated Carousel */}
          <AnimatePresence custom={direction} initial={false}>
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
                <div className="relative w-full h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Certification content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-blue-900/20" />
                  
                  <div className="relative h-full flex flex-col md:flex-row">
                    {/* Image section */}
                    <div className="w-full md:w-2/5 h-1/2 md:h-full bg-gray-900/50 flex items-center justify-center p-8">
                      <motion.div 
                        className="relative w-full h-full"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Image
                          src={certifications[activeIndex].imageUrl}
                          alt={certifications[activeIndex].title}
                          layout="fill"
                          objectFit="contain"
                          className="drop-shadow-lg"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Details section */}
                    <div className="w-full md:w-3/5 h-1/2 md:h-full p-8 flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {certifications[activeIndex].title}
                        </h3>
                        <p className="text-lg text-blue-300 mb-4">
                          {certifications[activeIndex].issuer}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {certifications[activeIndex].skills?.map((skill) => (
                            <span 
                              key={skill}
                              className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <p className="font-medium">Issued</p>
                            <p>{certifications[activeIndex].issued}</p>
                          </div>
                          {certifications[activeIndex].expires && (
                            <div>
                              <p className="font-medium">Expires</p>
                              <p>{certifications[activeIndex].expires}</p>
                            </div>
                          )}
                          {certifications[activeIndex].credentialId && (
                            <div className="col-span-2">
                              <p className="font-medium">Credential ID</p>
                              <p className="font-mono text-blue-300">
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
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 'right' : 'left');
                  setActiveIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to certification ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsCarousel;