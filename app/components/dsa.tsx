import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

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

// Dynamic imports for better performance
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });

// Custom components
const BadgeCard = ({ icon, title, subtitle, isHighlighted = false }: BadgeCardProps) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className={`p-4 rounded-xl flex flex-col items-center transition-all ${
      isHighlighted 
        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-blue-500/10' 
        : 'bg-gray-800 hover:bg-gray-700/80'
    } shadow-lg`}
  >
    <div className={`text-3xl mb-3 ${isHighlighted ? 'text-blue-400' : 'text-gray-300'}`}>
      {icon}
    </div>
    <h4 className="font-bold text-sm mb-1">{title}</h4>
    <p className={`text-xs ${isHighlighted ? 'text-blue-300' : 'text-gray-400'}`}>{subtitle}</p>
  </motion.div>
);

const HeatmapDay = ({ count, date }: HeatmapDayProps) => {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800';
    if (count === 1) return 'bg-green-500/30';
    if (count === 2) return 'bg-green-500/50';
    if (count === 3) return 'bg-green-500/70';
    return 'bg-green-500';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      className={`w-3 h-3 rounded-sm ${getColor(count)}`}
      data-tooltip-id="heatmap-tooltip"
      data-tooltip-content={`${date}: ${count} ${count === 1 ? 'submission' : 'submissions'}`}
    />
  );
};

