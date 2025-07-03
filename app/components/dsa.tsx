import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pie, Cell, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

// --- HELPER COMPONENTS ---

interface BadgeCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isHighlighted?: boolean;
}

interface HeatmapDayProps {
  count: number;
  date: string;
}

// Dynamically import charts for better performance (client-side rendering only)
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });

const BadgeCard = ({ icon, title, subtitle, isHighlighted = false }: BadgeCardProps) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 h-full ${
      isHighlighted
        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
        : 'bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50'
    }`}
  >
    <div className={`text-4xl mb-2 ${isHighlighted ? 'text-blue-300' : 'text-gray-300'}`}>{icon}</div>
    <h4 className="font-bold text-sm mb-1 text-gray-100">{title}</h4>
    <p className={`text-xs ${isHighlighted ? 'text-blue-300/80' : 'text-gray-400'}`}>{subtitle}</p>
  </motion.div>
);

const HeatmapDay = ({ count, date }: HeatmapDayProps) => {
  const getColor = (c: number) => {
    if (c === 0) return 'bg-gray-800 hover:bg-gray-700';
    if (c >= 1 && c <= 2) return 'bg-green-900 hover:bg-green-800 border-green-700';
    if (c >= 3 && c <= 5) return 'bg-green-700 hover:bg-green-600 border-green-500';
    if (c >= 6 && c <= 8) return 'bg-green-600 hover:bg-green-500 border-green-400';
    return 'bg-green-500 hover:bg-green-400 border-green-300';
  };

  return (
    <div className="group relative">
      <motion.div
        whileHover={{ scale: 1.25, zIndex: 10 }}
        className={`w-3.5 h-3.5 rounded-sm cursor-pointer border ${getColor(count)}`}
      />
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        {count} submissions on {date}
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---

const LeetCodeDashboard = () => {
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  // --- MOCK DATA (Replace with real API data) ---
  const problemsData = {
    totalSolved: 950,
    totalQuestions: 3553,
    easy: { solved: 240, total: 877, color: '#00B8A3' },
    medium: { solved: 549, total: 1842, color: '#FFC01E' },
    hard: { solved: 161, total: 834, color: '#FF375F' },
  };

  const pieChartData = [
    { name: 'Easy', value: problemsData.easy.solved, color: problemsData.easy.color },
    { name: 'Medium', value: problemsData.medium.solved, color: problemsData.medium.color },
    { name: 'Hard', value: problemsData.hard.solved, color: problemsData.hard.color },
  ];

  const badges = [
    { icon: '🔥', title: '100 Days', subtitle: 'Daily Streak', highlight: true },
    { icon: '🏆', title: 'Top 5%', subtitle: 'Contest Rating' },
    { icon: '⚡', title: 'Fast Solver', subtitle: '< 30 min' },
    { icon: '🧩', title: '500 Medium', subtitle: 'Milestone' },
    { icon: '🌟', title: 'All-Star', subtitle: 'Annual Coder' },
    { icon: '📅', title: 'Weekly Pro', subtitle: '7 Day Streak' },
  ];

  const heatmapData = Array.from({ length: 53 * 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (53 * 7 - 1) + i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0,
    };
  });

  const heatmapMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Stagger animation for main content cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
            LeetCode
          </span> Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* --- Left Profile Panel --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-3 bg-[#282828]/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700/50"
          >
            <div className="flex flex-col items-center">
              <motion.div className="relative mb-4" whileHover={{ scale: 1.05 }}>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-lg opacity-60 animate-pulse" />
                <div className="relative w-28 h-28 rounded-full border-4 border-gray-700 shadow-lg bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-5xl font-bold text-gray-300">HS</span>
                </div>
              </motion.div>

              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">Harsh Srivastava</h2>
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 12a1 1 0 112 0 1 1 0 01-2 0zm-1-3a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">@Harshh077</p>

              <div className="w-full bg-gray-900/50 rounded-full p-1.5 flex items-center mb-6">
                <div className="bg-yellow-400 rounded-full px-3 py-1 text-xs font-bold text-gray-900">RANK</div>
                <p className="flex-grow text-center font-mono text-lg text-white">21,646</p>
              </div>

              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(45, 212, 191, 0.4)' }} whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg mb-6 transition-shadow duration-300">
                Edit Profile
              </motion.button>

              <div className="w-full text-left space-y-3">
                {[
                  { icon: '💼', text: 'MyTripGoals | DevOps Intern' },
                  { icon: '📍', text: 'India' },
                  { icon: '🎓', text: 'Vellore Institute of Technology' }
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} className="flex items-center text-gray-300 text-sm">
                    <span className="mr-3">{item.icon}</span> {item.text}
                  </motion.div>
                ))}
              </div>

              <div className="w-full h-px bg-gray-700 my-6" />

              <h3 className="w-full text-left text-sm font-semibold text-gray-400 mb-3">Community Stats</h3>
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between"><span>Views</span> <span className="font-semibold text-white">2.1k</span></div>
                <div className="flex justify-between"><span>Solution</span> <span className="font-semibold text-white">32</span></div>
                <div className="flex justify-between"><span>Discuss</span> <span className="font-semibold text-white">88</span></div>
                <div className="flex justify-between"><span>Reputation</span> <span className="font-semibold text-white">453</span></div>
              </div>

              <div className="w-full h-px bg-gray-700 my-6" />

              <h3 className="w-full text-left text-sm font-semibold text-gray-400 mb-3">Languages</h3>
              <div className="w-full text-left flex flex-wrap gap-2">
                {['Java', 'JavaScript', 'Python', 'C++', 'SQL', 'TypeScript'].map(lang => (
                  <span key={lang} className="text-xs px-2.5 py-1 bg-gray-700/80 text-gray-300 rounded-full">{lang}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* --- Right Content Area --- */}
          <motion.div className="lg:col-span-9 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {/* Contest Rating & Problems Solved */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Contest Rating Card */}
              {/* --- Corrected Coding Activity Heatmap --- */}
              <motion.div variants={itemVariants} className="bg-[#282828]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    Activity Heatmap
                  </h3>
                  <p className="text-sm text-gray-400">952 submissions this year</p>
                </div>

                {/* THIS IS THE MAIN CORRECTED AREA */}
                <div className="flex gap-3">
                  {/* Day Labels (Mon, Wed, Fri) */}
                  <div className="flex flex-col justify-between text-xs text-gray-400 py-1.5">
                    <span>Mon</span>
                    <span></span>
                    <span>Wed</span>
                    <span></span>
                    <span>Fri</span>
                  </div>

                  {/* Scrollable Container for the Heatmap Grid */}
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="flex flex-col">
                      {/* Month Labels */}
                      <div className="flex justify-between text-xs text-gray-400 mb-2" style={{ marginLeft: '4px' }}>
                        {heatmapMonths.map(m => <span key={m}>{m}</span>)}
                      </div>

                      {/* THE CRUCIAL CHANGE: grid-rows-7 and grid-flow-col */}
                      <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {heatmapData.map((day, i) => (
                          <HeatmapDay key={i} count={day.count} date={day.date} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-900"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  </div>
                  <span>More</span>
                </div>
              </motion.div>

              {/* Problems Solved Card */}
              <motion.div variants={itemVariants} className="bg-[#282828]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Problems Solved</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="relative h-48 w-48 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={3}>
                          {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-4xl font-bold text-white">{problemsData.totalSolved}</span>
                      <span className="text-sm text-gray-400">Solved</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Easy', data: problemsData.easy },
                      { name: 'Medium', data: problemsData.medium },
                      { name: 'Hard', data: problemsData.hard }
                    ].map(p => (
                      <div key={p.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{p.name}</span>
                          <span className="font-medium text-white">{p.data.solved} <span className="text-gray-500">/ {p.data.total}</span></span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <motion.div
                            className="h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.data.solved / p.data.total) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ backgroundColor: p.data.color, boxShadow: `0 0 10px ${p.data.color}80` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Badges and Stats */}
            <motion.div variants={itemVariants} className="bg-[#282828]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <AnimatePresence>
                  {badges.map((badge, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onHoverStart={() => setHoveredBadge(idx)}
                      onHoverEnd={() => setHoveredBadge(null)}
                    >
                      <BadgeCard
                        icon={badge.icon}
                        title={badge.title}
                        subtitle={badge.subtitle}
                        isHighlighted={badge.highlight}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {hoveredBadge !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-gray-900/50 rounded-lg text-sm text-center"
                  >
                    <p><span className="font-bold text-yellow-300">{badges[hoveredBadge].title}:</span> {badges[hoveredBadge].subtitle}.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDashboard;