'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '@/lib/supabase';
import { Space_Grotesk } from 'next/font/google';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const serviceTags = [
  'Mobile App',
  'Web Design',
  'Branding',
  'UI/UX',
  'Product Strategy',
  'Development',
  'Consulting',
  'Marketing',
];

export default function LetsTalkPage() {
const [formData, setFormData] = useState({
  name: '',
  email: '',
  company: '',
  services: [] as string[],
  message: '',
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      if (prev.services.includes(service)) {
        return {
          ...prev,
          services: prev.services.filter(s => s !== service),
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, service],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }
      
      const { data, error } = await supabase
        .from('idea_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          company_name: formData.company,
          services: formData.services,
          message: formData.message,
          submitted_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;
      if (!data) throw new Error('No data returned from server');

      setSubmitSuccess(true);
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          services: [],
          message: '',
        });
        setCurrentStep(1);
      }, 3000);
    } catch (err: unknown) {
  console.error('Submission error:', err);
  setSubmitError(
    err instanceof Error 
      ? err.message 
      : 'Failed to submit. Please try again.'
  );
}}

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
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
              className="absolute rounded-full bg-purple-500"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `-${particle.size}px`
              }}
            />
          ))}
        </div>
        
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800"
      >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white"
            >
              <FiCheck className="h-8 w-8" />
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl font-bold mb-4 text-center text-white ${spaceGrotesk.className}`}
          >
            Message Sent!
          </motion.h2>
          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-8 text-center"
          >
            We&apos;ve received your message and will get back to you within 24 hours.
          </motion.p>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmitSuccess(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium"
            >
              Send Another Message
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, particle.size * 10],
              x: [particle.x, particle.x + (Math.random() * 20 - 10)]
            }}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="absolute rounded-full bg-purple-500"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `-${particle.size}px`
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isHoveringButton && (
          <motion.div
            className="fixed pointer-events-none h-64 w-64 rounded-full bg-purple-900/20 backdrop-blur-sm z-0"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800"
      >
        <div className="md:flex">
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-purple-900 to-gray-900 p-8 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center opacity-10"
            >
            </motion.div>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <h2 className={`text-2xl font-bold text-white mb-2 ${spaceGrotesk.className}`}>
                Let&apos;s Build Together
              </h2>
              <p className="text-purple-200 mb-6">
                Share your vision with us and we&apos;ll help bring it to life.
              </p>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    1
                  </div>
                  <span className={`${currentStep >= 1 ? 'text-white font-medium' : 'text-gray-400'}`}>Basic Info</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    2
                  </div>
                  <span className={`${currentStep >= 2 ? 'text-white font-medium' : 'text-gray-400'}`}>Services</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    3
                  </div>
                  <span className={`${currentStep >= 3 ? 'text-white font-medium' : 'text-gray-400'}`}>Final Details</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold mb-2 text-white ${spaceGrotesk.className}`}
              >
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What services do you need?"}
                {currentStep === 3 && "Final details"}
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400"
              >
                {currentStep === 1 && "We&apos;ll use this information to get in touch with you."}
                {currentStep === 2 && "Select all that apply to your project."}
                {currentStep === 3 && "Any final details you&apos;d like to share?"}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="relative">
                     <input
  type="text"
  id="name"
  name="name"  // Must match the state key
  value={formData.name}
  onChange={handleInputChange}  // Verify this is working
  required
  className="peer h-12 w-full bg-gray-800 border-b border-gray-700 text-white placeholder-transparent focus:outline-none focus:border-purple-500"
  placeholder=" "
/>
                      <label
                        htmlFor="name"
                        className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm"
                      >
                        Your Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="peer h-12 w-full bg-gray-800 border-b border-gray-700 text-white placeholder-transparent focus:outline-none focus:border-purple-500"
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm"
                      >
                        Email Address
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="peer h-12 w-full bg-gray-800 border-b border-gray-700 text-white placeholder-transparent focus:outline-none focus:border-purple-500"
                        placeholder=" "
                      />
                      <label
                        htmlFor="company"
                        className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-400 peer-focus:text-sm"
                      >
                        Company (Optional)
                      </label>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {serviceTags.map(service => (
                        <motion.div
                          key={service}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onMouseEnter={() => setHoveredService(service)}
                          onMouseLeave={() => setHoveredService(null)}
                          className="relative"
                        >
                          <button
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={`w-full px-4 py-3 rounded-lg text-sm border transition-all ${
                              formData.services.includes(service)
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-purple-400'
                            } ${
                              hoveredService === service && !formData.services.includes(service)
                                ? 'shadow-md border-purple-400'
                                : ''
                            }`}
                          >
                            {service}
                          </button>
                          {hoveredService === service && (
                            <motion.div
                              layoutId="serviceHover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-400/30 rounded-full mx-auto"
                              style={{ width: '80%' }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="peer h-32 w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder=" "
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-3 -top-3 bg-gray-900 px-1 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-purple-400 peer-focus:text-sm"
                      >
                        Project Details (Optional)
                      </label>
                    </div>

                    {formData.services.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.services.map(service => (
                            <motion.div
                              key={service}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full border border-purple-800"
                            >
                              {service}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg flex items-start border border-red-900/50"
                >
                  <FiX className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>{submitError}</div>
                </motion.div>
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 rounded-lg font-medium text-purple-400 hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </motion.button>
                ) : (
                  <div></div>
                )}

             {currentStep < 3 ? (
  <motion.button
    type="button"
    onClick={() => {
      if (formData.name.trim() && formData.email.trim()) {
        setCurrentStep(prev => prev + 1);
      }
    }}
    disabled={!formData.name.trim() || !formData.email.trim()}
    whileHover={
      formData.name.trim() && formData.email.trim()
        ? { scale: 1.02 }
        : {}
    }
    whileTap={
      formData.name.trim() && formData.email.trim()
        ? { scale: 0.98 }
        : {}
    }
    className={`px-6 py-3 rounded-lg font-medium flex items-center ${
      !formData.name.trim() || !formData.email.trim()
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
    }`}
  >
    Next <FiArrowRight className="ml-2" />
  </motion.button>
) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isSubmitting
                        ? 'bg-purple-800 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    }`}
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Send Message</span>
                        <FiArrowRight className="ml-2" />
                      </div>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}