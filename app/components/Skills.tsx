'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

/* -------------------------------------------------------------------------- */
/*                                DATA MODEL                                   */
/* -------------------------------------------------------------------------- */

type SkillCategory = {
  title: string;
  items: string[];
};

const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'Zustand'],
  },
  {
    title: 'Backend',
    items: [
      'Node.js',
      'Spring Boot',
      'FastAPI',
      'REST APIs',
      'GraphQL',
      'Microservices',
      'Redis',
    ],
  },
  {
    title: 'Cloud & DevOps',
    items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    title: 'Tools',
    items: ['Git', 'Kafka', 'Postman', 'JMeter', 'Celery'],
  },
  {
    title: 'System Design',
    items: [
      'Distributed Systems',
      'Caching',
      'Load Balancing',
      'Event-Driven Architecture',
      'API Design',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              SKILL BADGE                                    */
/* -------------------------------------------------------------------------- */

const SkillBadge = ({
  skill,
  index,
}: {
  skill: string;
  index: number;
}) => {
  const rotations = [-4, -2, 0, 2, 4];
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ rotate: rotation }}
      whileHover={{ rotate: 0, y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="relative"
    >
      <motion.div
        className="rounded-full border border-black cursor-pointer
                   px-3 py-1.5 md:px-3.5 md:py-2"
        whileHover={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
        }}
        transition={{ duration: 0.25 }}
      >
        <span
          className={`text-[10px] md:text-xs font-bold uppercase tracking-wide whitespace-nowrap ${spaceGrotesk.className}`}
        >
          {skill}
        </span>
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          CATEGORY BLOCK                                      */
/* -------------------------------------------------------------------------- */

const SkillCategoryBlock = ({ category }: { category: SkillCategory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-5"
    >
      <h3
        className={`text-lg md:text-xl font-bold uppercase tracking-wide ${spaceGrotesk.className}`}
      >
        {category.title}
      </h3>

      <div className="flex flex-wrap gap-2.5">
        {category.items.map((skill, index) => (
          <SkillBadge key={skill} skill={skill} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                MAIN                                          */
/* -------------------------------------------------------------------------- */

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative bg-white px-4 md:px-6 lg:px-8
                 py-14 md:py-16
                 max-h-[800px] md:max-h-[800px]"
    >
      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-5 ${spaceGrotesk.className}`}
          >
            Technical Mastery
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-sm md:text-base">
            A refined stack crafted for scalable systems, modern interfaces,
            and production-grade infrastructure.
          </p>
        </div>

        {/* Skills Grid — 2 × 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {skillCategories.map((category) => (
            <SkillCategoryBlock
              key={category.title}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
