# ⚡ OpenSpec Workshop — TaskFlow Todo Application Comparison

Welcome to the **OpenSpec Workshop** repository! This project serves as a practical, side-by-side benchmark to compare and contrast two modern development methodologies: **Vibe Coding** and **Spec-Driven Development (SDD)**.

To demonstrate these workflows, we have implemented **TaskFlow**—a clean, modern, dark-mode personal productivity dashboard—using both approaches.

---

## 🎯 Workshop Purpose

The purpose of this workshop is to examine the architectural, procedural, and qualitative differences between building applications via unstructured, rapid-prototype AI generation ("vibe coding") versus structured, contract-first, and requirements-driven engineering ("spec-driven development").

By exploring the two implementations, attendees will learn how:
1. **API Contracts & Specs** prevent requirements drift.
2. **Defensive Design & Pre-validation** mitigate edge-case bugs.
3. **Structured Workflows** improve test coverage and long-term code maintainability.

---

## ⚖️ Methodology Comparison

Below is a comparative breakdown of how the TaskFlow application was designed and constructed under each workflow:

| Feature/Aspect | 🌊 Vibe Coding (`vibe_coded_submission`) | 🛡️ Spec-Driven Development (`sdd_submission`) |
| :--- | :--- | :--- |
| **Workflow Style** | Ad-hoc, prompt-and-run iterative generation. | Contract-first, requirements-driven using OpenSpec. |
| **Backend Framework** | Zero-dependency standard library (`http.server`). | Robust Flask API framework (`todo.py`). |
| **Frontend Stack** | Vanilla JS, manual HSL color variables, basic CSS. | Modern glassmorphic dark-mode CSS, state management. |
| **Robustness & Validation**| Minimal validation, basic JSON file writes. | Thread-safe transactions, strict input validation. |
| **Specifications & Design**| Implicitly derived from conversation and feedback. | Explicitly formalized (`proposal.md`, `design.md`, `spec.md`). |
| **Testing Suite** | Simple unittest for persistence layer (`test_app.py`).| Full integration/functional test suite (`test_todo.py`). |
| **Development Speed** | Extremely fast initial prototype. | Higher upfront design time, lower debugging time. |
| **Maintainability** | High risk of regression and state desynchronization. | Zero drift, predictable extensions, and regression-proof. |

---

## 🌿 Branch Structure

To facilitate comparison, this project supports both side-by-side folder browsing and branch-based comparison:

*   **`main`**: The base landing branch. It contains the root configuration, this documentation, and **both folders** (`vibe_coded_submission/` and `sdd_submission/`) side-by-side for easy local browsing and file comparison.
*   **`vibe_coded_submission`**: Contains the complete source code, tests, and documentation for the **vibe-coded** implementation structured at the root of the branch.
*   **`sdd_submission`**: Contains the complete source code, tests, schemas, OpenSpec specifications, and documentation for the **Spec-Driven Development (SDD)** implementation structured at the root of the branch.


---

## 📁 Repository Organization

Once you switch to the respective branch, the directory structure will look as follows:

### Vibe-Coded Submission Branch
```text
├── templates/
│   └── index.html      # Main frontend HTML template
├── static/
│   ├── style.css       # Catppuccin Mocha theme stylesheet
│   └── app.js          # Client-side API and interactivity scripts
├── app.py              # Lightweight multi-threaded Python server
├── test_app.py         # Persistence layer unit tests
└── README.md           # Implementation-specific docs
```

### Spec-Driven Development Submission Branch
```text
├── openspec/            # OpenSpec contracts, requirements, and change history
│   └── specs/           # System capability specifications
├── templates/
│   └── index.html       # Server-rendered dynamic HTML template base
├── static/
│   ├── app.js           # Client-side state manager and API fetch handlers
│   └── style.css        # Glassmorphic component styles and animations
├── todo.py              # Main Flask application and server router
├── test_todo.py         # Automated integration test suite
└── README.md            # SDD implementation-specific docs
```

---

## 🚀 Getting Started

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone <repository-url>
cd openspec-workshop
```

### 2. Compare Branches
To view the code and run the application for either methodology, switch to its corresponding branch:

#### View the Vibe-Coded Implementation:
```bash
git checkout vibe_coded_submission
```

#### View the Spec-Driven Implementation:
```bash
git checkout sdd_submission
```

---

## 🛠️ Running the Implementations

### Running Vibe-Coded TaskFlow
1. Switch to the `vibe_coded_submission` branch.
2. Run the application (uses standard Python libraries, no dependencies required):
   ```bash
   python3 app.py
   ```
3. Open your browser and navigate to `http://localhost:8000`.
4. Run tests:
   ```bash
   python3 -m unittest test_app.py
   ```

### Running Spec-Driven TaskFlow
1. Switch to the `sdd_submission` branch.
2. Install Flask (required for the SDD backend):
   ```bash
   pip install flask
   ```
3. Run the application:
   ```bash
   python3 todo.py
   ```
4. Open your browser and navigate to `http://127.0.0.1:5001`.
5. Run integration tests:
   ```bash
   python3 test_todo.py
   ```

---

## 📘 Summary of Key Insights

### The Vibe Coding Experience 🌊
Vibe Coding is highly interactive and provides instant gratification. It is perfect for hackathons, prototyping, and single-developer exploratory phases. However, without a formal specification:
- Requirements easily drift as features are added.
- The state contract between frontend and backend is implicit, causing subtle data-handling bugs.
- Concurrency issues (like simultaneous database writes to `tasks.json`) are often overlooked.

### The Spec-Driven Development Experience 🛡️
SDD requires a mental shift to design-first. Before writing Python or JavaScript, we write specifications detailing exactly how endpoints must behave.
- **Contract-First**: Prevents API desynchronization.
- **Defensive Design**: Schema validation and thread-safe write locks are designed from day one.
- **Test-Driven**: Integration tests are mapped directly to spec conditions, making regressions nearly impossible.
