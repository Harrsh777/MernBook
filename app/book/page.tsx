'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';
import { FaAmazon, FaArrowRight } from 'react-icons/fa';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Particle Button Component
const ParticleButton = ({ children, href, className }: { 
  children: React.ReactNode; 
  href: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative overflow-hidden rounded-full border-2 border-black ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Particles Background */}
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
    </motion.a>
  );
};

export default function BookPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const bookDescription = "The MERN Stack Alchemist is a comprehensive guide to mastering the MERN stack and cracking FAANG interviews. This practical guide delves into building real-world projects, exploring production best practices, and interview preparation. It offers a rich collection of hands-on examples that present a compelling case for becoming a job-ready full-stack developer.";

  const discoverText = "The MERN Stack—MongoDB, Express, React, and Node.js—has become the foundation of modern web development, with increasing appeal to developers looking to build scalable applications. The demand for full-stack developers, chronic skill gaps in traditional education, and the need for practical project experience are pushing millions of developers in a more hands-on direction. Challenging the notion of theoretical-only learning, the book advocates instead for a project-first approach built on real-world experience and practical skills. More than just a book, it is a call to action for those who believe in building their way to success and the importance of hands-on learning.";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section - Split Layout: Black Left, White Right with Book Cover */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Black Background */}
        <div className="relative bg-black text-white w-full lg:w-1/2 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 lg:pl-12 xl:pl-16 overflow-hidden">
          {/* Decorative background element - subtle pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-5">
            <div className="w-full h-full border-2 border-white rotate-45"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center">
            {/* Logo/Title Section */}
            <motion.div 
              className="mb-8 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`text-2xl md:text-3xl font-bold uppercase ${spaceGrotesk.className}`}>
                HARSH SRIVASTAVA
              </h1>
            </motion.div>

            {/* Book Title */}
            <motion.div 
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 ${spaceGrotesk.className}`}>
                The MERN Stack Alchemist
              </h2>
              <p className={`text-xl md:text-2xl lg:text-3xl italic ${spaceGrotesk.className}`}>
                Master MERN to Crack FAANG
              </p>
            </motion.div>

            {/* Author Section with Large Image */}
            <motion.div 
              className="flex items-start gap-6 md:gap-8 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Large Author Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src="/author.jpeg"
                    alt="Harsh Srivastava"
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                
                {/* Particles around image on hover */}
                {isHovered && (
                  <motion.div 
                    className="absolute inset-0 overflow-visible pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {particles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                          backgroundColor: '#9CA3AF',
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          left: `${50 + (particle.x - 50) * 1.5}%`,
                          top: `${50 + (particle.y - 50) * 1.5}%`,
                        }}
                        animate={{
                          opacity: [0, particle.opacity, particle.opacity * 0.7, 0],
                          scale: [0, 1, 1, 0],
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
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
              </motion.div>
              <div className="flex-1">
                <motion.p 
                  className={`text-lg md:text-xl lg:text-2xl ${spaceGrotesk.className}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  By <span className="font-bold border-b-2 border-white pb-1">Harsh Srivastava</span>
                </motion.p>
              </div>
            </motion.div>

            {/* Book Description */}
            <motion.p 
              className={`text-sm md:text-base lg:text-lg leading-relaxed text-gray-300 ${spaceGrotesk.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {bookDescription}
            </motion.p>
          </div>
        </div>

        {/* Right Panel - White Background with Book Cover */}
        <div className="relative bg-white w-full lg:w-1/2 flex items-center justify-center py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 lg:pr-12 xl:pr-16">
          <motion.div
            className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl"
            initial={{ opacity: 0, x: 30, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              rotateX: 2
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <Image
              src="/1.png"
              alt="The MERN Stack Alchemist Book Cover"
              width={600}
              height={900}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gray-200/30 blur-3xl"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Middle Section - Purchase Buttons (Light Grey Background) */}
      <section className="bg-gray-100 py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            {/* Left - Purchase Text */}
            <motion.h3 
              className={`text-2xl md:text-3xl lg:text-4xl font-bold text-black italic ${spaceGrotesk.className}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Purchase the Book
            </motion.h3>
            
            {/* Right - Purchase Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              {/* Amazon Button */}
              <ParticleButton
                href="https://www.amazon.com"
                className="flex items-center gap-3 bg-black text-white px-6 md:px-8 py-4 font-semibold text-sm md:text-base w-full sm:w-auto justify-center"
              >
                <FaAmazon className="text-2xl" />
                <span className={spaceGrotesk.className}>Amazon</span>
              </ParticleButton>

              {/* Barnes & Noble Button */}
              <ParticleButton
                href="https://www.barnesandnoble.com"
                className="flex items-center gap-3 bg-black text-white px-6 md:px-8 py-4 font-semibold text-sm md:text-base w-full sm:w-auto justify-center"
              >
                <span className={`text-2xl font-bold ${spaceGrotesk.className}`}>BN</span>
                <span className={spaceGrotesk.className}>Barnes & Noble</span>
              </ParticleButton>

              {/* Books-A-Million Button */}
              <ParticleButton
                href="https://www.booksamillion.com"
                className="flex items-center gap-3 bg-black text-white px-6 md:px-8 py-4 font-semibold text-sm md:text-base w-full sm:w-auto justify-center"
              >
                <span className={`text-2xl font-bold ${spaceGrotesk.className}`}>BAM!</span>
                <span className={spaceGrotesk.className}>Books-A-Million</span>
              </ParticleButton>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Discover the Principles */}
      <section className="bg-white py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left - Book Covers (Stacked with Interactive Effects) */}
            <motion.div 
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-full max-w-sm md:max-w-md">
                {/* Front Book */}
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotate: -2, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                >
                  <Image
                    src="/1.png"
                    alt="The MERN Stack Alchemist Front Cover"
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain shadow-2xl"
                  />
                </motion.div>
                
                {/* Back Book (Partially Visible) */}
                <motion.div
                  className="absolute top-0 left-0 w-full opacity-80 -z-10"
                  initial={{ opacity: 0, x: -30, rotate: -8, scale: 0.9 }}
                  whileInView={{ opacity: 0.8, x: -15, rotate: -5, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ opacity: 1, x: -10, rotate: -3 }}
                  style={{ transform: 'translateX(-15%) translateY(5%)' }}
                >
                  <Image
                    src="/2.png"
                    alt="The MERN Stack Alchemist Back Cover"
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right - Discover Text */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h3 
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-black ${spaceGrotesk.className}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Discover the Principles of MERN Stack Development
              </motion.h3>
              
              <div className="space-y-4">
                <motion.p 
                  className={`text-base md:text-lg leading-relaxed text-gray-700 ${spaceGrotesk.className}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {discoverText.split('. ')[0] + '.'}
                </motion.p>
                <motion.p 
                  className={`text-base md:text-lg leading-relaxed text-gray-700 ${spaceGrotesk.className}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {discoverText.split('. ').slice(1).join('. ')}
                </motion.p>
              </div>

              {/* Interactive CTA Button */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ParticleButton
                  href="https://www.amazon.com"
                  className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-semibold text-base md:text-lg"
                >
                  <span className={spaceGrotesk.className}>Get Your Copy</span>
                  <FaArrowRight className="text-lg" />
                </ParticleButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
