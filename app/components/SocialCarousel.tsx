'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaSlack,
  FaSpotify,
} from 'react-icons/fa'
import { SiZoom, SiThreads, SiLeetcode } from 'react-icons/si'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const platforms = [
  { name: 'LinkedIn', icon: <FaLinkedin size={24} />, url: 'https://www.linkedin.com/in/harrshh' },
  { name: 'GitHub', icon: <FaGithub size={24} />, url: 'https://github.com/Harrsh777' },
  { name: 'Instagram', icon: <FaInstagram size={24} />, url: 'https://instagram.com/Harrsh077' },
  { name: 'Twitter', icon: <FaTwitter size={24} />, url: 'https://twitter.com/your-profile' },
  { name: 'Threads', icon: <SiThreads size={24} />, url: 'https://www.threads.net/@Harrsh077' },
  { name: 'Slack', icon: <FaSlack size={24} />, url: 'https://slack.com' },
  { name: 'Spotify', icon: <FaSpotify size={24} />, url: 'https://spotify.com' },
  { name: 'Zoom', icon: <SiZoom size={24} />, url: 'https://zoom.us' },
  { name: 'LeetCode', icon: <SiLeetcode size={24} />, url: 'https://leetcode.com/u/Harrshh077/' },
]

// Social Platform Card with Particle Effect
const SocialCard = ({ platform, isFirst }: { platform: typeof platforms[0]; isFirst: boolean }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([])
  const isBlack = isFirst || isHovered

  useEffect(() => {
    if (isBlack) {
      const newParticles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.5
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isBlack])

  const smoothTransition = {
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1] as const
  }

  return (
    <motion.button
      onClick={() => window.open(platform.url, '_blank')}
      className="relative overflow-hidden border-2 border-black min-w-[180px] md:min-w-[200px] h-[70px] md:h-[80px] flex items-center justify-center gap-3 px-6 cursor-pointer"
      onMouseEnter={() => {
        if (!isFirst) {
          setIsHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (!isFirst) {
          setIsHovered(false)
        }
      }}
      animate={{
        backgroundColor: isBlack ? '#000000' : '#FFFFFF',
      }}
      transition={smoothTransition}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ willChange: 'background-color' }}
    >
      {/* Particles Background - Only visible when black */}
      <AnimatePresence mode="wait">
        {isBlack && (
          <motion.div 
            key="particles"
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  willChange: 'transform, opacity'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, Math.min(particle.opacity, 1), Math.min(particle.opacity * 0.8, 1), 0],
                  scale: [0, 1, 1, 0],
                  x: [particle.x + '%', (particle.x + (Math.random() - 0.5) * 30) + '%'],
                  y: [particle.y + '%', (particle.y + (Math.random() - 0.5) * 30) + '%'],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 0.5
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        className="relative z-10"
        animate={{
          color: isBlack ? '#FFFFFF' : '#000000',
        }}
        transition={smoothTransition}
        style={{ willChange: 'color' }}
      >
        {platform.icon}
      </motion.div>

      {/* Platform Name */}
      <motion.span
        className={`relative z-10 text-sm md:text-base font-bold uppercase ${spaceGrotesk.className}`}
        animate={{
          color: isBlack ? '#FFFFFF' : '#000000',
        }}
        transition={smoothTransition}
        style={{ willChange: 'color' }}
      >
        {platform.name}
      </motion.span>
    </motion.button>
  )
}

export default function SocialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    const scrollAmount = 0.75

    const scroll = () => {
      if (!container) return
      container.scrollLeft += scrollAmount
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    const stopScroll = () => cancelAnimationFrame(animationId)
    const startScroll = () => (animationId = requestAnimationFrame(scroll))

    container.addEventListener('mouseenter', stopScroll)
    container.addEventListener('mouseleave', startScroll)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mouseenter', stopScroll)
      container.removeEventListener('mouseleave', startScroll)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden relative py-8 md:py-12 bg-white">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div
        ref={containerRef}
        className="carousel-scroll flex gap-4 md:gap-6 px-6 md:px-8 overflow-x-scroll"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {[...platforms, ...platforms].map((platform, idx) => {
          // Determine if this is the first item in the first set
          const isFirst = idx === 0
          
          return (
            <SocialCard
              key={`${platform.name}-${idx}`}
              platform={platform}
              isFirst={isFirst}
            />
          )
        })}
      </div>

      <style jsx>{`
        .carousel-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
