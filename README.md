# CodeNerve ⚡

> **A NeetCode-inspired coding education platform integrated with the AlgoNerve interactive algorithm visualizer, university syllabi, structured DSA & C++ roadmaps, and curated external problem catalogue.**

---

## 🌟 Overview

**CodeNerve** is a modern, production-grade web application tailored for computer science students, university exam preparation, competitive programming, and technical interview readiness. It bridges the gap between theoretical syllabus topics and practical problem-solving by coupling **interactive step-by-step algorithm animations** with **curated problem roadmaps**.

### Key Highlights
- 🧠 **Integrated AlgoNerve Visualizer Engine**: Over 160+ algorithms across 33 categories (Sorting, Searching, Trees, Graphs, DP, Backtracking) with speed controls, step-by-step timeline, D3/SVG graph layouts, and live narration.
- 🗺️ **NeetCode-Style Roadmaps**: Prerequisite-aware learning graphs for **Data Structures & Algorithms** (12 units) and **Object-Oriented C++** (12 units).
- 🎓 **University Syllabus Integration**: Native alignment with **Lovely Professional University (LPU)** B.Tech CSE curricula (**CSE202** Object Oriented Programming & **CSE205** Data Structures and Algorithms).
- 💻 **Centralized External Problem Catalogue**: Verified problem entries linking out to **LeetCode**, **GeeksforGeeks**, and **HackerRank** without copyright reproduction.
- 📊 **Student Progress & Revision Queue**: LocalStorage-persisted tracker for `SOLVED`, `ATTEMPTED`, and `REVISION_NEEDED` statuses, personal solution notes, and bookmarks.
- 📝 **Assessments & Quizzes**: Real-time knowledge verification with multiple-choice and C++ code-trace questions.
- 🛡️ **Instructor Portal (Teacher Mode)**: Custom problem set creator for classroom assignments and targeted revision batches.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) + PostCSS, custom dark-first glassmorphism design tokens |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence |
| **Routing** | [React Router v7](https://reactrouter.com/) client-side routing |
| **Visualizations** | D3.js + Custom SVG coordinate engines + Framer Motion |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Syntax Highlighting** | [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |

---

## 📁 Repository Structure

```text
CodeNerve/
├── public/                 # Static assets & favicon
├── src/
│   ├── algonerve/          # Full integrated AlgoNerve visualization engine
│   │   ├── algorithms/     # 160+ algorithm step generators
│   │   ├── controls/       # Player, speed, timeline, narration, code panel
│   │   ├── visualizers/    # Sorting, Graph, Tree, DP, Recursion, Chessboard views
│   │   ├── store/          # AlgoNerve playback state
│   │   └── pages/          # AlgoNerve Home, Visualizer & Documentation
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, NavLinks
│   │   ├── problems/       # ProblemModal, ProblemTable, Filters
│   │   ├── roadmap/        # RoadmapView with collapsible prerequisite cards
│   │   └── ui/             # Reusable UI primitives
│   ├── data/
│   │   ├── problems.ts     # Curated problem catalogue (LeetCode, GFG, HackerRank)
│   │   ├── learningPaths.ts# DSA Roadmap & C++ Learning Path
│   │   ├── syllabus.ts     # LPU CSE202 & CSE205 Subject hierarchy
│   │   ├── visualizers.ts  # Mapping topics to AlgoNerve algorithm IDs
│   │   ├── lessons.ts      # Structured concept notes & code implementations
│   │   └── quizzes.ts      # Interactive assessment quizzes
│   ├── store/
│   │   └── userStore.ts    # Student progress, bookmarks, notes, quiz scores
│   ├── lib/
│   │   ├── config.ts       # Application branding & external platform metadata
│   │   └── utils.ts        # Helper functions & Tailwind class merging
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page & feature showcase
│   │   ├── RoadmapPage.tsx    # NeetCode-inspired DSA & C++ roadmaps
│   │   ├── ProblemsPage.tsx   # Searchable & filterable problem catalogue
│   │   ├── UniversityPage.tsx # LPU syllabus explorer
│   │   ├── LessonPage.tsx     # Concept guides & code viewer
│   │   ├── QuizPage.tsx       # Interactive knowledge test runner
│   │   ├── DashboardPage.tsx  # Analytics, revision queue, bookmarks
│   │   └── TeacherPage.tsx    # Assignment set builder
│   ├── App.tsx             # Root router & layout shell
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global typography & design system tokens
├── tailwind.config.js      # Custom brand palettes & dark theme tokens
├── vite.config.ts          # Vite build config
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & build scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd CodeNerve
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📜 License & Acknowledgments

- Built by **Vaibhav Kushwaha**.
- Inspired by **NeetCode.io** for structured roadmap progression.
- Powered by **AlgoNerve** for interactive algorithmic step visualization.
- External coding problems remain the property of their respective platforms (LeetCode, GeeksforGeeks, HackerRank). CodeNerve only links to official external problem URLs.
