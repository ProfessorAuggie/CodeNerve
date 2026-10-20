# CodeNerve Project Structure

## Project classification

CodeNerve is a frontend-only React single-page application (SPA). It is not a backend, CLI, library, or monorepo. The repository contains browser UI, static TypeScript data/catalogues, client-side state, an embedded algorithm visualizer source tree, and Vercel SPA rewrite configuration. No server routes, API handlers, ORM models, or active database client are referenced by `src/`.

## Runtime entrypoints

- `index.html` provides the HTML shell, theme bootstrap, font preconnects, and the `/src/main.tsx` module entry.
- `src/main.tsx:3-18` creates the React root, wraps the app in `React.StrictMode` and `BrowserRouter`, and imports global CSS.
- `src/App.tsx:10-19` defines lazy page imports.
- `src/App.tsx:85-125` defines the route table, redirects, and catch-all home route.
- `src/App.tsx:29-48` sends AlgoNerve routes to the external AlgoNerve deployment.
- `vercel.json` rewrites all paths to `index.html` so client-side routes resolve on refresh.

## Functional domains

1. **Landing and navigation** — marketing/feature discovery, portal switching, global theme, shared navbar/footer.
2. **Global learning** — DSA and C++ roadmap graphs, lessons, problem catalogue, and progress views.
3. **LPU academic portal** — CSE202/CSE205 subjects, units, topics, checklist, visualizer links, and lesson completion.
4. **Authentication and profile** — browser-local student registration/login, approval state, guest task guard, and profile editing.
5. **Student analytics** — dashboard metrics, bookmarks, solved/attempted/revision statuses, completed lessons, quiz records, and custom sets.
6. **Faculty administration** — student roster, approval/disapproval, onboarding, assigned tests, cohort telemetry, and profile editing.
7. **AlgoNerve integration** — external redirect routes plus an embedded `src/algonerve/` visualizer engine and algorithm catalogue.

## Layer architecture

| Layer | Location | Responsibility |
|---|---|---|
| Application shell | `src/main.tsx`, `src/App.tsx` | React bootstrap, routing, lazy loading, error boundary, theme, global chrome |
| Pages / route units | `src/pages/` | User-triggered screens and page-level orchestration |
| Shared UI | `src/components/` | Navbar/footer, modals, loading/error states, roadmap/problem visual components |
| Client state | `src/store/`, `src/algonerve/store/` | Zustand stores, local persistence, cross-tab synchronization |
| Static domain data | `src/data/` | Subjects, topics, lessons, problems, learning paths, visualizer mappings |
| Algorithm engine | `src/algonerve/algorithms/`, `visualizers/`, `controls/`, `inputs/` | Algorithm step generation, playback controls, narration, and visual rendering |
| Cross-cutting utilities | `src/lib/`, `src/utils/`, `src/types/` | Configuration, class helpers, external-link validation, shared types |
| Verification | `src/test/`, `scripts/runValidator.mjs` | Vitest tests and reference validation |
| Delivery | `vite.config.ts`, `vercel.json`, `.github/workflows/ci.yml` | Vite build and SPA hosting rewrite |

## Package/layer inventory

The repository contains 10 route page files, 15 shared component files, 7 data files, 11 AlgoNerve algorithm files, 8 AlgoNerve control files, 7 AlgoNerve visualizer files, 2 stores, 1 shared type module, 7 test files, and 8 root build/config files (counts from the tracked source tree; generated `dist/` and `node_modules/` are not source anchors).

## Major configuration

- `package.json` — scripts and React/Vite/TypeScript/runtime dependencies.
- `tsconfig.json` — strict ES2022 TypeScript bundler configuration with `@/*` path alias.
- `vite.config.ts` — React plugin, source alias, dev port 5173.
- `tailwind.config.js` and `postcss.config.js` — styling pipeline and theme tokens.
- `vitest.config.ts` — test runner configuration.
- `eslint.config.js` — ESLint configuration.
- `vercel.json` — history-fallback rewrite for SPA routes.

## Structural observations

- Pages are route-level lazy chunks, but shared static catalogues are imported directly into multiple pages.
- The page layer is intentionally feature-oriented rather than controller/service/repository layered.
- `src/store/userStore.ts` is the central state boundary for authentication, progress, administration, and roster synchronization.
- `src/pages/AdminPage.tsx` is a large multi-purpose page (1839 lines) and is also the implementation behind `/teacher`.
- `src/algonerve/` is a cohesive secondary application/engine embedded in the same bundle, but the current CodeNerve route table delegates `/visualize` and `/documentation` to the external AlgoNerve deployment instead of rendering these local pages.
