## ADDED Requirements

### Requirement: Add Tasks
The system SHALL allow the user to add a new task with a text description.

#### Scenario: Add a valid task
- **WHEN** the user inputs a non-empty task description and triggers the add action
- **THEN** the system SHALL add the task to the list and display it as uncompleted

### Requirement: Mark Tasks as Completed
The system SHALL allow the user to mark an active task as completed.

#### Scenario: Mark a task completed
- **WHEN** the user selects an active task and triggers the complete action
- **THEN** the system SHALL update the task status to completed and update its visual presentation

### Requirement: Delete Tasks
The system SHALL allow the user to delete any task from the list.

#### Scenario: Delete a task
- **WHEN** the user selects a task and triggers the delete action
- **THEN** the system SHALL remove the task from the list and from the interface

### Requirement: Local JSON Storage
The system SHALL persist the list of tasks locally in a JSON file.

#### Scenario: Load tasks on startup
- **WHEN** the application starts
- **THEN** the system SHALL read and load the tasks from the local JSON file if it exists, or create a new empty JSON file if it does not

#### Scenario: Save tasks on change
- **WHEN** a task is added, completed, or deleted
- **THEN** the system SHALL write the updated list of tasks to the local JSON file

### Requirement: Modern Web Interface
The system SHALL provide a clean and modern user interface rendered in a web browser using HTML, CSS, and templates.

#### Scenario: Access the home page
- **WHEN** the user navigates to the application URL in a web browser
- **THEN** the system SHALL display a webpage showing the tasks list, input field, and task action buttons
