# CodeNerve ⚡

> **A comprehensive computer science learning platform combining interactive algorithm visualizations, university curricula roadmaps (Lovely Professional University CSE202 & CSE205), dual-track DSA flowcharts, curated external problem catalogues, and real-time student cohort management.**

---

## 🌟 Overview

**CodeNerve** is a modern, production-grade educational platform engineered for computer science undergraduates, competitive programmers, and technical interview candidates. It bridges theoretical university coursework and practical problem-solving through:

1. **Dual-Track Learning Environment**: Seamless toggle between a language-agnostic **Global DSA Track** and an **LPU Academic Track** tailored for B.Tech CSE students.
2. **Deep AlgoNerve Integration**: Direct integration with the [AlgoNerve Interactive Algorithm Visualizer](https://algonerve.vercel.app) covering 160+ algorithms across 33 categories (Sorting, Searching, Trees, Graphs, Dynamic Programming, Backtracking, and Data Structures).
3. **Interactive Visual Roadmaps**: Dynamic mind maps with smooth Bézier branches, zoom/pan canvases, and slide-over topic drawers with prerequisite trace-back.
4. **Curated Problem Catalogue**: 260+ hand-picked problem entries mapped directly to official external problem platforms (**LeetCode**, **GeeksforGeeks**, and **HackerRank**).
5. **Academic Syllabus & Topic Checklists**: Meticulous alignment with **CSE202 (Object Oriented Programming with C++)** and **CSE205 (Data Structures & Algorithms)**.
6. **Faculty & Administration Portal**: Real-time multi-tab student cohort telemetry powered by `BroadcastChannel`, student registration approval workflows, and assignment creators.
7. **Client-Side State Persistence**: Complete user progress tracking (`SOLVED`, `ATTEMPTED`, `REVISION_NEEDED`), bookmarks, personalized notes, and dark/light/system theme adaptation.

---

## 🎯 Dual-Track Architecture

| Feature | 🌐 Global DSA Track | 🎓 LPU Academic Track |
|---|---|---|
| **Audience** | General CS learners, interview candidates, competitive coders | LPU B.Tech CSE students (Semesters 2 & 3) |
| **Focus** | Language-agnostic algorithmic patterns, LeetCode / GFG problems | C++ OOP (CSE202) & Core Data Structures (CSE205) |
| **Curriculum** | NeetCode-style tree, algorithmic categories & sub-patterns | Official syllabus units, textbooks, reference materials, practical lists |
| **Roadmap** | Dynamic radial mind map with multi-level Bézier branches | Academic flowchart with prerequisite dependencies and semester units |
| **Problem Set** | LeetCode Top Interview & GFG core patterns | Curated university coding sheets and LeetCode CSE205 assignments |

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS v3](https://tailwindcss.com/) + PostCSS, custom dark-first glassmorphism design tokens |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with `localStorage` persistence & cross-tab `BroadcastChannel` synchronization |
| **Routing** | [React Router v7](https://reactrouter.com/) client-side routing with lazy-loaded route splitting |
| **Visualizations** | D3.js + custom SVG coordinate rendering engines |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Syntax Highlighting**| [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |
| **Testing** | [Vitest](https://vitest.dev/) + React Testing Library + Jest DOM |

---

## 📁 Repository Structure

```text
CodeNerve/
├── public/                 # Favicon, SVG icon sprite sheet, and static assets
├── scripts/
│   └── runValidator.mjs    # Automated reference integrity validation runner
├── src/
│   ├── algonerve/          # Integrated algorithm playback engine, controls & visualizers
│   │   ├── algorithms/     # 160+ step generators across 33 categories
│   │   ├── controls/       # Player, speed, timeline, narration & code panels
│   │   ├── visualizers/    # Sorting, Graph, Tree, DP, Recursion, Chessboard views
│   │   └── store/          # AlgoNerve playback state
│   ├── components/
│   │   ├── auth/           # Guest action guard & authentication prompt modal
│   │   ├── common/         # ErrorBoundary, ThemeToggle, EditProfileModal, LoadingFallback
│   │   ├── layout/         # Top Navbar (with track switcher), Footer, TrackSelectionModal
│   │   ├── problems/       # ProblemTable, ProblemModal, filters, search & pagination
│   │   └── roadmap/        # Dynamic MindMap, DependencyGraph, AcademicGraph, TopicDrawer
│   ├── data/
│   │   ├── problems.ts     # Curated problem catalogue (260+ entries with topic tags)
│   │   ├── syllabus.ts     # Official LPU CSE202 & CSE205 course units & practicals
│   │   ├── learningPaths.ts# DSA Roadmap & C++ Learning Path groups
│   │   ├── lessons.ts      # Pedagogical concept guides with C++ code implementations
│   │   ├── visualizers.ts  # Mapping topics to AlgoNerve algorithm IDs
│   │   ├── dsaPatternsData.ts      # Multi-level algorithmic pattern taxonomy
│   │   └── whimsicalDsaTreeData.ts # Mind map tree structure with Bézier connection rules
│   ├── lib/
│   │   ├── config.ts       # Application branding, domain whitelists & platform metadata
│   │   └── utils.ts        # Helper functions & Tailwind class merging
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page with interactive feature showcase
│   │   ├── RoadmapPage.tsx    # Interactive mind maps & prerequisite dependency flowcharts
│   │   ├── ProblemsPage.tsx   # Filterable problem directory (search, tags, status, platform)
│   │   ├── SyllabusPage.tsx   # Comprehensive academic syllabus topic checklists
│   │   ├── LpuPortalPage.tsx  # Dedicated LPU academic hub with practicals & textbooks
│   │   ├── LessonPage.tsx     # Concept documentation & formatted C++ code examples
│   │   ├── DashboardPage.tsx  # Student progress analytics, bookmarks & revision queue
│   │   ├── AdminPage.tsx      # Faculty command center (student approvals, tests, roster)
│   │   ├── TeacherPage.tsx    # Assignment set builder
│   │   └── LoginPage.tsx      # Unified student & faculty authentication gateway
│   ├── store/
│   │   └── userStore.ts       # Zustand store with persistence, cohort sync & role control
│   ├── test/                  # Vitest unit & integration test suites
│   ├── types/
│   │   └── index.ts           # Central TypeScript interfaces & type definitions
│   ├── utils/
│   │   └── referenceValidator.ts # Cross-reference validator for all IDs and resources
│   ├── App.tsx             # Root router shell, route-level code splitting & theme management
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global typography, CSS custom properties & design system tokens
├── eslint.config.js        # ESLint flat configuration
├── tailwind.config.js      # Custom theme colors, animation utilities & responsive breakpoints
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Single-Page Application (SPA) rewrite rules for Vercel
├── vite.config.ts          # Vite build & plugin settings
├── vitest.config.ts        # Vitest test runner configuration
└── package.json            # Scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ProfessorAuggie/CodeNerve.git
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
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Run the automated data integrity validator:
   ```bash
   npm run validate
   ```
   Validates all foreign-key relationships across problems, syllabus topics, lessons, and AlgoNerve algorithm IDs.

5. Execute tests:
   ```bash
   npm test
   ```

6. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy Architecture

### 1. Data Protection & Zero-Leakage Guarantee
- **No Secret Leakage**: The repository contains **zero** hardcoded production API keys, database credentials, AWS tokens, or private signing keys.
- **No Real Student PII**: All default student rosters and test assignment arrays in the codebase are empty (`[]`). Any email addresses or names in test files (`src/test/`) are synthetic mock values used strictly for Vitest assertions.
- **Safe External Navigation**: All outbound links targeting external platforms (LeetCode, GeeksforGeeks, HackerRank, AlgoNerve) strictly enforce `rel="noopener noreferrer"` with `target="_blank"` to mitigate reverse tabnabbing and window manipulation vulnerabilities.
- **XSS Protection**: Zero instances of `dangerouslySetInnerHTML` or raw `innerHTML`. All dynamic content is rendered through React's safe JSX encoding.

### 2. Client-Side Authentication Notice
> **Notice for Deployments**: The current authentication and authorization engine (`loginStudent`, `authenticateAdmin`) operates in **client-side state simulation mode** via Zustand and `localStorage`.
>
> - **Student Authentication**: Implemented via registration number / email identifier matching.
> - **Faculty Gateway**: Validates local administrative passcodes for demonstration and offline academic use.
> - **Production Hardening Recommendation**: When transitioning this platform to university-wide public production, connect authentication to a hardened backend service (e.g., Supabase Auth, OAuth2 / LPU UMS Single-Sign-On) with server-verified JWTs and row-level security (RLS).

---

## 📜 Intellectual Property & Fair Use

- **Core Platform**: Developed by **Vaibhav Kushwaha**.
- **Interactive Visualizer**: Powered by **AlgoNerve** ([https://algonerve.vercel.app](https://algonerve.vercel.app)).
- **Coding Problems**: All external coding problem titles and URLs belong to their respective copyright holders (**LeetCode**, **GeeksforGeeks**, **HackerRank**). CodeNerve references these platforms via outbound links and provides original conceptual overviews for educational study.
