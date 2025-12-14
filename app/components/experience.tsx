'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type ExperienceItem = {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  timeRange: string;
  duration: string;
};

const ExperienceTimeline = () => {

  const experiences: ExperienceItem[] = [
    {
      id: 1,
      jobTitle: 'Full Stack Developer Intern',
      company: 'BUILD AI ENGINE',
      location: 'India',
      timeRange: 'Mar 2025 – Present',
      duration: '1 YEAR',
    },
    {
      id: 2,
      jobTitle: 'Software Engineer Intern',
      company: 'MyTripGoal',
      location: 'India',
      timeRange: 'Dec 2024 – Mar 2025',
      duration: '4 MONTHS',
    },
    {
      id: 3,
      jobTitle: 'Cyber Security Intern',
      company: 'MP Police',
      location: 'India',
      timeRange: 'Dec 2024 – Mar 2025',
      duration: '4 MONTHS',
    },
    {
      id: 4,
      jobTitle: 'Full Stack Developer Intern',
      company: 'FlatPur',
      location: 'India',
      timeRange: 'Aug 2024 – Oct 2024',
      duration: '3 MONTHS',
    },
  ];

  // Experience Card Component with Particles
  const ExperienceCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
    const [localHovered, setLocalHovered] = useState(false);
    const isFirst = index === 0;
    // First card is always black, others only when hovered
    const isBlack = isFirst || localHovered;

    useEffect(() => {
      if (localHovered || isFirst) {
        // Generate particles for hover effect - grey particles (more visible)
        const newParticles = Array.from({ length: 120 }).map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2.5 + 1.5, // Larger particles (1.5-4px)
          opacity: Math.random() * 0.8 + 0.5 // More visible (0.5-1.3, capped at 1)
        }));
        setParticles(newParticles);
      } else {
        setParticles([]);
      }
    }, [localHovered, isFirst]);

    // Smooth transition configuration - enhanced for smoother animations
    const smoothTransition = {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for ultra-smooth transitions
    };

    return (
      <motion.div
        className="relative mb-4 cursor-pointer"
        onMouseEnter={() => {
          // Don't set hover state for first card
          if (!isFirst) {
            setLocalHovered(true);
          }
        }}
        onMouseLeave={() => {
          // Only clear hover if not first card
          if (!isFirst) {
            setLocalHovered(false);
          }
        }}
      >
        {/* Numbered Square - Overlapping on left */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center font-bold text-lg z-10"
          animate={{
            backgroundColor: isBlack ? '#FFFFFF' : '#000000',
            color: isBlack ? '#000000' : '#FFFFFF',
          }}
          transition={smoothTransition}
          style={{ willChange: 'background-color, color' }}
        >
          {exp.id}
        </motion.div>

        {/* Card */}
        <motion.div
          className="relative overflow-hidden border-2 border-black cursor-pointer"
          style={{ marginLeft: '24px', minHeight: '120px', willChange: 'background-color' }}
          initial={false}
          onMouseEnter={() => {
            if (!isFirst) {
              setLocalHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (!isFirst) {
              setLocalHovered(false);
            }
          }}
          animate={{
            backgroundColor: isBlack ? '#000000' : '#FFFFFF',
          }}
          transition={smoothTransition}
        >
          {/* Particles Background - Only visible when black */}
          {(localHovered || isFirst) && (
            <motion.div 
              className="absolute inset-0 overflow-hidden pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: '#9CA3AF', // Grey-400 color
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    willChange: 'transform, opacity'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, Math.min(particle.opacity, 1), Math.min(particle.opacity * 0.7, 1), 0],
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

          {/* Card Content */}
          <motion.div 
            className="relative z-10 p-6 md:p-8 flex items-center justify-between pointer-events-auto"
            onMouseEnter={() => {
              if (!isFirst) {
                setLocalHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (!isFirst) {
                setLocalHovered(false);
              }
            }}
            animate={{
              color: isBlack ? '#FFFFFF' : '#000000',
            }}
            transition={smoothTransition}
            style={{ willChange: 'color' }}
          >
            {/* Left: Job Title and Company */}
            <div className="flex-1">
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${spaceGrotesk.className}`}>
                {exp.jobTitle}
              </h3>
              <p className={`text-sm md:text-base ${spaceGrotesk.className}`}>
                {exp.company} - {exp.location}
              </p>
            </div>

            {/* Vertical Divider */}
            <motion.div 
              className="w-px h-16 mx-6"
              animate={{
                backgroundColor: isBlack ? '#FFFFFF' : '#000000',
              }}
              transition={smoothTransition}
              style={{ willChange: 'background-color' }}
            ></motion.div>

            {/* Right: Job Duration */}
            <div className="text-right">
              <p className={`text-sm md:text-base font-semibold uppercase ${spaceGrotesk.className}`}>
                JOB DURATION - {exp.duration}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section className="relative bg-white py-16 md:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-12 md:mb-16">
          {/* Top Center Icon - Circular with glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-black relative">
              <div className="absolute inset-0 rounded-full bg-white opacity-50 blur-md"></div>
            </div>
          </div>

          {/* Top Right Graphic - Circular with diagonal lines */}
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

          {/* Main Title */}
          <div className="text-center mt-8">
            <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-6 ${spaceGrotesk.className}`}>
              EXPERIENCE
            </h2>
            
            {/* Subtitle */}
            <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${spaceGrotesk.className}`} style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              Building scalable applications and solving complex problems across full-stack development, cybersecurity, and software engineering.
            </p>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;