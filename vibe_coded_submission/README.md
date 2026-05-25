# TaskFlow — Clean & Modern Todo List

A lightweight, zero-dependency Python-powered web Todo application designed with a modern Catppuccin Mocha aesthetic. This project maintains a rapid prototype nature while demonstrating a clean and standard project structure for submissions.

## 🚀 Features

- **Modern & Premium UI**: Styled with HSL variables, Catppuccin Mocha palette, soft glassmorphism, responsive grid layout, and interactive micro-animations.
- **Fast Client Dynamics**: Quick task additions, visual check toggles, animation-based removals, filtering (All, Active, Completed), and live progress tracking.
- **Lightweight Backend**: Built using standard Python library tools (`http.server` and `socketserver`). No `pip install` or virtual environments required.
- **JSON Task Persistence**: Tasks are persisted locally inside a lightweight `tasks.json` file.
- **Robust & Simple Testing**: Includes a simple test suite using Python's built-in `unittest` library to verify data persistence operations.

## 📁 Project Structure

```text
├── templates/
│   └── index.html      # Main frontend HTML template
├── static/
│   ├── style.css       # Catppuccin Mocha theme stylesheet
│   └── app.js          # Client-side API and interactivity scripts
├── app.py              # Lightweight multi-threaded Python server
├── tasks.json          # Task database persistence (auto-generated)
├── test_app.py         # Persistent layer unit tests
├── .gitignore          # Git exclusion rules
└── README.md           # Project documentation
```

## 🛠️ Getting Started

### Start the Server

Run the following command in your terminal inside the root project directory:

```bash
python3 app.py
```

The server will launch, and your default web browser will automatically open to `http://localhost:8000`.

### Run Automated Tests

To execute the unit tests and verify the database storage layer:

```bash
python3 -m unittest test_app.py
```

## ⚠️ Troubleshooting

### Port 8000 Address Already in Use (`OSError: [Errno 48]`)
If you see an error indicating that the port/address is already in use, it means another process (or a previous run of the server) is occupying port 8000. 

To free it up on macOS/Linux:
```bash
kill -9 $(lsof -t -i:8000) 2>/dev/null || echo "Port 8000 is already free"
```
Or to run the server on a different port, you can modify the `PORT` variable at the top of `app.py`.