const LeetCodeDashboard = () => {
  const [streakFilter, setStreakFilter] = useState('current');
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  // Data for charts
  const ratingData = [
    { month: 'Sep 2024', rating: 1413 },
    { month: 'Oct 2024', rating: 1405 },
    { month: 'Nov 2024', rating: 1398 },
    { month: 'Dec 2024', rating: 1402 },
    { month: 'Jan 2025', rating: 1408 },
    { month: 'Feb 2025', rating: 1401 },
    { month: 'Mar 2025', rating: 1403 },
    { month: 'Apr 2025', rating: 1400 },
    { month: 'May 2025', rating: 1402 },
  ];

  const problemsData = [
    { name: 'Easy', value: 240, total: 877, color: '#00B8A3' },
    { name: 'Medium', value: 549, total: 1842, color: '#FFC01E' },
    { name: 'Hard', value: 161, total: 834, color: '#FF375F' },
  ];

  // Badges data
  const badges = [
    { icon: '🔥', title: '100 Days', subtitle: 'Daily Streak', highlight: true },
    { icon: '🏆', title: 'Contest Winner', subtitle: 'Top 5%' },
    { icon: '⚡', title: 'Fast Solver', subtitle: '<30min solutions' },
    { icon: '🧩', title: '50 Problems', subtitle: 'Solved milestone' },
    { icon: '🌟', title: 'All-Star', subtitle: 'Consistent performer' },
    { icon: '📅', title: 'Weekly Streak', subtitle: '7 days straight' },
  ];

  // Generate mock heatmap data
  const generateHeatmap = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      
      const days = [];
      for (let d = 1; d <= daysInMonth; d++) {
        days.push({
          date: new Date(date.getFullYear(), date.getMonth(), d).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 5) // Random submissions 0-4
        });
      }
      
      months.push({ month, days });
    }
    
    return months;
  };

  const heatmapData = generateHeatmap();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 leading-tight">
            Developer Performance Metrics
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 mt-3 max-w-2xl mx-auto"
          >
            Comprehensive analytics showcasing my problem-solving skills, consistency, and coding achievements
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Profile Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
          >
            <div className="flex flex-col items-center">
              {/* Profile Picture with Halo Effect */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mb-5"
              >
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20 -z-10" />
                <div className="w-24 h-24 rounded-full border-2 border-blue-400/80 shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                    H
                  </div>
                </div>
              </motion.div>

              {/* Name & Verification */}
              <div className="text-center mb-3">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center"
                >
                  <h2 className="text-2xl font-bold mr-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    Harsh Srivastava
                  </h2>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </motion.div>
                <p className="text-gray-400 mt-1">@Harshh077</p>
              </div>

              {/* Rank with Progress */}
              <div className="px-5 py-2 bg-gray-700/50 rounded-full mb-5 border border-gray-600/50 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-blue-500/30 w-3/4" />
                <div className="relative z-10 flex justify-between items-center">
                  <span className="font-bold">Rank</span> 
                  <span className="font-mono">24,646</span>
                </div>
              </div>

              {/* Bio */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="text-gray-300 text-sm text-center mb-6 leading-relaxed bg-gray-800/50 p-4 rounded-xl"
              >
                <p>
                  Passionate engineering student specializing in cybersecurity and digital forensics. 
                  MERN stack enthusiast with competitive programming experience. 
                  National athlete balancing technical skills with physical discipline.
                </p>
              </motion.div>

              {/* Edit Profile Button with Micro-interaction */}
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-500 rounded-xl font-medium mb-6 transition-all shadow-lg hover:shadow-green-500/20"
              >
                Edit Profile
              </motion.button>

              {/* Profile Details */}
              <div className="w-full space-y-3 mb-6">
                {[
                  { icon: '💼', text: 'MyTripGoals | DevOps Intern' },
                  { icon: '📍', text: 'India' },
                  { icon: '🎓', text: 'Vellore Institute of Technology' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-center text-sm text-gray-300 pl-2"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="w-full mb-6">
                <h3 className="text-sm font-medium mb-3 text-gray-400 flex items-center">
                  <span className="w-4 h-px bg-gray-600 mr-2"></span>
                  Online Profiles
                  <span className="w-4 h-px bg-gray-600 ml-2"></span>
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Harshh077', 'Harish007', 'harishh077'].map(handle => (
                    <motion.a
                      key={handle}
                      whileHover={{ y: -2 }}
                      className="text-xs px-3 py-1.5 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-all flex items-center"
                      href="#"
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      @{handle}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Skills with Progress */}
              <div className="w-full">
                <h3 className="text-sm font-medium mb-3 text-gray-400 flex items-center">
                  <span className="w-4 h-px bg-gray-600 mr-2"></span>
                  Technical Skills
                  <span className="w-4 h-px bg-gray-600 ml-2"></span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Java', level: 90 },
                    { name: 'JavaScript', level: 85 },
                    { name: 'React', level: 80 },
                    { name: 'MongoDB', level: 75 },
                    { name: 'Node.js', level: 80 }
                  ].map((skill, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <div className="text-xs px-3 py-1.5 border border-gray-600 rounded-full capitalize relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-all"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                        <span className="relative z-10">{skill.name}</span>
                      </div>
                      <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        {skill.level}% proficiency
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-gray-800 border-solid"/>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Row - Contest Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Contest Rating Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      Contest Rating
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Performance over time</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                      1,402
                    </div>
                    <div className="text-sm text-gray-400">Global: 589,121</div>
                  </div>
                </div>
                
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ratingData}>
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="url(#ratingGradient)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2 }}
                        activeDot={{ 
                          r: 6, 
                          stroke: '#fff', 
                          strokeWidth: 2, 
                          fill: '#3B82F6',
                          style: { filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.8))' }
                        }}
                      />
                      <defs>
                        <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-5">
                  {[
                    { label: 'Attended', value: '2', change: '+2' },
                    { label: 'Max Rating', value: '1,413', change: '-11' },
                    { label: 'Min Rating', value: '1,398', change: '+4' }
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -2 }}
                      className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30"
                    >
                      <div className="text-xs text-gray-400">{stat.label}</div>
                      <div className="flex items-baseline mt-1">
                        <span className="font-medium">{stat.value}</span>
                        <span className={`text-xs ml-2 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Percentile Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                      Top Percentile
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Your standing among peers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
                      85.05%
                    </div>
                    <div className="text-sm text-gray-400">Top 15%</div>
                  </div>
                </div>
                
                <div className="h-40 flex items-end relative">
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full flex justify-between items-end h-24">
                      {[0, 20, 40, 60, 80, 100].map((percent, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <motion.div 
                            animate={{ height: [`0%`, `${percent/1.5}px`] }}
                            transition={{ delay: idx * 0.05 + 0.3 }}
                            className={`w-5 rounded-t-sm ${percent === 85 ? 'bg-gradient-to-t from-orange-500 to-amber-400' : 'bg-gray-600'}`}
                            style={{ height: `${percent/1.5}px` }}
                          />
                          <span className="text-xs text-gray-400 mt-2">{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 text-sm text-gray-300 bg-gray-700/30 p-3 rounded-lg border border-gray-600/30">
                  <span className="text-amber-400">↑ Outstanding</span> - You&apos;re performing better than 85% of participants in recent contests.
                </div>
              </motion.div>
            </div>

            {/* Middle Row - Problems Solved */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Problems Solved
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Breakdown by difficulty level</p>
                </div>
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                    950
                  </div>
                  <div className="text-sm text-gray-400 ml-2">/ 3553</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={problemsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {problemsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="rgba(0,0,0,0.3)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-2xl font-bold">950</div>
                      <div className="text-xs text-gray-400">Solved</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {problemsData.map((problem, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
                      <div className="flex justify-between text-sm mb-2 items-center">
                        <div className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: problem.color }}
                          />
                          <span className="font-medium">{problem.name}</span>
                        </div>
                        <span>
                          <span className="font-mono">{problem.value}</span>
                          <span className="text-gray-500"> / {problem.total}</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${(problem.value / problem.total) * 100}%`,
                            backgroundColor: problem.color,
                            boxShadow: `0 0 8px ${problem.color}`
                          }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {Math.round((problem.value / problem.total) * 100)}% solved
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Attempting
                      </div>
                      <span className="font-medium text-blue-400">13</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Row - Badges and Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Badges Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                      </svg>
                      Achievements
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">11 badges earned</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>2,450 XP</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {badges.map((badge, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
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

                {hoveredBadge !== null && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30 text-sm"
                  >
                    <p>
                      {badges[hoveredBadge].title} badge: Earned by {badges[hoveredBadge].subtitle.toLowerCase()}.
                      {badges[hoveredBadge].highlight && " Your most recent achievement!"}
                    </p>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Enhanced Heatmap Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-700/50"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                      </svg>
                      Coding Activity
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">852 submissions in the past year</p>
                  </div>
                  <div className="flex space-x-2">
                    {['Current', 'Last Year', 'All Time'].map((filter) => (
                      <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStreakFilter(filter.toLowerCase().replace(' ', '-'))}
                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                          streakFilter === filter.toLowerCase().replace(' ', '-') 
                            ? 'bg-green-600/80 text-white' 
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {filter}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="overflow-x-auto py-2">
                  <div className="flex space-x-1 mb-3">
                    {heatmapData.map((month, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-2">{month.month}</div>
                        <div className="grid grid-rows-7 gap-1">
                          {month.days.map((day, dayIdx) => (
                            <HeatmapDay 
                              key={dayIdx}
                              count={day.count}
                              date={day.date}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-sm text-gray-400 mb-1">Total Active Days</div>
                    <div className="text-xl font-bold">291</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-sm text-gray-400 mb-1">Current Streak</div>
                    <div className="flex items-baseline">
                      <div className="text-xl font-bold mr-2">14</div>
                      <div className="text-xs text-green-400">days</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-sm text-gray-400 mb-1">Max Streak</div>
                    <div className="flex items-baseline">
                      <div className="text-xl font-bold mr-2">71</div>
                      <div className="text-xs text-green-400">days</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-sm text-gray-400 mb-1">Avg. Weekly</div>
                    <div className="flex items-baseline">
                      <div className="text-xl font-bold mr-2">16.4</div>
                      <div className="text-xs text-green-400">problems</div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>Less activity</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div 
                        key={level}
                        className={`w-3 h-3 rounded-sm ${
                          level === 0 ? 'bg-gray-800' : 
                          level === 1 ? 'bg-green-500/30' : 
                          level === 2 ? 'bg-green-500/50' : 
                          level === 3 ? 'bg-green-500/70' : 'bg-green-500'
                        }`}
                      />
                    ))}
                  </div>
                  <span>More activity</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip for heatmap */}
      <div id="heatmap-tooltip" role="tooltip" className="invisible absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg"></div>
    </div>
  );
};

export default LeetCodeDashboard;