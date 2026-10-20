# CodeNerve Existing Technology Stack

## Runtime and language

- TypeScript with strict checking (`tsconfig.json`, `strict: true`).
- React 19.3.0 and React DOM 19.3.0.
- Vite 8.3.0 with `@vitejs/plugin-react` 6.1.2.
- Browser target is ES2022 with DOM libraries.
- Package is ESM (`"type": "module"`).
- README states Node.js 18+ as the local prerequisite; `package.json` does not declare an `engines` field.

## Frameworks and libraries

| Area | Dependency | Declared version |
|---|---|---|
| UI | react, react-dom | ^19.3.0 |
| Routing | react-router-dom | ^7.18.4 |
| State | zustand | ^5.0.15 |
| Styling | tailwindcss | ^3.4.19 |
| CSS processing | postcss, autoprefixer | ^8.5.30, ^10.6.1 |
| Animation | framer-motion | ^14.1.0 |
| Icons | lucide-react | ^1.55.0 |
| Visualization | d3 | ^7.9.0 |
| Code display | react-syntax-highlighter | ^16.1.2 |
| Supabase SDK | @supabase/supabase-js | ^2.117.3 |
| Build | vite | ^8.3.0 |
| Type system | typescript | ~6.0.2 |
| Tests | vitest, jsdom, Testing Library | ^5.0.4, ^29.1.1, ^16.3.3 |
| Lint | eslint and TypeScript/React plugins | ^10.12.0 and declared plugin ranges |

## Build and validation

- `npm run dev` starts Vite.
- `npm run build` runs `tsc` followed by `vite build`.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm run lint` runs ESLint over the repository.
- `npm test` runs Vitest once.
- `npm run validate` runs `scripts/runValidator.mjs`.

## Existing integrations and persistence

- Supabase Auth and Postgres through `@supabase/supabase-js`; configuration is read from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Zustand `persist` now stores only UI preferences under `codenerve_preferences_v3`; learner progress is synchronized with Supabase.
- Browser `BroadcastChannel('codenerve_cohort_sync')` and the `storage` event synchronize persisted state across tabs.
- External navigation to `https://algonerve.vercel.app` and external coding-platform URLs stored in problem data.
- `src/lib/supabase.ts` creates the browser Supabase client when the public environment variables are configured.
- `src/lib/supabaseData.ts` owns Auth, profile, progress, bookmark, lesson, and quiz persistence calls.
- `google-apps-script/` and `supabase/` directories exist in the workspace but contain no tracked files in the current repository snapshot.

## Framework/runtime wiring

- `BrowserRouter` is mounted in `src/main.tsx`.
- Route components are lazy-loaded with `React.lazy` and rendered under `Suspense`.
- All route content is wrapped by the page-level `ErrorBoundary`.
- Tailwind dark/light classes are toggled on `document.documentElement` by `App.tsx` and by the persisted-store rehydration path.

## Existing constraints

- SPA history fallback is required for deep links and is supplied by `vercel.json`.
- Browser APIs are used directly, so server-side rendering is not represented in the current runtime.
- The admin passcodes and student records are client-side logic/state, not a server-enforced authentication boundary.
