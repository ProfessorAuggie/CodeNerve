// ───── Application Configuration ─────
// All branding is centralized here for easy reconfiguration.

export const APP_CONFIG = {
  name: 'CodeNerve',
  tagline: 'Master DSA, C++ & University Syllabus — Powered by AlgoNerve',
  description: 'A structured NeetCode-inspired coding education platform with interactive algorithm visualizations, curated problem catalog, university syllabus roadmaps, and progress tracking.',
  version: '1.0.0',
  author: 'Vaibhav Kushwaha',
  
  // AlgoNerve integration
  algonerve: {
    name: 'AlgoNerve',
    description: 'Interactive Algorithm Visualizer',
    basePath: '/visualize',
  },

  // External coding platforms
  platforms: {
    leetcode: { name: 'LeetCode', domain: 'leetcode.com', color: '#FFA116', icon: '⚡' },
    geeksforgeeks: { name: 'GeeksforGeeks', domain: 'geeksforgeeks.org', color: '#2F8D46', icon: '🟢' },
    codechef: { name: 'CodeChef', domain: 'codechef.com', color: '#5B4638', icon: '👨‍🍳' },
    codeforces: { name: 'Codeforces', domain: 'codeforces.com', color: '#1F8ACB', icon: '🏆' },
    hackerrank: { name: 'HackerRank', domain: 'hackerrank.com', color: '#00EA64', icon: '💚' },
    hackerearth: { name: 'HackerEarth', domain: 'hackerearth.com', color: '#2C3454', icon: '🌍' },
  } as const,

  // Allowed external redirect domains
  allowedDomains: [
    'leetcode.com',
    'geeksforgeeks.org',
    'codechef.com',
    'codeforces.com',
    'hackerrank.com',
    'hackerearth.com',
  ],

  // University config
  universities: {
    lpu: {
      id: 'lpu',
      name: 'Lovely Professional University',
      shortName: 'LPU',
      program: 'B.Tech CSE',
    },
  },
} as const;

export type PlatformKey = keyof typeof APP_CONFIG.platforms;
