# CodeNerve Architecture Index

## Implementation Guide

This index is not the full contract. Do not implement from this file alone; follow the artifact paths below.

### Global artifacts

- `unit_graph.yaml` — all workers read this for route triggers, source anchors, public signatures, dependencies, and shared references. Filter by assigned `name`.
- `shared_modules.yaml` — read rows where `used_by_units` includes the assigned unit. `user-store` is a god-class/split candidate; do not duplicate its fields casually.
- `wire_contracts.yaml` — read rows where `unit` matches the assigned unit, plus `global` rows. Preserve frozen outbound routes and external-link behavior.
- `cross_unit_state.yaml` — read flows where the assigned unit is the writer or reader. Any `pairing: dynamic-key` row with `must_confirm: runtime` requires runtime verification.
- `project-structure.md`, `tech-stack.md`, and `data-model.md` — global factual views for structure, dependencies/runtime, and entities.
- `units/<unit>/unit_decomposition.yaml` — optional design evidence only; `commit: false` means candidate splits are not decisions.
- `seams.yaml` — not emitted: no declared or inferred partial-migration seam was established by this analysis.

### Unit: `home`

- external trigger: `/`
- must read `units/home/behavior.yaml`, `units/home/bindings.yaml`, and `units/home/unit_decomposition.yaml`.
- filter global rows by `unit: home`, `used_by_units`, and state writer/reader references.
- before DONE report artifact paths read, preserved landing/navigation behaviors, deferred contracts, and verification evidence.

### Unit: `roadmap`

- external trigger: `/roadmap` or `/roadmap/:pathId`
- must read `units/roadmap/behavior.yaml`, `units/roadmap/bindings.yaml`, and `units/roadmap/unit_decomposition.yaml`.
- filter global rows by `unit: roadmap`, `used_by_units`, and state references.
- before DONE report artifacts read, preserved path/view selection and activity behavior, unresolved contracts, and verification evidence.

### Unit: `problems`

- external trigger: `/problems`
- must read `units/problems/behavior.yaml`, `units/problems/bindings.yaml`, and `units/problems/unit_decomposition.yaml`.
- filter `wire_contracts.yaml` by `unit: problems`, shared modules by `used_by_units`, and state by writer/reader.
- before DONE report artifacts read, preserved filters/status/bookmark/progress behavior, outbound-link contracts, and verification evidence.

### Unit: `syllabus`

- external trigger: `/syllabus` and `/quizzes`
- must read `units/syllabus/behavior.yaml`, `units/syllabus/bindings.yaml`, and `units/syllabus/unit_decomposition.yaml`.
- filter static catalogue and completed-lesson state rows by this unit.
- before DONE report artifacts read, preserved checklist/lesson behavior, deferred quiz semantics, and verification evidence.

### Unit: `lpu-portal`

- external trigger: `/university` or `/lpu`
- must read `units/lpu-portal/behavior.yaml`, `units/lpu-portal/bindings.yaml`, and `units/lpu-portal/unit_decomposition.yaml`.
- filter static catalogue and cross-unit progress rows by this unit.
- before DONE report artifacts read, preserved subject/topic/problem/lesson behavior, unresolved contracts, and verification evidence.

### Unit: `lesson`

- external trigger: `/lesson/:lessonId`
- must read `units/lesson/behavior.yaml`, `units/lesson/bindings.yaml`, and `units/lesson/unit_decomposition.yaml`.
- filter static catalogue rows and completed-lesson state by this unit.
- before DONE report artifacts read, preserved missing-lesson and completion branches, outbound visualizer links, and verification evidence.

### Unit: `dashboard`

- external trigger: `/dashboard`
- must read `units/dashboard/behavior.yaml`, `units/dashboard/bindings.yaml`, and `units/dashboard/unit_decomposition.yaml`.
- filter shared store, static problem data, and state flows where dashboard is reader.
- before DONE report artifacts read, preserved metrics/progress/profile behavior, and verification evidence.

### Unit: `administration`

- external trigger: `/admin` and `/teacher`
- must read `units/administration/behavior.yaml`, `units/administration/bindings.yaml`, and `units/administration/unit_decomposition.yaml`.
- filter shared store rows where `used_by_units` includes administration, plus roster/test state flows.
- before DONE report artifacts read, preserved passcode gate, approvals, roster, test assignment, and profile editing behavior, and verification evidence.

### Unit: `authentication`

- external trigger: `/login`, `/signin`, `/register`
- must read `units/authentication/behavior.yaml`, `units/authentication/bindings.yaml`, and `units/authentication/unit_decomposition.yaml`.
- filter shared store and persisted-auth state rows where authentication is writer.
- before DONE report artifacts read, preserved login/registration approval branches, redirect behavior, and verification evidence.

### Unit: `algonerve-redirect`

- external trigger: `/visualize`, `/visualize/:id`, `/documentation`
- must read `units/algonerve-redirect/behavior.yaml`, `units/algonerve-redirect/bindings.yaml`, and `units/algonerve-redirect/unit_decomposition.yaml`.
- filter `wire_contracts.yaml` by this unit and `application-config` shared module.
- before DONE report artifacts read, preserved URL construction and fallback link behavior, and verification evidence.

## Analysis boundary

The artifacts describe existing source behavior and contracts. They do not select a target architecture, commit to a final unit count beyond the observed entrypoint inventory, or define deployment/test plans.
