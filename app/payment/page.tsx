'use client';

import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiLock, FiMail, FiUser, FiHome} from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FormData {
  name: string;
  email: string;
  address: string;
  portfolio: string;
}

const BuyBookPage = () => {
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    portfolio: '',
  });
  const supabase = createClientComponentClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveOrderToDatabase = async () => {
    const { data, error } = await supabase
      .from('book_orders')
      .insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: formData.address,
        portfolio_url: formData.portfolio,
        amount: 749,
        payment_status: 'completed',
        order_status: 'processing'
      }])
      .select();

    if (error) {
      console.error('Error saving order:', error);
      return null;
    }

    return data[0];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      // On payment step
      if (step === 2) {
        setIsProcessing(true);
        
        try {
          // Save order to database
          await saveOrderToDatabase();

          // Simulate payment processing for 15 seconds
          setTimeout(() => {
            setIsProcessing(false);
            setStep(3);
          }, 15000);
        } catch (error) {
          console.error('Error during payment processing:', error);
          setIsProcessing(false);
          // Handle error state here
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const steps = [
    { id: 1, name: 'Personal Info' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(124,_58,_237,_0.1)_0,_transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-overlay opacity-20 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600 rounded-full mix-blend-overlay opacity-20 filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Progress Steps */}
        <nav className="mb-12">
          <ol className="flex items-center justify-center gap-4">
            {steps.map((item, index) => (
              <li key={item.id} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= item.id ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-600 text-gray-400'}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {step > item.id ? <FiCheck /> : item.id}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 ${step > item.id ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form Container */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                <p className="text-gray-400 mb-8">Let&apos;s start with your basic details</p>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                        <FiUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                        <FiMail />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Email Address"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-purple-400">
                        <FiHome />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Shipping Address"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                        
                      </div>
                     
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      type="submit"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Payment <FiArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Complete Payment</h2>
                <p className="text-gray-400 mb-8">Scan the QR code or use UPI ID below</p>

                <div className="space-y-8">
                  <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 flex flex-col items-center">
                    <div className="w-48 h-48 bg-white rounded-lg mb-4 flex items-center justify-center">
                      <div className="flex justify-center items-center p-4">
                        <div className="text-center">
                          <Image
                            src="/frame.png"
                            alt="Payment QR Code"
                            width={250}
                            height={250}
                            className="mx-auto border-2 border-gray-300 rounded-lg"
                          />
                          
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 mb-2">UPI ID:</p>
                      <div className="bg-gray-800 px-4 py-2 rounded-lg font-mono text-purple-300">harrshh077@oksbi</div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hardcopy Book</span>
                        <span className="text-white">₹499</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">E-Book</span>
                        <span className="text-white">₹249</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-white">Free</span>
                      </div>
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-300">Total</span>
                        <span className="text-purple-300">₹749</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-gray-700 rounded-lg text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
  type="button"
  onClick={handleSubmit}
  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <FiLock className="mr-2" /> Payment Done
</motion.button>

                </div>
              </motion.div>
            )}

            {step === 3 && !isProcessing && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheck className="text-white text-3xl" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
                <div className="space-y-4 text-lg text-gray-300 max-w-md mx-auto">
                  <p>✅ Your order has been confirmed</p>
                  <p>📧 You&apos;ll receive the e-book in your email within 30 minutes</p>
                  <p>📦 Hard copy will arrive in 9-10 business days</p>
                  <p className="mt-6 text-sm">For any queries, call us at <span className="text-purple-300">8707805598</span></p>
                </div>
                <div className="mt-8 bg-gray-700/50 p-6 rounded-xl border border-gray-600/50 text-left">
                  <h3 className="font-semibold text-white mb-2">Order Details</h3>
                  <p className="text-gray-400">Order #: {Math.floor(Math.random() * 1000000)}</p>
                  <p className="text-gray-400">Email: {formData.email}</p>
                  <p className="text-gray-400">Shipping to: {formData.address.substring(0, 30)}...</p>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <div className="flex justify-center mb-8">
                  <div className="relative w-20 h-20">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4 bg-purple-500 rounded-full"
                        initial={{ opacity: 0.3 }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: i * 0.1,
                        }}
                        style={{
                          left: `${Math.cos((i * Math.PI) / 4) * 30 + 30}%`,
                          top: `${Math.sin((i * Math.PI) / 4) * 30 + 30}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Processing Your Payment</h2>
                <p className="text-gray-400 mb-6">This may take a few moments...</p>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </div>
                
                <p className="text-sm text-gray-500">Please don&apos;t close this window</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite 2s; }
      `}</style>
    </div>
  );
};

export default BuyBookPage;