"use client"

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaSearchPlus, FaSearchMinus, FaEye, FaUser, FaFilePdf, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ResumePage() {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Harsh_Resume.pdf';
    link.download = 'Harsh_Srivastava_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <FaUser className="text-2xl text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-white">Harsh Srivastava</h2>
                <p className="text-gray-300 text-sm mt-1">Full Stack Developer</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm truncate">Harrshh077@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm">+91 8840521990</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm">India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-700/50">
                <button className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                  <FaLinkedin className="text-blue-400" />
                </button>
                <button className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                  <FaGithub className="text-white" />
                </button>
                <button className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                  <FaFilePdf className="text-red-400" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">At a Glance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Experience</span>
                    <span>2+ Years</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Skills</span>
                    <span>Expert</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Projects</span>
                    <span>15+</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <motion.div
              className="mb-4" 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"> {/* Reduced from mb-6 to mb-4 */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Professional Resume
                  </h1>
                  <p className="text-gray-300 mt-2">Interactive digital resume</p>
                </div>
                
                {/* Control Buttons */}
                <motion.div
                  className="flex items-center gap-2 flex-wrap"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-105"
                      title="Zoom Out"
                    >
                      <FaSearchMinus />
                    </button>
                    
                    <span className="px-2 text-white text-sm font-medium min-w-[50px] text-center">
                      {zoom}%
                    </span>
                    
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-105"
                      title="Zoom In"
                    >
                      <FaSearchPlus />
                    </button>
                  </div>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <FaEye />
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <FaDownload />
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                </motion.div>
              </div>

              {/* Sarcastic Comment - Reduced padding and margin */}
              <motion.div
                className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm mb-4" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-green-300 text-center font-medium text-sm md:text-base">
                  💡 <span className="italic">"If I were you, I would hire this guy immediately!"</span> 😉
                </p>
              </motion.div>
            </motion.div>

            {/* PDF Container - Now closer to the comment */}
            <motion.div
              className={`flex-1 ${isFullscreen ? 'fixed inset-2 top-12 bg-gray-900 z-50 rounded-2xl' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-10 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                >
                  ✕ Exit Fullscreen
                </button>
              )}
              
              <div
                ref={pdfRef}
                className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${isFullscreen ? 'w-full h-full' : 'h-full'}`}
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.3s ease',
                  marginTop: '0.5cm', // Reduced from 2cm to 0.5cm
                  minHeight: '800px'
                }}
              >
                <iframe
                  src="/Harsh_Resume.pdf#toolbar=1&navpanes=0&scrollbar=1"
                  width="100%"
                  height={isFullscreen ? "100%" : "100%"}
                  className="border-0"
                  title="Harsh Srivastava Resume"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-400 text-sm">
            💼 Professional Resume • 📧 Harrshh077@gmail.com • 🌐 harshsrivastava.in
          </p>
        </motion.div>
      </div>
    </div>
  );
}