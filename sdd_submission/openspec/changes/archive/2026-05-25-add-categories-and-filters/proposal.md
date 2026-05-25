## Why

Users need a way to organize their tasks by category (e.g. Work, Personal, Shopping) and filter the task list to focus on specific work categories, rather than viewing one long unorganized list.

## What Changes

- Add category tags to tasks (e.g., Work, Personal, Shopping, Urgent).
- Include a category selection dropdown in the task input form.
- Add category filter pills at the top of the task list to allow dynamic filtering.
- Update task cards in the list to display their corresponding category tag with color-coded badges.

## Capabilities

### New Capabilities

- `category-management`: Capability to tag tasks with categories, select categories when adding a task, and filter tasks based on selected categories.

### Modified Capabilities

- `todo-management`: Extend existing task creation, display, and serialization schemas to support category attributes.

## Impact

- **Database/JSON Schema**: Updates task objects in `tasks.json` to store a `category` property.
- **Backend API**: The `POST /api/tasks` endpoint will accept a `category` value.
- **Frontend App**: UI gets updated to support a category dropdown, category badges on task items, and filter pill buttons.
