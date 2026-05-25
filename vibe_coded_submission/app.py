#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import uuid
import time
import webbrowser
import threading

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tasks.json")

# --- DATA STORAGE MANAGEMENT ---

def load_tasks():
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading tasks: {e}")
        return []

def save_tasks(tasks):
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving tasks: {e}")


# --- HTTP REQUEST HANDLER ---

class TodoRequestHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Clean up console logs by printing standard format
        print(f"[{self.log_date_time_string()}] {format % args}")

    def do_GET(self):
        # Serve frontend page
        if self.path in ('/', '/index.html'):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            
            try:
                dir_path = os.path.dirname(os.path.abspath(__file__))
                file_path = os.path.join(dir_path, 'templates', 'index.html')
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            except Exception as e:
                self.send_error(500, f"Error reading templates/index.html: {e}")
                
        # Serve static assets
        elif self.path.startswith('/static/'):
            try:
                # Remove query parameters if any (e.g. style.css?v=1)
                clean_path = self.path.split('?')[0]
                relative_path = clean_path.lstrip('/')
                
                # Check for path traversal attacks
                dir_path = os.path.dirname(os.path.abspath(__file__))
                file_path = os.path.abspath(os.path.join(dir_path, relative_path))
                static_dir = os.path.abspath(os.path.join(dir_path, 'static'))
                
                if file_path.startswith(static_dir) and os.path.exists(file_path) and os.path.isfile(file_path):
                    self.send_response(200)
                    if file_path.endswith('.css'):
                        self.send_header('Content-Type', 'text/css; charset=utf-8')
                    elif file_path.endswith('.js'):
                        self.send_header('Content-Type', 'application/javascript; charset=utf-8')
                    elif file_path.endswith('.png'):
                        self.send_header('Content-Type', 'image/png')
                    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                        self.send_header('Content-Type', 'image/jpeg')
                    elif file_path.endswith('.svg'):
                        self.send_header('Content-Type', 'image/svg+xml')
                    else:
                        self.send_header('Content-Type', 'application/octet-stream')
                    self.end_headers()
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                    return
            except Exception as e:
                print(f"Error serving static file: {e}")
            
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"404 Not Found")

        # API: Get task list
        elif self.path == '/api/tasks':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            tasks = load_tasks()
            self.wfile.write(json.dumps(tasks).encode('utf-8'))
            
        # Icon ignore
        elif self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b""
        
        # Helper to parse JSON body safely
        def get_json_body():
            try:
                return json.loads(post_data.decode('utf-8'))
            except Exception:
                return {}

        # API: Add Task
        if self.path == '/api/tasks/add':
            body = get_json_body()
            text = body.get('text', '').strip()
            if not text:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Task text cannot be empty"}).encode('utf-8'))
                return
                
            tasks = load_tasks()
            new_task = {
                "id": uuid.uuid4().hex,
                "text": text,
                "completed": False,
                "created_at": time.time()
            }
            # Put new task at the top
            tasks.insert(0, new_task)
            save_tasks(tasks)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(new_task).encode('utf-8'))
            
        # API: Toggle Task Completion
        elif self.path == '/api/tasks/toggle':
            body = get_json_body()
            task_id = body.get('id')
            completed = body.get('completed', False)
            
            tasks = load_tasks()
            updated = False
            for task in tasks:
                if task["id"] == task_id:
                    task["completed"] = completed
                    updated = True
                    break
            
            if updated:
                save_tasks(tasks)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Task not found"}).encode('utf-8'))
                
        # API: Delete Task
        elif self.path == '/api/tasks/delete':
            body = get_json_body()
            task_id = body.get('id')
            
            tasks = load_tasks()
            original_len = len(tasks)
            tasks = [t for t in tasks if t["id"] != task_id]
            
            if len(tasks) < original_len:
                save_tasks(tasks)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Task not found"}).encode('utf-8'))
                
        # API: Clear Completed Tasks
        elif self.path == '/api/tasks/clear-completed':
            tasks = load_tasks()
            tasks = [t for t in tasks if not t["completed"]]
            save_tasks(tasks)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))


# --- SERVER RUN LOGIC ---

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    pass

def start_server():
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, TodoRequestHandler)
    print(f"🚀 TaskFlow Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server.")
    
    # Auto-open browser in a separate thread after 1 second delay
    threading.Timer(1.0, lambda: webbrowser.open(f"http://localhost:{PORT}")).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    start_server()
