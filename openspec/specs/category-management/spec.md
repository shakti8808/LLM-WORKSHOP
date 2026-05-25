# category-management Specification

## Purpose
TBD - created by archiving change add-categories-and-filters. Update Purpose after archive.
## Requirements
### Requirement: Category Selection
The system SHALL allow the user to assign a category tag to a task when adding it.

#### Scenario: Add task with category
- **WHEN** the user selects a category (e.g., "Work") from the dropdown list and submits the task
- **THEN** the system SHALL create the task with that category tag and display it in the list with the category badge

### Requirement: Category Display
The system SHALL display the category tag as a colored badge on the task card.

#### Scenario: Render task category badge
- **WHEN** a task with a category is rendered in the list
- **THEN** the system SHALL display a colored tag badge matching the task's category

### Requirement: Category Filtering
The system SHALL allow the user to filter tasks dynamically based on their category.

#### Scenario: Filter tasks by category
- **WHEN** the user clicks on a category filter pill (e.g., "Work")
- **THEN** the system SHALL show only the tasks that belong to the selected category, adjusting the task count and progress bar accordingly

