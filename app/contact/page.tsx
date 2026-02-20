'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import emailjs from '@emailjs/browser';
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

// Particle Button Component
const ParticleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    if (isHovered && !disabled) {
      const newParticles = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered, disabled]);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full border-2 border-black ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Particles Background */}
      {isHovered && !disabled && (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black"
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
    </motion.button>
  );
};

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
  const isEmailJSConfigured = Boolean(
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  );

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
      // Prepare email template parameters
      // Note: EmailJS will send the email TO your email, but you can reply directly to the submitter
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email, // User's email - use this for reply_to in template
        reply_to: formData.email, // This allows you to reply directly to the submitter
        to_name: 'Harsh Srivastava',
        to_email: 'harrshh077@gmail.com', // Your email address
        company: formData.company || 'Not provided',
        services: formData.services.length > 0 ? formData.services.join(', ') : 'None selected',
        message: formData.message || 'No message provided',
        // Formatted email body with all information
        email_body: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}

Selected Services:
${formData.services.length > 0 ? formData.services.map(s => `- ${s}`).join('\n') : 'None selected'}

Message:
${formData.message || 'No message provided'}

---
This email was sent from your portfolio contact form.
You can reply directly to this email to respond to ${formData.name} at ${formData.email}.
        `.trim()
      };

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          'EmailJS not configured. Add to .env.local: NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY (see env.example).'
        );
      }

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        setSubmitSuccess(true);
        
        // Reset form after 5 seconds
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
      } else {
        throw new Error('Failed to send email');
      }
      
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
      <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-6"
          >
            <FiCheck className="h-10 w-10" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl font-bold mb-4 text-black ${spaceGrotesk.className}`}
          >
            Message Sent!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-gray-700 mb-8 leading-relaxed ${spaceGrotesk.className}`}
          >
            Thank you for reaching out! I&apos;ve received your message and will get back to you within 24 hours.
          </motion.p>
          
          <ParticleButton
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
            className="bg-black text-white px-8 py-4 uppercase text-sm font-semibold w-full"
          >
            <span className={`${spaceGrotesk.className} flex items-center justify-center gap-2`}>
              Send Another Message
              <FiArrowRight className="text-sm" />
            </span>
          </ParticleButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left sidebar */}
          <div className="lg:w-1/3 bg-black text-white p-8 relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={`text-3xl font-bold mb-4 ${spaceGrotesk.className}`}>
                  Let&apos;s Build Together
                </h2>
                <p className={`text-gray-300 mb-8 leading-relaxed ${spaceGrotesk.className}`}>
                  Share your vision with me and I&apos;ll help bring it to life with cutting-edge technology and innovative solutions.
                </p>
              </motion.div>
              
              {/* Progress indicator */}
              <div className="space-y-4 flex-1">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + step * 0.1 }}
                    className="flex items-center"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 border-2 ${
                      currentStep >= step 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-gray-400 border-gray-600'
                    }`}>
                      {currentStep > step ? (
                        <FiCheck className="h-5 w-5" />
                      ) : (
                        <span className={`font-semibold ${spaceGrotesk.className}`}>{step}</span>
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${spaceGrotesk.className} ${
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
                <div className={`flex items-center text-gray-300 ${spaceGrotesk.className}`}>
                  <FiMail className="h-5 w-5 mr-3 text-white" />
                  <span>harrshh077@gmail.com</span>
                </div>
                <div className={`flex items-center text-gray-300 ${spaceGrotesk.className}`}>
                  <FiUser className="h-5 w-5 mr-3 text-white" />
                  <span>Available for new opportunities</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right form section */}
          <div className="lg:w-2/3 p-8 bg-white">
            <div className="mb-8">
              <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold mb-2 text-black ${spaceGrotesk.className}`}
              >
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What services do you need?"}
                {currentStep === 3 && "Project details & message"}
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-gray-600 ${spaceGrotesk.className}`}
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
                          className={`block w-full pl-10 pr-3 py-3 bg-white border-2 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 ${spaceGrotesk.className} ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className={`mt-1 text-sm text-red-500 ${spaceGrotesk.className}`}>{errors.name}</p>
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
                          className={`block w-full pl-10 pr-3 py-3 bg-white border-2 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 ${spaceGrotesk.className} ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className={`mt-1 text-sm text-red-500 ${spaceGrotesk.className}`}>{errors.email}</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                          className={`block w-full pl-10 pr-3 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 ${spaceGrotesk.className}`}
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
                          className={`relative p-4 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${spaceGrotesk.className} ${
                            formData.services.includes(service)
                              ? 'bg-black text-white border-black shadow-lg'
                              : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                        >
                          {service}
                          {formData.services.includes(service) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center"
                            >
                              <FiCheck className="h-3 w-3 text-black" />
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
                        className={`block w-full pl-10 pr-3 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 resize-none ${spaceGrotesk.className}`}
                        placeholder="Tell me about your project, goals, timeline, or any specific requirements..."
                      />
                    </div>

                    {formData.services.length > 0 && (
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                        <h4 className={`text-sm font-medium text-black mb-3 ${spaceGrotesk.className}`}>Selected Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.services.map(service => (
                            <motion.span
                              key={service}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`px-3 py-1 bg-black text-white text-sm rounded-full border-2 border-black ${spaceGrotesk.className}`}
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

              {!isEmailJSConfigured && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-50 text-amber-900 text-sm rounded-lg border-2 border-amber-400"
                >
                  <p className="font-medium mb-1">Emails not set up yet</p>
                  <p className="mb-2">
                    Add to <code className="bg-amber-100 px-1 rounded">.env.local</code>:{' '}
                    <code className="text-xs">NEXT_PUBLIC_EMAILJS_SERVICE_ID</code>,{' '}
                    <code className="text-xs">NEXT_PUBLIC_EMAILJS_TEMPLATE_ID</code>,{' '}
                    <code className="text-xs">NEXT_PUBLIC_EMAILJS_PUBLIC_KEY</code>. Copy from <code className="bg-amber-100 px-1 rounded">env.example</code>.
                  </p>
                  <a
                    href="https://dashboard.emailjs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 underline font-medium"
                  >
                    Get keys from EmailJS dashboard →
                  </a>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start border-2 border-red-500 ${spaceGrotesk.className}`}
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
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${spaceGrotesk.className} ${
                    currentStep > 1
                      ? 'text-black hover:bg-gray-100 border-2 border-gray-300'
                      : 'invisible'
                  }`}
                >
                  Back
                </motion.button>

                {currentStep < 3 ? (
                  <ParticleButton
                    onClick={nextStep}
                    disabled={!formData.name.trim() || !formData.email.trim()}
                    className={`px-6 py-3 font-medium flex items-center ${spaceGrotesk.className} ${
                      !formData.name.trim() || !formData.email.trim()
                        ? 'bg-gray-200 text-gray-500 border-gray-300'
                        : 'bg-white text-black'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      Next
                      <FiArrowRight className="text-sm" />
                    </span>
                  </ParticleButton>
                ) : (
                  <ParticleButton
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 font-medium flex items-center ${spaceGrotesk.className} ${
                      isSubmitting
                        ? 'bg-gray-200 text-gray-500 border-gray-300'
                        : 'bg-white text-black'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <FiLoader className="animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FiSend />
                        Send Message
                      </span>
                    )}
                  </ParticleButton>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
