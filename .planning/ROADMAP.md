# SmartPrep Roadmap

## Dependencies
- Must have local PostgreSQL running on port 5432.
- Spring Boot application configured properties must point to the local DB correctly.

---

## Phase 1: Core Entity Schemas & Basic API Layer
**Goal:** Establish DB baseline and API skeleton.
- [ ] Create `User`, `Task`, `Goal`, `Pomodoro` models in `com.smartprep.model` with proper JPA annotations.
- [ ] Create associated `Repository` interfaces extending `JpaRepository`.
- [ ] Enable explicit DTO records mapped manually or via MapStruct/ModelMapper.

## Phase 2: Refactoring Frontend Core (Task Services)
**Goal:** Hook the UI strictly into backend Tasks database.
- [ ] Refactor `taskService.js` to dispatch Axios `GET`, `POST`, `PUT`, `DELETE` commands mapping to Phase 1's backend endpoints.
- [ ] Clean all occurrences of `sp_tasks` from `localStorage`.
- [ ] Re-wire `TaskTracker.jsx` and `StudyPlanner.jsx` to natively consume the database REST feed.

## Phase 3: Pomodoro & Analytics Migration
**Goal:** Remote tracking of study metrics.
- [ ] Create API routes for adding completed `Pomodoro` objects securely.
- [ ] Refactor `Analytics.jsx` to run GET mappings fetching total completed goals directly from DB tables rather than compiling via React.

## Phase 4: Goal and Notification Upgrades
**Goal:** Migrate complex targets / Validate Backend Integrity 
- [x] Migrate `sp_goals` to the external API schema.
- [x] Overhaul `Dashboard.jsx` target metrics.
- [x] Validate end-to-end security pipeline via the native `authSlice.js` JWT tokens natively replacing the planned mock-oauth approach.

---

## Epic 2: Structured MVP — Discipline, Tracking & Consistency

## Phase 5: Timetable System
**Goal:** Fixed, recurring weekly schedule architecture.
- [ ] Create `TimetableSlot` JPA entity with day-of-week, time, subject mapping.
- [ ] Build `TimetableController` with GET/POST/DELETE endpoints.
- [ ] Create frontend `Timetable.jsx` page — a visual 7-day grid editor.
- [ ] Add Timetable link to Sidebar navigation.

## Phase 6: Revision Engine & Spaced Repetition
**Goal:** Structured revision planner with difficulty tagging.
- [ ] Create `RevisionTask` JPA entity (topicId, priority: Easy/Medium/Hard, scheduledDate).
- [ ] Build `RevisionController` REST endpoints.
- [ ] Create frontend `/revision` page (`RevisionPlanner.jsx`) with upcoming calendar view.
- [ ] Add difficulty-based topic tagging inside SubjectManager.

## Phase 7: Study Heatmap & Missed Task Alerts
**Goal:** Visual consistency tracking & deadline notifications.
- [ ] Compute missed task flags on backend when `scheduledDate` has passed and status ≠ completed.
- [ ] Implement GitHub-style Study Heatmap on Dashboard using Pomodoro logs.
- [ ] Add missed task alert badges to TaskTracking and Dashboard.
