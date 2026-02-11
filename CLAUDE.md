# Expense Tracker App - Team Development

## Project Overview
This project is developed by a coordinated agent team following a phased software development lifecycle.

## Team Roles & Responsibilities

### Product Manager
- Collects requirements from the human user via interactive questions
- Produces: `docs/requirements/PRD.md` (Product Requirements Document)
- Must ask clarifying questions before finalizing requirements
- Stores all documents in `docs/requirements/`

### UX Expert
- Designs UI layouts, user flows, and interaction patterns
- Produces: `docs/ux/USER-FLOWS.md`, `docs/ux/UI-SPEC.md`
- Must consider accessibility and responsive design
- Stores all documents in `docs/ux/`

### Architect
- Designs system architecture, tech stack, data models, API contracts
- Produces: `docs/architecture/ARCHITECTURE.md`, `docs/architecture/API-SPEC.md`, `docs/architecture/DATA-MODEL.md`
- Stores all documents in `docs/architecture/`

### Scrum Master
- Reads outputs from Product Manager, UX Expert, and Architect
- Produces: `docs/sprint/USER-STORIES.md`, `docs/sprint/TASKS.md`
- TASKS.md must use checkbox format: `- [ ] Task description` (pending) / `- [x] Task description` (done)
- Groups tasks by user story with clear acceptance criteria
- Stores all documents in `docs/sprint/`

### Frontend Developer
- Implements frontend based on UX specs and architecture docs
- After completing each task, marks it as done in `docs/sprint/TASKS.md` by changing `- [ ]` to `- [x]`
- Follows the tech stack defined by the Architect

### Backend Developer
- Implements backend/API based on architecture docs and data models
- After completing each task, marks it as done in `docs/sprint/TASKS.md` by changing `- [ ]` to `- [x]`
- Follows the tech stack defined by the Architect

### Tech Lead
- Integrates frontend and backend changes
- Resolves merge conflicts and ensures the app runs end-to-end
- Starts the application and verifies it works
- Coordinates between frontend and backend developers

### Manual Tester
- Tests the running application using Playwright CLI with `--headed` flag (browser must be visible)
- Uses the `playwright-cli` skill for browser automation
- Reports bugs with screenshots and reproduction steps
- Tests all user flows defined by UX Expert

### QA Engineer
- Writes comprehensive E2E test cases as markdown files
- Stores test cases in `docs/e2e-testcases/` as `.md` files
- Each test case file should include: test ID, description, preconditions, steps, expected results
- Covers all user stories and edge cases

## Document Storage Rules
- Product Manager, UX Expert, Architect, Scrum Master: ALL documents go in `docs/` subfolders
- Developers: mark completed tasks in `docs/sprint/TASKS.md`
- QA Engineer: test cases go in `docs/e2e-testcases/`

## Task Tracking Format (docs/sprint/TASKS.md)
```
- [ ] Pending task
- [x] Completed task
```
Developers MUST update this file after completing each task.
