'use client'

import { useEffect, useRef } from 'react'
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaSlack,
  FaSpotify,
} from 'react-icons/fa'
import { SiZoom, SiThreads, SiLeetcode } from 'react-icons/si'

const platforms = [
  { name: 'LinkedIn', icon: <FaLinkedin size={28} />, url: 'https://www.linkedin.com/in/harrshh' },
  { name: 'GitHub', icon: <FaGithub size={28} />, url: 'https://github.com/Harrsh777' },
  { name: 'Instagram', icon: <FaInstagram size={28} />, url: 'https://instagram.com/Harrsh077' },
  { name: 'Twitter', icon: <FaTwitter size={28} />, url: 'https://twitter.com/your-profile' },
  { name: 'Threads', icon: <SiThreads size={28} />, url: 'https://www.threads.net/@Harrsh077' },
  { name: 'Slack', icon: <FaSlack size={28} />, url: 'https://slack.com' },
  { name: 'Spotify', icon: <FaSpotify size={28} />, url: 'https://spotify.com' },
  { name: 'Zoom', icon: <SiZoom size={28} />, url: 'https://zoom.us' },
  { name: 'LeetCode', icon: <SiLeetcode size={28} />, url: 'https://leetcode.com/u/Harrshh077/' }, // <-- New entry
]

export default function SocialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    let scrollAmount = 0.75

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
    <div className="w-full overflow-hidden relative py-6">
      <div
        ref={containerRef}
        className="carousel-scroll flex gap-8 px-6 overflow-x-scroll transition-all duration-300"
      >
        {[...platforms, ...platforms].map((platform, idx) => (
          <button
            key={idx}
            onClick={() => window.open(platform.url, '_blank')}
            className="min-w-[200px] h-[80px] bg-gray-100 hover:bg-white text-black flex items-center justify-center gap-2 font-semibold rounded-full shadow-md transition-transform hover:scale-105 duration-300"
          >
            {platform.icon}
            <span className="text-lg">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
