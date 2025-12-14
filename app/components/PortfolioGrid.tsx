'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

/* -------------------------------------------------------------------------- */
/*                               DATA SOURCE                                  */
/* -------------------------------------------------------------------------- */

const PROJECTS = [
  {
    title: 'Supply Chain Management Solutions for Distribution Firms',
    category: 'WEB DEVELOPMENT',
    imageUrl: '/sdpl.png',
    link: 'https://sdpl.vercel.app/',
    imagePosition: 'left' as const,
  },
  {
    title: 'Plotify - Real Estate Listing Platform',
    category: 'WEB DEVELOPMENT',
    imageUrl: '/plotify.png',
    link: 'https://www.theplotify.com',
    imagePosition: 'right' as const,
  },
  {
    title: 'DeployX - CI/CD Automation Platform',
    category: 'WEB DEVELOPMENT',
    imageUrl: '/deployx.png',
    link: 'https://github.com/Harrsh777/DeployX',
    imagePosition: 'left' as const,
  },
  {
    title: 'SafeSurf - Browser Extension for Real-time Phishing Protection',
    category: 'CYBERSECURITY',
    imageUrl: '/safesu.png',
    link: 'https://github.com/Harrsh777/SafeSurfJr',
    imagePosition: 'right' as const,
  },
  {
    title: 'MERN CLUB - Hackathons and Competitions Platform',
    category: 'WEB DEVELOPMENT',
    imageUrl: '/mernmatrix.png',
    link: 'https://mernclubvitb.com/',
    imagePosition: 'left' as const,
  },
  {
    title: 'Discovery Drift - Cloud Infrastructure SAAS and AI Solutions',
    category: 'WEB DEVELOPMENT',
    imageUrl: '/discovery.png',
    link: 'https://discovery-drift.vercel.app/',
    imagePosition: 'right' as const,
  },
];

/* -------------------------------------------------------------------------- */
/*                             CASE STUDY ENTRY                                */
/* -------------------------------------------------------------------------- */

const CaseStudyEntry = ({
  title,
  category,
  imageUrl,
  link,
  imagePosition,
}: {
  title: string;
  category: string;
  imageUrl: string;
  link: string;
  imagePosition: 'left' | 'right';
}) => {
  return (
    <div
      className={`flex flex-col ${
        imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
      } gap-8 md:gap-12 items-center`}
    >
      {/* Image */}
      <div className="flex-1 w-full">
        <motion.div
          className="relative overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <span className="inline-block bg-black text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold uppercase mb-4 w-fit">
          {category}
        </span>

        <h3
          className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 ${spaceGrotesk.className}`}
        >
          {title}.
        </h3>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-black hover:opacity-70 transition-opacity group"
        >
          <span className="underline font-semibold">See Details</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17l9.2-9.2M17 8v9m-9-9h9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN SECTION                                  */
/* -------------------------------------------------------------------------- */

const PortfolioGrid = () => {
  const [projects, setProjects] = useState(PROJECTS);

  // Rotate projects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects((prev) => [...prev.slice(1), prev[0]]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="projects"
      className="relative bg-white py-16 md:py-24 px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-16 md:mb-20 text-center">
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-6 ${spaceGrotesk.className}`}
          >
            Case Study
          </h2>

          <p className="text-sm md:text-base max-w-2xl mx-auto text-gray-600">
            A curated selection of production-grade systems, platforms, and
            experiments built with precision and purpose.
          </p>
        </div>

        {/* FIXED HEIGHT STACK (NO PAGE SHIFT) */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '950px',
            isolation: 'isolate',
            contain: 'layout style paint',
          }}
        >
          <AnimatePresence mode="popLayout">
            {projects.slice(0, 3).map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-12 md:mb-16"
              >
                <CaseStudyEntry {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 md:mt-20">
          <motion.a
            href="https://github.com/Harrsh777"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-6 py-3 rounded-full uppercase text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show Full Portfolio
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
