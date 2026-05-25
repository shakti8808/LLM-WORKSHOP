## MODIFIED Requirements

### Requirement: Add Tasks
The system SHALL allow the user to add a new task with a text description and an optional category tag.

#### Scenario: Add a valid task
- **WHEN** the user inputs a non-empty task description, selects an optional category tag, and triggers the add action
- **THEN** the system SHALL add the task to the list and display it as uncompleted, saving the selected category

### Requirement: Local JSON Storage
The system SHALL persist the list of tasks including their category tags locally in a JSON file.

#### Scenario: Load tasks on startup
- **WHEN** the application starts
- **THEN** the system SHALL read and load the tasks (including their category tags) from the local JSON file if it exists, or create a new empty JSON file if it does not

#### Scenario: Save tasks on change
- **WHEN** a task is added, completed, or deleted
- **THEN** the system SHALL write the updated list of tasks (including their category tags) to the local JSON file
