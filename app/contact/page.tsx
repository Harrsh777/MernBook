'use client';

import { useState } from 'react';
import { motion, AnimatePresence,} from 'framer-motion';
import supabase from '@/lib/supabase';
import { Space_Grotesk } from 'next/font/google';
import { useRouter } from 'next/navigation';

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

const floatingShapes = [
  { icon: '🟡', size: 40, top: '10%', left: '5%', delay: 0.1 },
  { icon: '🔵', size: 60, top: '20%', right: '10%', delay: 0.3 },
  { icon: '🟢', size: 30, bottom: '15%', left: '8%', delay: 0.5 },
  { icon: '🔴', size: 50, bottom: '25%', right: '5%', delay: 0.7 },
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
  const router = useRouter();

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
      const { error } = await supabase.from('idea_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          company_name: formData.company,
          services: formData.services,
          message: formData.message,
          submitted_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      
      // Reset form after successful submission
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
        router.refresh();
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Supabase RLS Policy Suggestion
  // You need to add this to your Supabase table policies:
  /*
  create policy "Enable insert for all users"
  on "public"."idea_submissions"
  as permissive
  for insert
  to public
  with check (true);
  */

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 relative overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shape.delay, duration: 0.8 }}
            className="absolute text-4xl"
            style={{
              top: shape.top,
              left: shape.left,
              right: shape.right,
              bottom: shape.bottom,
              fontSize: `${shape.size}px`,
            }}
          >
            {shape.icon}
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative z-10"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl font-bold mb-4 text-center ${spaceGrotesk.className}`}
          >
            Message Sent!
          </motion.h2>
          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-8 text-center"
          >
            We have received your message and will get back to you within 24 hours. In the meantime, check out our latest work.
          </motion.p>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/work')}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium"
            >
              View Our Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmitSuccess(false)}
              className="w-full bg-transparent text-black py-3 px-6 rounded-lg font-medium border border-gray-200"
            >
              Send Another Message
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating background elements */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ delay: shape.delay, duration: 0.8 }}
          className="absolute text-4xl opacity-40"
          style={{
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
            fontSize: `${shape.size}px`,
          }}
        >
          {shape.icon}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          {/* Visual side */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-indigo-500 to-purple-600 p-8 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center opacity-10"
            >
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0ZM100 180C56.4 180 20 143.6 20 100C20 56.4 56.4 20 100 20C143.6 20 180 56.4 180 100C180 143.6 143.6 180 100 180Z"
                  fill="white"
                />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <h2 className={`text-2xl font-bold text-white mb-2 ${spaceGrotesk.className}`}>
                Let&apos;s Build Something Amazing
              </h2>
              <p className="text-indigo-100 mb-6">
                Share your vision with us and we&apos;ll help bring it to life.
              </p>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 1 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-white'}`}>
                    1
                  </div>
                  <span className={`${currentStep >= 1 ? 'text-white font-medium' : 'text-indigo-200'}`}>Basic Info</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 2 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-white'}`}>
                    2
                  </div>
                  <span className={`${currentStep >= 2 ? 'text-white font-medium' : 'text-indigo-200'}`}>Services</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${currentStep >= 3 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-white'}`}>
                    3
                  </div>
                  <span className={`${currentStep >= 3 ? 'text-white font-medium' : 'text-indigo-200'}`}>Final Details</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form side */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <motion.h1 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold mb-2 ${spaceGrotesk.className}`}
              >
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What services do you need?"}
                {currentStep === 3 && "Almost there!"}
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600"
              >
                {currentStep === 1 && "We&apos;ll use this information to get in touch with you."}
                {currentStep === 2 && "Select all that apply to your project."}
                {currentStep === 3 && "Any final details youd like to share?"}
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
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="peer h-12 w-full border-b border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
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
                        className="peer h-12 w-full border-b border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
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
                        className="peer h-12 w-full border-b border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                        placeholder=" "
                      />
                      <label
                        htmlFor="company"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
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
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                            } ${
                              hoveredService === service && !formData.services.includes(service)
                                ? 'shadow-md border-indigo-400'
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
                              className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-200 rounded-full mx-auto"
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
                        className="peer h-32 w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder=" "
                      />
                      <label
                        htmlFor="message"
                        className="absolute left-3 -top-3 bg-white px-1 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-indigo-600 peer-focus:text-sm"
                      >
                        Project Details (Optional)
                      </label>
                    </div>

                    {formData.services.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.services.map(service => (
                            <motion.div
                              key={service}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
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
                  className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
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
                    className="px-6 py-2 rounded-lg font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    Back
                  </motion.button>
                ) : (
                  <div></div> // Empty div to maintain space
                )}

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      !formData.name || !formData.email
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isSubmitting
                        ? 'bg-indigo-400 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
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
                      'Send Message'
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