'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type ExperienceItem = {
  id: number;
  jobTitle: string;
  company: string;
  description: string;
  timeRange: string;
  isCurrent?: boolean;
};

const ExperienceTimeline = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const experiences: ExperienceItem[] = [
    {
      id: 1,
      jobTitle: 'Full Stack Developer Intern',
      company: 'BUILD AI ENGINE',
      description:
        'DevOps Team Lead, Working in a hybrid setup to build and maintain scalable AI-integrated applications using modern technologies.',
      timeRange: 'Mar 2025 – Present',
      isCurrent: true,
    },
    {
      id: 2,
      jobTitle: 'Software Engineer Intern',
      company: 'MyTripGoal',
      description:
        'Contributed to the development of travel tech platforms, managed Angular-based components, and enhanced project management workflows.',
      timeRange: 'Dec 2024 – Mar 2025',
    },
     {
  id: 3,
  jobTitle: 'Cyber Security Intern',
  company: 'MP Police',
  description:
    'Developed and implemented cybersecurity tools including a secure VPN, a child-safe browsing assistant, and a threat detection extension. Collaborated with law enforcement to enhance digital safety, streamline incident response, and support public cybersecurity awareness initiatives.',
  timeRange: 'Dec 2024 – Mar 2025',
},

    {
      id: 4,
      jobTitle: 'Full Stack Developer Intern',
      company: 'FlatPur',
      description:
        'Led development of a full-stack application from scratch during this remote internship, gaining hands-on experience with Bash, React.js, and backend integrations.',
      timeRange: 'Aug 2024 – Oct 2024',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-12 text-right">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          A Yearly snapshot of my creative growth
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-200 max-w-2xl ml-auto"
        >
          My professional journey through the years, highlighting key roles and learning experiences that shaped my engineering career.
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>

        <div className="space-y-8 md:space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              className={`relative group ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}
            >
              <div
                className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeItem === exp.id || exp.isCurrent
                    ? 'bg-gray-50 shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm'
                }`}
                onMouseEnter={() => setActiveItem(exp.id)}
                onMouseLeave={() => setActiveItem(null)}
                
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:order-2 md:text-right' : ''}`}>
                    <h3 className="text-xl font-semibold">
                      {exp.jobTitle} <span className="text-gray-300">@ {exp.company}</span>
                    </h3>
                    <p className="text-gray-400 mt-2">{exp.description}</p>
                  </div>
                  <div
                    className={`flex items-start ${
                      index % 2 === 0 ? 'md:order-1 justify-start' : 'justify-end'
                    }`}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exp.isCurrent
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {exp.timeRange}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`absolute top-6 left-2 w-4 h-4 rounded-full border-4 border-white ${
                  exp.isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                } hidden md:block`}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;