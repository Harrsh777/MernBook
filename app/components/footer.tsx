'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiMail, FiPhone, FiMapPin, FiTwitter, FiGithub, FiLinkedin, FiDribbble } from 'react-icons/fi';

const TestimonialFooter = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  
  // Floating particles effect
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3
  }));

  // Handle cursor position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Social media links data
  const socialLinks = [
    { icon: <FiTwitter />, name: 'twitter', url: '#' },
    { icon: <FiGithub />, name: 'github', url: '#' },
    { icon: <FiLinkedin />, name: 'linkedin', url: '#' },
    { icon: <FiDribbble />, name: 'dribbble', url: '#' }
  ];

  // Footer navigation links
  const navLinks = ['Templates', 'Tools', 'Features', 'About Us'];

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, particle.size * 10],
              x: [particle.x, particle.x + (Math.random() * 20 - 10)]
            }}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="absolute rounded-full bg-indigo-500"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `-${particle.size}px`
            }}
          />
        ))}
      </div>

      {/* Interactive cursor follower */}
      <AnimatePresence>
        {isHoveringButton && (
          <motion.div
            className="fixed pointer-events-none h-64 w-64 rounded-full bg-indigo-900/20 backdrop-blur-sm z-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPosition.x - 128,
              y: cursorPosition.y - 128
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          />
        )}
      </AnimatePresence>

      <footer className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header with CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8"
        >
          <div>
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Let&apos;s Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Something</span> Amazing
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Ready to bring your vision to life? Let&apos;s collaborate and create something extraordinary together.
            </motion.p>
          </div>

          <motion.button
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-full font-medium flex items-center gap-3 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <span className="relative z-10">Get In Touch</span>
          <Link href="/contact" className="cursor-pointer">
  <motion.span
    className="relative z-10"
    animate={{ x: [0, 6, 0] }}
    transition={{ repeat: Infinity, duration: 1.5 }}
  >
    👉
  </motion.span>
</Link>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>
        </motion.div>

        {/* Columns */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {/* Column 1 - Brand */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1] 
                }
              }
            }}
          >
            <motion.div 
              className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg mb-6 flex items-center justify-center text-white text-xl"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              HS
            </motion.div>
            <motion.p 
              className="text-gray-400 mb-8 leading-relaxed"
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Crafting digital experiences that blend innovative design with cutting-edge technology.
            </motion.p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, color: '#818CF8' }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-indigo-400 text-xl transition-all"
                  onMouseEnter={() => setHoveredItem(social.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Address */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1
                }
              }
            }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-3">
              <FiMapPin className="text-indigo-400" />
              <span>Location</span>
            </h3>
            <address className="not-italic text-gray-400 space-y-3">
              <p>Shyam Nagar, Kanpur</p>
              <p>Uttar Pradesh</p>
              <p>India</p>
            </address>
          </motion.div>

          {/* Column 3 - Email */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
                }
              }
            }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-3">
              <FiMail className="text-indigo-400" />
              <span>Email</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="mailto:harrshh077@gmail.com"
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <FiArrowRight className="text-indigo-400 text-sm" />
                  harrshh077@gmail.com
                </motion.a>
              </li>
             
            </ul>
          </motion.div>

          {/* Column 4 - Phone */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }
              }
            }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-3">
              <FiPhone className="text-indigo-400" />
              <span>Contact</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="tel:+918707806698"
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <FiArrowRight className="text-indigo-400 text-sm" />
                  +91 8707806698
                </motion.a>
              </li>
              
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.p 
            className="text-gray-500 text-sm"
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Harsh Srivastava. All rights reserved.
          </motion.p>
          
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {navLinks.map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ 
                  color: '#818CF8',
                  x: 3
                }}
                className="text-gray-400 hover:text-indigo-400 text-sm transition-colors relative"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item}
                {hoveredItem === item && (
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500"
                    layoutId="footerNavUnderline"
                    transition={{ type: 'spring', bounce: 0.25 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      </footer>
    </div>
  );
};

export default TestimonialFooter;