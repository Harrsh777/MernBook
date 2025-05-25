'use client';

import { motion } from 'framer-motion';

const TestimonialFooter = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-white w-full">
      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="relative text-center">
          {/* Background quotation marks */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <span className="text-gray-100 text-9xl font-serif select-none">&apos;</span>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative z-10"
          >
            <span className="text-gray-100 text-9xl font-serif select-none">&quot;</span>

<motion.p>
  Working with this team felt like unlocking a creative superpower. Their attention to detail, tech expertise, and collaboration transformed our vision into reality. We didnot just launch a product—we launched an experience.;
</motion.p>


            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-col items-center"
            >
              
              <div className="mt-4 text-center">
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Let&apos;s Connect There
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all duration-300"
            >
              Hire Me Now!
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {/* Column 1 - Brand */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="h-10 w-10 bg-indigo-600 rounded-lg mb-4"></div>
              <p className="text-gray-400 mt-4">
                A powerful digital product builder using design + code + strategy.
              </p>
              <div className="flex gap-4 mt-6">
                {['twitter', 'github', 'linkedin', 'dribbble'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Column 2 - Address */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">Address</h3>
              <address className="not-italic text-gray-400">
                Shyam Nagar, Kanpur<br />
                Uttar Pradesh<br />
                India
              </address>
            </motion.div>

            {/* Column 3 - Email */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">Email</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:harrshh077@gmail.com.com" className="text-gray-400 hover:text-white transition-colors">
                    harrshh077@gmail.com.com
                  </a>
                </li>
                <li>

                </li>
              </ul>
            </motion.div>

            {/* Column 4 - Phone */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">Phone</h3>
              <ul className="space-y-2">
                <li>
                  <a href="tel:+918707806698" className="text-gray-400 hover:text-white transition-colors">
                    +91 8707806698
                  </a>
                </li>
                <li>
                  
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Harsh Srivastava. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
              {['Templates', 'Tools', 'Features', 'About Us'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ color: '#FFFFFF' }}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default TestimonialFooter;