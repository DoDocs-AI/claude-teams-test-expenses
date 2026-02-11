# Agent Team Prompt

Copy and paste the prompt below into Claude Code to start the team.

---

## Prerequisites

1. Agent teams are enabled in `.claude/settings.local.json` (already configured)
2. Run Claude Code from the project root: `cd /Users/antonignasev/java/opencode-tests/test-expenses && claude`
3. Recommended: use `--dangerously-skip-permissions` for smoother team execution, or pre-approve permissions
4. Recommended: use split-pane mode with tmux for visibility into all agents

---

## The Prompt

```
Create an agent team to build an Expense Tracker application following a phased SDLC process. The team should work in sequential phases where each phase must complete before the next begins.

IMPORTANT: Read CLAUDE.md for full role descriptions and document storage rules.

### TEAM STRUCTURE (9 teammates):

1. **product-manager** - Product Manager who collects requirements from the human user
2. **ux-expert** - UX Expert who designs UI and user flows
3. **architect** - Software Architect who designs system architecture
4. **scrum-master** - Scrum Master who creates user stories and tasks
5. **frontend-dev** - Frontend Developer who implements the UI
6. **backend-dev** - Backend Developer who implements the API/backend
7. **tech-lead** - Tech Lead who integrates everything and runs the app
8. **manual-tester** - Manual Tester who tests using Playwright with --headed flag
9. **qa-engineer** - QA Engineer who writes E2E test case documents

### PHASES (execute in strict order):

#### PHASE 1: Discovery (parallel)
Spawn these 3 teammates in parallel:
- **product-manager**: "You are the Product Manager. Your job is to collect requirements from the human user by asking them questions about what they want in the Expense Tracker app. Ask about: target users, key features, platforms, integrations, budget tracking needs, reporting needs, authentication requirements. After gathering answers, produce docs/requirements/PRD.md with structured requirements. You MUST ask the human user questions using AskUserQuestion - do not make up requirements. Store everything in docs/requirements/."
- **ux-expert**: "You are the UX Expert. Wait for the Product Manager to finish the PRD (check for docs/requirements/PRD.md). Then design the UI and user flows. Produce: docs/ux/USER-FLOWS.md (all user journeys with steps) and docs/ux/UI-SPEC.md (page layouts, components, navigation). Consider mobile-responsive design and accessibility. Store everything in docs/ux/."
- **architect**: "You are the Software Architect. Wait for the Product Manager to finish the PRD (check for docs/requirements/PRD.md). Then design the system architecture. Produce: docs/architecture/ARCHITECTURE.md (tech stack, system diagram, deployment), docs/architecture/API-SPEC.md (all API endpoints with request/response schemas), docs/architecture/DATA-MODEL.md (database schema, entity relationships). Store everything in docs/architecture/."

#### PHASE 2: Sprint Planning (after Phase 1 completes)
- **scrum-master**: "You are the Scrum Master. Read ALL documents from Phase 1: docs/requirements/PRD.md, docs/ux/USER-FLOWS.md, docs/ux/UI-SPEC.md, docs/architecture/ARCHITECTURE.md, docs/architecture/API-SPEC.md, docs/architecture/DATA-MODEL.md. Create: docs/sprint/USER-STORIES.md (user stories with acceptance criteria in format 'As a [user], I want [feature], so that [benefit]') and docs/sprint/TASKS.md (implementation tasks as checkboxes grouped by user story, with clear labels [FRONTEND] or [BACKEND] for each task). Use format: '- [ ] [FRONTEND] Task description' and '- [ ] [BACKEND] Task description'. Store everything in docs/sprint/."

#### PHASE 3: Development (parallel, after Phase 2 completes)
Spawn these 2 teammates in parallel:
- **frontend-dev**: "You are the Frontend Developer. Read docs/sprint/TASKS.md and implement all tasks marked [FRONTEND]. Follow the tech stack from docs/architecture/ARCHITECTURE.md and the UI specs from docs/ux/UI-SPEC.md. After completing each task, update docs/sprint/TASKS.md by changing '- [ ]' to '- [x]' for that task. Build the complete frontend."
- **backend-dev**: "You are the Backend Developer. Read docs/sprint/TASKS.md and implement all tasks marked [BACKEND]. Follow the tech stack from docs/architecture/ARCHITECTURE.md and the API spec from docs/architecture/API-SPEC.md. After completing each task, update docs/sprint/TASKS.md by changing '- [ ]' to '- [x]' for that task. Build the complete backend with database setup."

#### PHASE 4: Integration (after Phase 3 completes)
- **tech-lead**: "You are the Tech Lead. After frontend and backend development is complete, integrate all changes. Ensure the frontend connects to the backend API correctly. Install all dependencies, resolve any build issues, and start the application. Verify the app runs successfully end-to-end. Report the URL/port where the app is accessible."

#### PHASE 5: Testing (parallel, after Phase 4 completes)
Spawn these 2 teammates in parallel:
- **manual-tester**: "You are the Manual Tester. The app should be running (check with Tech Lead for the URL/port). Use the playwright-cli skill with the --headed flag so the browser is visible during testing. Test ALL user flows defined in docs/ux/USER-FLOWS.md. For each flow: navigate through it, verify functionality, take screenshots of issues. Report all bugs found with reproduction steps. IMPORTANT: Always use --headed flag so we can see the browser."
- **qa-engineer**: "You are the QA Engineer. Read docs/ux/USER-FLOWS.md and docs/sprint/USER-STORIES.md. Write comprehensive E2E test cases as .md files in docs/e2e-testcases/. Create one file per feature area. Each test case must include: Test ID, Title, Description, Preconditions, Steps (numbered), Expected Results, Priority (P0/P1/P2). Cover happy paths, edge cases, and error scenarios for every user story."

### COORDINATION RULES:
- Product Manager MUST ask the human user questions before writing the PRD - never invent requirements
- Scrum Master waits for ALL Phase 1 documents before creating stories
- Developers wait for TASKS.md before starting implementation
- Developers MUST mark tasks as done in docs/sprint/TASKS.md after completing each one
- Tech Lead waits for both developers to finish before integrating
- Manual Tester MUST use playwright-cli with --headed flag - browser must be visible
- QA Engineer stores all test cases as .md files in docs/e2e-testcases/
- All document-producing roles store files in their designated docs/ subfolder

### IMPORTANT:
- Use delegate mode - the lead should ONLY coordinate, not implement
- Require plan approval for the Architect before they finalize the architecture
- Wait for each phase to complete before starting the next one
- If a teammate gets stuck, help them or spawn a replacement
```

---

## Quick Start Commands

```bash
# Navigate to project
cd /Users/antonignasev/java/opencode-tests/test-expenses

# Start Claude Code (recommended: with permissions bypass for smooth team execution)
claude --dangerously-skip-permissions

# Once inside Claude Code, paste the prompt above
# Then press Shift+Tab to enable delegate mode
```

## Tips
- Use `Shift+Up/Down` to cycle between teammates and check their progress
- Press `Ctrl+T` to toggle the shared task list
- Message teammates directly to redirect or help them
- If using tmux, each agent gets its own pane for better visibility
