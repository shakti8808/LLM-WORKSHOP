# ⚡ TaskFlow — Spec-Driven Todo Application

TaskFlow is a lightweight, modern personal productivity dashboard designed for the OpenSpec Workshop. It serves as a benchmark implementation demonstrating the power of **Spec-Driven Development (SDD)** in building robust, maintainable applications compared to typical "vibe coding" approaches.

TaskFlow intentionally avoids over-engineering—relying on a lightweight Python framework with local file persistence to provide a clean, demo-friendly codebase that is easily understandable for workshop attendees.

---

## 🎯 The SDD Goal

The goal of using Spec-Driven Development in this project is to establish a **contract-first workflow**. Before any application logic is written, capabilities and schemas are formalized. This ensures:
1. **Zero Drift**: Requirements and code implementation remain in lockstep.
2. **Defensive Design**: Edge cases (like thread safety, empty validation, and input sanitization) are handled upfront rather than patched after failures.
3. **Traceability**: Every code modification maps directly to a trackable requirement scenario.

---

## ✨ Features

* **Task Lifecycle Management**: Create new tasks, toggle task completion states, and delete outdated tasks.
* **Category Tagging**: Organize tasks by custom category tags (e.g., *Work*, *Personal*, *Shopping*).
* **Dynamic Stats Panel**: Track focus metrics in real-time including total tasks, active tasks, completed tasks, and a dynamic progress percentage indicator.
* **Local JSON Persistence**: Thread-safe database transactions saved directly to a local JSON file.
* **Modern Glassmorphic Dark-Mode UI**: Harmonies of HSL colors, smooth sliding filter controls, custom checkboxes, and responsive styles.

---

## 🛠️ Tech Stack

* **Backend**: Python 3 & [Flask](https://flask.palletsprojects.com/) (serving templates and JSON APIs)
* **Frontend**: Vanilla JavaScript (ES6), CSS Custom Properties, and HTML5 semantic markup
* **Database**: Disk-backed local JSON serialization
* **Testing**: Python standard `unittest` framework

---

## 📁 File Structure Overview

The project adheres to a lightweight, flat directory layout that keeps assets highly modular:

```text
sdd_submission/
├── .agent/              # Agent workflow configurations and helper tools
├── openspec/            # OpenSpec contracts, requirements, and archived changes
│   └── specs/           # System capability specifications (todo-management, category-management)
├── templates/
│   └── index.html       # Server-rendered dynamic HTML template base
├── static/
│   ├── app.js           # Client-side state manager and API fetch handlers
│   └── style.css        # Glassmorphic component styles and animations
├── todo.py              # Main Flask application and server router
├── tasks.json           # Local JSON database store
├── test_todo.py         # Automated integration test suite
├── .gitignore           # Version control ignore lists
└── README.md            # Workshop documentation
```

---

## 🔄 The OpenSpec Workflow

This project was built using the formal OpenSpec lifecycle:

```
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
 │   EXPLORE    │ ───▶ │   PROPOSE    │ ───▶ │    TASKS     │ ───▶ │    APPLY     │
 └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
  Sketch ideas,         Define proposals      Break down into       Iterative code
  map dependencies,     & specs before        modular checklist     writing and test
  evaluate risks.       writing code.         tasks.                validations.
```

1. **Explore (`/opsx-explore`)**: Thinking and design phase. We investigated storage mechanisms, thread-safety, and folder organizations without writing code.
2. **Propose (`/opsx-propose`)**: Scope and Contract definition. We generated the `proposal.md` (what and why), `design.md` (how, tradeoffs, and risks mitigation), and `spec.md` (normative SHALL/MUST requirements and WHEN/THEN scenarios).
3. **Tasks**: Planning checklist. Requirements are broken down into trackable, checkbox-formatted task lists in `tasks.md`.
4. **Apply (`/opsx-apply`)**: Code execution phase. Code is implemented incrementally following the checklist order, validating each task using automated tests before proceeding.

---

## 🚀 Running the Project Locally

### 1. Installation & Setup
Ensure you have Python 3 installed. Install the Flask framework:
```bash
pip install flask
```

### 2. Launch the Application
Start the server from the root directory:
```bash
python3 todo.py
```
* **Host**: Runs on `http://127.0.0.1:5001/` (port `5001` is selected to avoid port conflicts with AirPlay on macOS Monterey and later).
* **Automatic Launch**: The script will automatically launch your default web browser to the homepage.

### 3. Usage Instructions
* **Create Task**: Type a title, select a category, and click **Add** or press `Enter`.
* **Complete Task**: Click the checkbox next to any task to trigger a completion toggle.
* **Filter List**: Use the segmented control bar to filter tasks by *All*, *Active*, or *Completed*.
* **Delete Task**: Click the trash icon next to a task to delete it from disk.

---

## 🧪 Running Validation Tests

To ensure the codebase continues to behave exactly as specified by the OpenSpec contracts:
```bash
python3 test_todo.py
```
This runs the integration test suite, validating CRUD APIs, validation failures, categories, and statistics computing.

---

## ⚖️ SDD vs. Vibe Coding

In a typical **vibe coding** workflow, developer agents write ad-hoc code snippets on the fly. This often results in:
* **Uncoordinated State**: Inconsistent payload structures between client and server.
* **Regression Bugs**: Adding a new tag or filter category might break existing task parsing or delete routines.
* **Lack of Concurrency Guardrails**: Unprotected file writing leading to corrupted data when requests overlap.

**Spec-Driven Development** prevents this. The spec file forces a design freeze on APIs and data shapes. We built TaskFlow with thread-safe file operations, strict Pydantic/Pillow validations, and structured endpoints because our specs explicitly demanded it before a single line of code was generated.

---

## 🔮 Future Improvements

While keeping this project lightweight for demonstration purposes, future extensions under SDD include:
* **Task Prioritization**: Introducing high/medium/low priority tags with custom styling.
* **Due Dates**: Adding calendar selectors and overdue highlight states.
* **Local Web Storage Synchronization**: Adding full offline-first functionality that syncs local storage back to the server when network state recovers.
