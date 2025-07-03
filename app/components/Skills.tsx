import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { IconType } from 'react-icons';

// Icons imports remain the same
import { 
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs, 
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGraphql, 
  SiAmazons3, SiDocker, SiGit, SiGithubactions, SiJest, SiTailwindcss, SiKubernetes
} from 'react-icons/si';

interface Skill {
  name: string;
  icon: IconType;
  color: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  proficiency: number;
}

const Skills = () => {
  const [, setInit] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  const skillsData: Skill[] = useMemo(() => [
    // Frontend
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26', category: 'frontend', proficiency: 5 },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6', category: 'frontend', proficiency: 5 },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'frontend', proficiency: 5 },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'frontend', proficiency: 4 },
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'frontend', proficiency: 5 },
    { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF', category: 'frontend', proficiency: 4 },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4', category: 'frontend', proficiency: 5 },
    { name: 'Jest', icon: SiJest, color: '#C21325', category: 'frontend', proficiency: 4 },
    
    // Backend
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', category: 'backend', proficiency: 5 },
    { name: 'Express.js', icon: SiExpress, color: '#FFFFFF', category: 'backend', proficiency: 4 },
    { name: 'GraphQL', icon: SiGraphql, color: '#E10098', category: 'backend', proficiency: 4 },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'backend', proficiency: 4 },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'backend', proficiency: 3 },
    
    // DevOps
    { name: 'Docker', icon: SiDocker, color: '#2496ED', category: 'devops', proficiency: 4 },
    { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', category: 'devops', proficiency: 3 },
    { name: 'AWS S3', icon: SiAmazons3, color: '#FF9900', category: 'devops', proficiency: 3 },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'devops', proficiency: 5 },
    { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF', category: 'devops', proficiency: 4 },
  ], []);

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') return skillsData;
    return skillsData.filter(skill => skill.category === activeFilter);
  }, [activeFilter, skillsData]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const handleFilterChange = (filter: string) => {
    setIsAnimating(true);
    setActiveFilter(filter);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: isAnimating ? 0 : 0.3,
        when: "beforeChildren"
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
      y: -15,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#17133a] to-[#0c0a1d]">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Technical Mastery
          </motion.h2>
          
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {['all', 'frontend', 'backend', 'devops'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={`${skill.name}-${activeFilter}`}
                className="flex flex-col items-center"
                variants={itemVariants}
                whileHover="hover"
                layout // Add layout animation
              >
                <div className="relative group">
                  <skill.icon 
                    className="h-14 w-14 sm:h-16 sm:w-16 transition-all duration-300"
                    style={{ color: skill.color }} 
                  />
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `0 0 25px ${skill.color}`,
                      zIndex: -1,
                    }}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-200">
                    {skill.name}
                  </p>
                  <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full"
                      style={{ 
                        width: `${skill.proficiency * 20}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Skills;