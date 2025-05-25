

"use client"
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion'; // Removed unused imports
import { FaAmazon, FaBookOpen, FaGooglePlay } from "react-icons/fa";
import { SiAudible } from "react-icons/si";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  // Removed unused isHovering and setIsHovering states
  const carouselRef = useRef<HTMLDivElement>(null);
  const brands = [
    {
      icon: <FaAmazon className="text-4xl" />,
      title: "Amazon",
      desc: "Available on Amazon in both paperback and Kindle formats. Enjoy doorstep delivery or instant digital access.",
    },
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Apple Books",
      desc: "Read seamlessly on your iPhone, iPad, or Mac with Apple Books. Supports both light and dark modes for comfort.",
    },
    {
      icon: <SiAudible className="text-4xl" />,
      title: "Audible",
      desc: "Listen to the audiobook version narrated by professional voice artists. Ideal for learning on the go.",
    },
    {
      icon: <FaGooglePlay className="text-4xl" />,
      title: "Google Play Books",
      desc: "Buy or sample chapters directly on Android devices or web. Syncs across all your Google-linked devices.",
    },
  ];

  const slides = [
    "/1.png",
    "/2.png",
    "/book-sample-2.jpg",
    "/book-sample-3.jpg"
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]); // Added slides.length to dependency array

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Head>
        <title>THE MERN STACK ALCHEMIST | Harsh Srivastava</title>
        <meta name="description" content="Why didn&apos;t they teach us this in college?" /> {/* Fixed apostrophe */}
      </Head>

      {/* Hero Section */}
      <motion.section 
        className="h-screen w-full relative overflow-hidden flex flex-col md:flex-row justify-center items-center px-4 md:px-8"
      >
        {/* Enhanced Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background: "linear-gradient(135deg, #3a0ca3 0%, #000000 100%)",
          }}
        >
          {/* Floating Tech Icons Animation */}
          {["react", "node", "mongodb", "express", "javascript"].map((tech, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-4xl md:text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 50],
                rotate: [0, Math.random() * 360]
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {tech === "react" && <i className="fab fa-react"></i>}
              {tech === "node" && <i className="fab fa-node-js"></i>}
              {tech === "mongodb" && <i className="fab fa-envira"></i>}
              {tech === "express" && <span className="font-bold">E</span>}
              {tech === "javascript" && <i className="fab fa-js"></i>}
            </motion.div>
          ))}

          {/* Radial Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at center, #7209b7 0%, transparent 70%)",
            }}
          />
        </motion.div>
        
        {/* Left Column - Text Content */}
        <div className="relative z-10 w-full md:w-1/2 text-white space-y-6 px-4 md:px-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight font-bebas tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              textShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073",
            }}
          >
            THE MERN STACK ALCHEMIST
          </motion.h1>

          <motion.p 
            className="text-xl md:text-3xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Master MERN Stack with <span className="text-yellow-300">real-world projects</span> to crack <span className="font-bold">FAANG</span> &amp; top product companies.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={() => router.push('/payment')}
              className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-black text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg"
              whileHover={{ 
                y: -3,
                boxShadow: "0 10px 25px rgba(114, 9, 183, 0.5)",
                background: "linear-gradient(145deg, #3a0ca3, #000000)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Order Today - 50% OFF</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-purple-800 to-black opacity-0 hover:opacity-100 transition-opacity"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>

            <motion.button 
              className="relative text-white border-2 border-white py-4 px-8 rounded-lg overflow-hidden group"
              whileHover={{ 
                y: -3,
                boxShadow: "0 10px 20px rgba(255,255,255,0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Read Free Sample</span>
              <motion.span 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - Book Carousel (9cm x 9cm) */}
        <div className="relative z-10 w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <motion.div 
            className="relative w-[14cm] h-[14cm] max-w-[340px] max-h-[670px]"
            ref={carouselRef}
            whileHover={{ scale: 1.02 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, x: 50, rotateY: 60 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 15,
                  boxShadow: "0 25px 50px -12px rgba(114, 9, 183, 0.5)"
                }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  rotateY: 20,
                  boxShadow: "0 30px 60px -10px rgba(114, 9, 183, 0.7)"
                }}
              >
                <Image // Replaced img with Next.js Image
                  src={slides[currentSlide]}
                  alt="Book Preview"
                  width={340}
                  height={670}
                  className="w-full h-full object-cover"
                />
                <motion.div 
                  className="absolute inset-0 border-2 border-purple-400 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-purple-400 w-6' : 'bg-purple-900'}`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-purple-950 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted By The Best
          </h2>
          <div className="h-1 w-16 bg-yellow-500 mx-auto mb-12 rounded-full"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
              >
                <div className="flex justify-center mb-4 text-yellow-400">
                  {brand.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{brand.title}</h3>
                <p className="text-sm text-gray-300">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="bg-gradient-to-r from-black via-gray-900 to-purple-950 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            
            {/* AUTHOR IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-lg overflow-hidden shadow-lg border-2 border-white/10"
            >
              <Image
                src="/author.png" // replace with your image path
                alt="Author"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* AUTHOR TEXT AND STATS */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">About The Author</h2>
              <div className="h-1 w-16 bg-yellow-500 mb-6 rounded-full"></div>
              <p className="text-gray-300 text-sm md:text-base mb-8">
                I&apos;m a third-year VIT Bhopal student passionate about solving real-world problems with tech. I&apos;ve led DevOps teams, won 4 national hackathons, published research with Springer, and built revenue-generating apps using the MERN stack. This book, The MERN Stack Alchemist, distills my journey to help you become a confident, job-ready full-stack developer.
              </p>

              {/* STATS INLINE */}
              <div className="flex flex-wrap gap-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="transition transform duration-300"
                >
                  <p className="text-3xl font-extrabold text-yellow-400">01</p>
                  <p className="text-sm text-gray-300">Books Published</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="transition transform duration-300"
                >
                  <p className="text-3xl font-extrabold text-yellow-400">4.5</p>
                  <p className="text-sm text-gray-300">User Reviews</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="transition transform duration-300"
                >
                  <p className="text-3xl font-extrabold text-yellow-400">03</p>
                  <p className="text-sm text-gray-300">Best Seller Awards</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </section>

      {/* Why College Didn't Teach This Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-purple-300">
              So, Why Didn&apos;t They Teach Us This in College?
            </h2>

            <div className="bg-black/50 p-6 md:p-8 rounded-xl border border-purple-900/50">
              <p className="text-lg md:text-xl mb-6">
                Let&apos;s be honest — college is great... if your dream job is to write definitions and draw block diagrams no one&apos;s ever going to use.
              </p>
              
              <p className="text-lg md:text-xl mb-6">
                You spend four years learning about operating systems from the 90s, writing Java programs that calculate simple interest, and answering questions like &quot;Explain the types of inheritance with real-life examples.&quot; (Yes ma&apos;am, my family is multilevel too.)
              </p>

              <p className="text-lg md:text-xl mb-6 font-bold text-purple-300">
                But the moment you open a laptop and want to build a real app — like, actually build something people can use — the system crashes harder than your code with a missing semicolon.
              </p>

              <div className="my-8 p-4 border-l-4 border-yellow-400 bg-black/30">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-yellow-300">What College DID Teach You:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    How to survive on 6 hours of sleep, 2 packets of Maggi, and blind optimism
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Problem solving — like finishing a group project alone because no one else shows up
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Writing 100 lines of code the night before submission
                  </li>
                </ul>
              </div>

              <div className="my-8 p-4 border-l-4 border-purple-400 bg-black/30">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-purple-300">What College DIDN&apos;T Teach You:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    How to build a full-stack project from scratch
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    How to host it online so it doesn&apos;t live and die on localhost
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    How to win a hackathon without Googling &quot;how to make login page in HTML&quot;
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    How to answer actual job interview questions without saying &quot;Umm... we had that in 5th semester, but I don&apos;t remember&quot;
                  </li>
                </ul>
              </div>

              <p className="text-lg md:text-xl mb-6">
                That&apos;s where this book comes in. The MERN Stack Alchemist won&apos;t ask for your attendance. It doesn&apos;t care if you sat in the front row or last bench.
              </p>

              <p className="text-lg md:text-xl font-bold text-center text-purple-300 mt-10">
                &quot;Because you don&apos;t need a classroom to become a developer. You just need a laptop, some chai, and this book.&quot;
              </p>

              <p className="text-right text-lg mt-4">– Harsh Srivastava</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-black via-gray-900 to-purple-950 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Text Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">You will gain the benefits of</h2>
            <div className="h-1 w-16 bg-yellow-500 mb-8 rounded-full"></div>
            <div className="space-y-6">
              {[
                "Understanding how to build full-stack applications using MongoDB, Express, React, and Node.js — from scratch",
                "Learning how to structure and deploy real-world projects to showcase your skills",
                "Grasping how FAANG-level systems are architected and how to replicate core concepts",
                "Receiving actionable advice on cracking technical interviews and optimizing your resume for top tech companies"
              ].map((text, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 p-4 rounded-md border border-white/10 text-sm md:text-base"
                >
                  {text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: 2x2 Grid Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Image: MERN Stack Illustration */}
            <div className="bg-white p-2 rounded-md shadow-md flex items-center justify-center">
              <Image
                src="/mern-logo.png" // Replace with your MERN illustration
                alt="MERN Stack"
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            {/* Text: Real Projects */}
            <div className="flex items-center justify-center text-center">
              <div>
                <p className="font-bold text-lg">Build Real Projects</p>
                <p className="italic text-md">Portfolio-worthy work</p>
              </div>
            </div>

            {/* Text: FAANG Prep */}
            <div className="flex items-center justify-center text-center">
              <div>
                <p className="font-bold text-lg">FAANG-Focused Prep</p>
                <p className="text-md">Master core concepts</p>
              </div>
            </div>

            {/* Text: Interviews */}
            <div className="flex items-center justify-center text-center text-cyan-300 font-semibold text-lg">
              Crack interviews with hands-on, relevant experience.
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        {/* Animated Gradient Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background: "linear-gradient(135deg, #3a0ca3 0%, #000000 100%)",
          }}
        >
          {/* Floating Particles Animation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500"
              style={{
                width: Math.random() * 5 + 2 + 'px',
                height: Math.random() * 5 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 100],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>

        {/* Decorative Top Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-10 rounded-full"
          style={{ originX: 0 }}
        />

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.blockquote
            className="text-xl md:text-3xl font-medium leading-relaxed bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            &quot;You have the right to perform your actions, but not the fruits of those actions.
            Focus on your effort, not the outcome — success will follow.&quot;
          </motion.blockquote>

          {/* Author Attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-base md:text-lg text-yellow-300 font-medium"
            whileHover={{ 
              x: 5,
              textShadow: "0 0 10px rgba(234, 179, 8, 0.5)"
            }}
          >
            — Bhagavad Gita, Chapter 2, Verse 47
          </motion.div>
        </motion.div>

        {/* Animated Dotted Pattern at Bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          style={{
            backgroundImage: "radial-gradient(circle at center, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </section>

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-black to-purple-900/30">
        {/* CTA Section */}
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

        {/* Footer Bottom */}
        <motion.div 
          className="bg-black/80 border-t border-purple-900/50 py-6 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-purple-300 mb-4 md:mb-0">
              © Harsh Srivastava 2025 all rights reserved • <a href="#" className="underline hover:text-yellow-400 transition">Privacy Policy</a>
            </p>
            <div className="flex gap-6">
              {["facebook-f", "twitter", "linkedin-in"].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-white hover:text-yellow-400 text-lg transition"
                  whileHover={{ 
                    y: -3,
                    scale: 1.2
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <i className={`fab fa-${icon}`} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating Tech Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["react", "node", "mongodb", "js", "html5", "css3"].map((tech, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-4xl md:text-6xl"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                rotate: Math.random() * 360
              }}
              animate={{
                x: [null, (Math.random() - 0.5) * 50 + '%'],
                y: [null, (Math.random() - 0.5) * 50 + '%'],
                transition: {
                  duration: 20 + Math.random() * 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <i className={`fab fa-${tech}`} />
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}