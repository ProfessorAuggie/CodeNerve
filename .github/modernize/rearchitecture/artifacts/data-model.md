# CodeNerve Existing Data Model

## Persistence model

The runtime model uses Supabase Auth plus Postgres tables protected by row-level security. Zustand remains the UI state/cache boundary, but learner progress is loaded from and written to Supabase. Static educational content is compiled into TypeScript modules.

## Entity inventory

### UserProfile (`src/types/index.ts:15`)

Fields: `id`, `name`, `email`, `role`, `university`, `semester`, optional `avatar`, `registrationNumber`, `batch`, `track`, and `approvalStatus`. This is the active browser session profile.

### StudentRecord (`src/types/index.ts:158`)

Fields: identity/contact, registration number, avatar, university/semester, track, batch, joined/active status, current activity, last active marker, solved problem IDs, total solved, completed lesson IDs, quiz score map, optional assigned-test submissions, and approval status. The admin roster and student login both use this record.

### ProblemProgress (`src/types/index.ts:116`)

Keyed by `problemId` in the store. Stores status (`NOT_STARTED`, `ATTEMPTED`, `SOLVED`, `REVISION_NEEDED`), first attempt, solved timestamp, last update, notes, and submission URL.

### AssignedTest (`src/types/index.ts:184`)

Stores test title/description, target track and batch, optional subject code, problem IDs, duration, marks, due date, creator, creation time, assigned count, and submission count.

### Problem (`src/types/index.ts:91`)

Static catalogue entity with title/slug/description, external platform URL, difficulty, tags, track, type, estimated time, prerequisites, active/verification metadata, and learning-path/syllabus relationships.

### Lesson (`src/types/index.ts:66`)

Static lesson entity with objectives, prerequisites, Markdown content, code examples, complexity, related visualizer/problem IDs, and topic relationships.

### Subject → Unit → Topic (`src/types/index.ts:37-64`)

Static academic hierarchy. Subjects have university/semester/credits/outcomes/textbooks/references/practicals and units; units have numbered topics; topics have prerequisites, ordering, optional lesson/visualizer links, and problem IDs.

### LearningPath → LearningPathGroup → LearningPathItem (`src/types/index.ts:132-155`)

Static prerequisite-aware roadmap model for DSA, C++, interview preparation, and university paths.

### Quiz → QuizQuestion (`src/types/index.ts:164-182`)

Types support multiple choice/select, short answer, and code-trace questions, with answers, explanations, difficulty, and optional code snippets. The current route table does not expose a dedicated quiz runner; `/quizzes` maps to `SyllabusPage`.

## Relationships and references

- `Topic.lessonId` and `Lesson.topicIds` connect academic topics to lesson content.
- `Topic.visualizerId`, `Lesson.relatedVisualizerId`, and `VisualizerMapping.topicIds` connect curriculum content to AlgoNerve IDs.
- `Topic.problemIds`, `Lesson.relatedProblemIds`, and `Problem.syllabusUnitIds` connect curriculum to the external problem catalogue.
- `LearningPathItem.referenceId` points to lesson, problem, visualization, or quiz IDs based on its `type`.
- `StudentRecord.solvedProblemIds`, `completedLessons`, and `quizScores` mirror active `UserState` progress for faculty visibility.
- `AssignedTest.problemIds` points to static `Problem` records; submissions are stored inside `StudentRecord.assignedTestSubmissions`.

## Persistence tables

- `profiles` — Supabase-authenticated student/faculty profile and approval state.
- `problem_progress` — one row per user/problem status and notes.
- `problem_bookmarks` — one row per user/bookmarked problem.
- `lesson_progress` — one row per user/lesson completion.
- `quiz_scores` — one row per user/quiz result.

## Transaction boundaries

The current client uses independent Supabase upserts/deletes per learner action; there is no multi-table database transaction boundary. Zustand actions update the in-memory view and issue remote writes. Theme and portal preferences may be cached locally; learner progress is not persisted to localStorage when Supabase is configured.

## Key entities summary

1. `UserProfile` — current browser identity and portal/role selection.
2. `StudentRecord` — roster identity plus replicated learning telemetry.
3. `ProblemProgress` — per-problem learning status and notes.
4. `Problem` — curated external coding-problem catalogue entry.
5. `Subject`/`Unit`/`Topic` — LPU academic curriculum hierarchy.
6. `Lesson` — structured concept explanation and code examples.
7. `LearningPath` — global DSA/C++ dependency roadmap.
8. `AssignedTest` — faculty-created problem assignment metadata.
