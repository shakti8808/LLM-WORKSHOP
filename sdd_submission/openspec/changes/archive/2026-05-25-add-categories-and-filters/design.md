## Context

We are adding task categorization and dynamic filtering features to the existing Flask Todo application. The existing codebase is stable, utilizing a JSON-based local database and a clean, glassmorphic UI.

## Goals / Non-Goals

**Goals:**
- Enable users to choose a category (e.g., `Work`, `Personal`, `Shopping`, `Urgent`) when creating a task.
- Display category tag badges on task cards using custom color-coded styles.
- Add category filter pills at the top of the task list to dynamically filter tasks.
- Keep the offline/localStorage mode fully operational with category tagging and filtering.
- Persist categories in `tasks.json`.

**Non-Goals:**
- Custom category creation (pre-defined list is sufficient to keep the project lightweight).
- Multi-category assignment to a single task.

## Decisions

### Category Definitions and UI Spacing
- **Decision:** Use a predefined set of categories with dedicated visual styles:
  - `Work`: Blue (`#3b82f6`)
  - `Personal`: Green (`#10b981`)
  - `Shopping`: Orange (`#f59e0b`)
  - `Urgent`: Red (`#ef4444`)
- **Rationale:** Keeps CSS simple and avoids complex data models for user-defined tags, while satisfying the "simple and modern UI" requirement.

### Backend Data Migration
- **Decision:** Update the backend schema to include an optional `category` string field. Existing tasks in `tasks.json` that lack the `category` key will default to an empty string (no category) without crashing.
- **Rationale:** Ensures backward compatibility with existing data in `tasks.json`.

### Frontend Component Layout
- **Decision:**
  - Insert a styled `<select>` element in the task form.
  - Insert a `.filter-bar` containing filter pills (`All`, `Work`, `Personal`, `Shopping`, `Urgent`) right above the task list.
  - Filter tasks completely in JavaScript (frontend side) to maintain ultra-fast performance without reloading or sending HTTP requests for filter changes.

## Risks / Trade-offs

- **Risk:** Existing tasks in `tasks.json` do not have the `category` attribute.
  - *Mitigation:* The backend load function and frontend rendering function will gracefully handle missing or empty `category` fields.
