import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { IconType } from 'react-icons';

// Enhanced icons imports including AI/ML technologies
import { 
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs, 
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGraphql, 
  SiAmazons3, SiDocker, SiGit, SiGithubactions, SiJest, SiTailwindcss, SiKubernetes,
  SiPython, SiTensorflow, SiPytorch, SiOpenai, SiHuggingface, SiPandas, 
  SiNumpy, SiScikitlearn, SiJupyter, SiOpencv, SiFastapi, SiStreamlit,
  SiLangchain,
} from 'react-icons/si';

interface Skill {
  name: string;
  icon: IconType;
  color: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'ai-ml' | 'llm';
  proficiency: number;
  description?: string;
}

const Skills = () => {
  const [, setInit] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  const skillsData: Skill[] = useMemo(() => [
    // Frontend
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26', category: 'frontend', proficiency: 5, description: 'Semantic markup and modern web standards' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6', category: 'frontend', proficiency: 5, description: 'Advanced styling and animations' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'frontend', proficiency: 5, description: 'ES6+ and modern JavaScript features' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'frontend', proficiency: 4, description: 'Type-safe JavaScript development' },
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'frontend', proficiency: 5, description: 'Component-based UI development' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF', category: 'frontend', proficiency: 4, description: 'Full-stack React framework' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4', category: 'frontend', proficiency: 5, description: 'Utility-first CSS framework' },
    { name: 'Jest', icon: SiJest, color: '#C21325', category: 'frontend', proficiency: 4, description: 'JavaScript testing framework' },
    
    // Backend
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', category: 'backend', proficiency: 5, description: 'Server-side JavaScript runtime' },
    { name: 'Express.js', icon: SiExpress, color: '#FFFFFF', category: 'backend', proficiency: 4, description: 'Web application framework' },
    { name: 'GraphQL', icon: SiGraphql, color: '#E10098', category: 'backend', proficiency: 4, description: 'Query language for APIs' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'backend', proficiency: 4, description: 'NoSQL document database' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'backend', proficiency: 3, description: 'Relational database system' },
    { name: 'FastAPI', icon: SiFastapi, color: '#009688', category: 'backend', proficiency: 4, description: 'Modern Python web framework' },
    
    // DevOps
    { name: 'Docker', icon: SiDocker, color: '#2496ED', category: 'devops', proficiency: 4, description: 'Containerization platform' },
    { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', category: 'devops', proficiency: 3, description: 'Container orchestration' },
    { name: 'AWS S3', icon: SiAmazons3, color: '#FF9900', category: 'devops', proficiency: 3, description: 'Cloud storage service' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'devops', proficiency: 5, description: 'Version control system' },
    { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF', category: 'devops', proficiency: 4, description: 'CI/CD automation' },
    
    // AI/ML Technologies
    { name: 'Python', icon: SiPython, color: '#3776AB', category: 'ai-ml', proficiency: 5, description: 'Primary language for AI/ML development' },
    { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00', category: 'ai-ml', proficiency: 4, description: 'End-to-end ML platform' },
    { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C', category: 'ai-ml', proficiency: 4, description: 'Deep learning framework' },
    { name: 'Scikit-learn', icon: SiScikitlearn, color: '#F7931E', category: 'ai-ml', proficiency: 4, description: 'Machine learning library' },
    { name: 'Pandas', icon: SiPandas, color: '#150458', category: 'ai-ml', proficiency: 5, description: 'Data manipulation and analysis' },
    { name: 'NumPy', icon: SiNumpy, color: '#013243', category: 'ai-ml', proficiency: 5, description: 'Numerical computing library' },
    { name: 'OpenCV', icon: SiOpencv, color: '#5C3EE8', category: 'ai-ml', proficiency: 3, description: 'Computer vision library' },
    { name: 'Jupyter', icon: SiJupyter, color: '#F37626', category: 'ai-ml', proficiency: 4, description: 'Interactive development environment' },
    
    
    // LLM & Advanced AI
    { name: 'OpenAI API', icon: SiOpenai, color: '#412991', category: 'llm', proficiency: 4, description: 'GPT models and embeddings' },
    { name: 'Hugging Face', icon: SiHuggingface, color: '#FF6B6B', category: 'llm', proficiency: 4, description: 'Transformers and model hub' },
    { name: 'LangChain', icon: SiLangchain, color: '#1C3C3C', category: 'llm', proficiency: 4, description: 'LLM application framework' },
   
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
          
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {[
              { key: 'all', label: 'All Skills', icon: '⚡' },
              { key: 'frontend', label: 'Frontend', icon: '🎨' },
              { key: 'backend', label: 'Backend', icon: '⚙️' },
              { key: 'devops', label: 'DevOps', icon: '🚀' },
              { key: 'ai-ml', label: 'AI/ML', icon: '🤖' },
              { key: 'llm', label: 'LLM', icon: '🧠' }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{filter.icon}</span>
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={`${skill.name}-${activeFilter}`}
                className="group relative"
                variants={itemVariants}
                whileHover="hover"
                layout
              >
                <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/50">
                  <div className="relative group/icon">
                    <skill.icon 
                      className="h-12 w-12 sm:h-14 sm:w-14 transition-all duration-300 group-hover/icon:scale-110"
                      style={{ color: skill.color }} 
                    />
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `0 0 20px ${skill.color}40`,
                        zIndex: -1,
                      }}
                    />
                  </div>
                  <div className="mt-3 text-center w-full">
                    <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                      {skill.name}
                    </p>
                    {skill.description && (
                      <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {skill.description}
                      </p>
                    )}
                    <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5">
                      <motion.div 
                        className="h-1.5 rounded-full"
                        style={{ 
                          backgroundColor: skill.color
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-center mt-1">
                      <span className="text-xs text-gray-500">
                        {skill.proficiency}/5
                      </span>
                    </div>
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