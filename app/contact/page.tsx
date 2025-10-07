'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { 
  FiArrowRight, 
  FiCheck, 
  FiX, 
  FiUser, 
  FiMail, 
  FiMessageSquare,
  FiSend,
  FiLoader
} from 'react-icons/fi';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const serviceTags = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'DevOps & Cloud',
  'AI/ML Integration',
  'System Design',
  'Consulting',
  'Full-Stack Development',
];

export default function ContactPage() {
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Floating particles effect
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3
  }));

  // Validation function
  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call - replace with actual Supabase call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll just show success
      // In production, replace this with your actual Supabase call:
      /*
      const { data, error } = await supabase
        .from('idea_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          company_name: formData.company,
          services: formData.services,
          message: formData.message,
          submitted_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      */

      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          services: [],
          message: '',
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : 'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-4 relative overflow-hidden">
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-6"
          >
            <FiCheck className="h-10 w-10" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl font-bold mb-4 text-white ${spaceGrotesk.className}`}
          >
            Message Sent!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 mb-8 leading-relaxed"
          >
            Thank you for reaching out! I&apos;ve received your message and will get back to you within 24 hours.
          </motion.p>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSubmitSuccess(false);
              setFormData({
                name: '',
                email: '',
                company: '',
                services: [],
                message: '',
              });
              setCurrentStep(1);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background particles */}
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
            className="absolute rounded-full bg-purple-500/30"
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
        className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left sidebar */}
          <div className="lg:w-1/3 bg-gradient-to-b from-purple-900/50 to-gray-900/50 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={`text-3xl font-bold text-white mb-4 ${spaceGrotesk.className}`}>
                  Let&apos;s Build Together
                </h2>
                <p className="text-purple-200 mb-8 leading-relaxed">
                  Share your vision with me and I&apos;ll help bring it to life with cutting-edge technology and innovative solutions.
                </p>
              </motion.div>
              
              {/* Progress indicator */}
              <div className="space-y-4">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + step * 0.1 }}
                    className="flex items-center"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {currentStep > step ? (
                        <FiCheck className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{step}</span>
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      currentStep >= step ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step === 1 && 'Basic Information'}
                      {step === 2 && 'Services & Requirements'}
                      {step === 3 && 'Project Details'}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Contact info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 space-y-4"
              >
                <div className="flex items-center text-gray-300">
                  <FiMail className="h-5 w-5 mr-3 text-purple-400" />
                  <span>harrshh077@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FiUser className="h-5 w-5 mr-3 text-purple-400" />
                  <span>Available for new opportunities</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right form section */}
          <div className="lg:w-2/3 p-8">
            <div className="mb-8">
              <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold mb-2 text-white ${spaceGrotesk.className}`}
              >
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What services do you need?"}
                {currentStep === 3 && "Project details & message"}
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400"
              >
                {currentStep === 1 && "Let's start with some basic information to get in touch."}
                {currentStep === 2 && "Select the services that best match your project needs."}
                {currentStep === 3 && "Share any additional details about your project."}
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
                    className="space-y-6"
                  >
                    <div className="space-y-5">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            errors.name ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            errors.email ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {/* Replace FiBuilding with a valid icon or remove if not imported */}
                          {/* <FiBuilding className="h-5 w-5 text-gray-400" /> */}
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="7" width="7" height="13" rx="2" />
                            <rect x="14" y="3" width="7" height="17" rx="2" />
                            <path d="M17 17v2M6.5 17v2" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="Company name (optional)"
                        />
                      </div>
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
                    <div className="grid grid-cols-2 gap-4">
                      {serviceTags.map(service => (
                        <motion.button
                          key={service}
                          type="button"
                          onClick={() => handleServiceToggle(service)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                            formData.services.includes(service)
                              ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg'
                              : 'bg-gray-800/50 text-gray-300 border-2 border-gray-600 hover:border-purple-400 hover:bg-gray-700/50'
                          }`}
                        >
                          {service}
                          {formData.services.includes(service) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <FiCheck className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
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
                    className="space-y-6"
                  >
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FiMessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell me about your project, goals, timeline, or any specific requirements..."
                      />
                    </div>

                    {formData.services.length > 0 && (
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Selected Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.services.map(service => (
                            <motion.span
                              key={service}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full border border-purple-800"
                            >
                              {service}
                            </motion.span>
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
                  className="p-4 bg-red-900/20 text-red-400 text-sm rounded-lg flex items-start border border-red-900/50"
                >
                  <FiX className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>{submitError}</div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentStep > 1
                      ? 'text-purple-400 hover:bg-gray-800/50'
                      : 'invisible'
                  }`}
                >
                  Back
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name.trim() || !formData.email.trim()}
                    whileHover={formData.name.trim() && formData.email.trim() ? { scale: 1.02 } : {}}
                    whileTap={formData.name.trim() && formData.email.trim() ? { scale: 0.98 } : {}}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 ${
                      !formData.name.trim() || !formData.email.trim()
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                    }`}
                  >
                    Next <FiArrowRight className="ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-purple-800 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Send Message
                      </>
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