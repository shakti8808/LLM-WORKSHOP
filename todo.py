import os
import json
import uuid
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tasks.json')

def load_tasks():
    """Load tasks from JSON file."""
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def save_tasks(tasks):
    """Save tasks to JSON file."""
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
        return True
    except IOError:
        return False

@app.route('/')
def index():
    """Render the homepage."""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks_api():
    """Get all tasks."""
    return jsonify(load_tasks())

@app.route('/api/tasks', methods=['POST'])
def add_task_api():
    """Add a new task."""
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    category = data.get('category', '').strip()
    
    if not text:
        return jsonify({'error': 'Task description cannot be empty.'}), 400
        
    tasks = load_tasks()
    new_task = {
        'id': str(uuid.uuid4()),
        'text': text,
        'category': category,
        'completed': False
    }
    tasks.append(new_task)
    if save_tasks(tasks):
        return jsonify(new_task), 201
    return jsonify({'error': 'Failed to save task.'}), 500

@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task_api(task_id):
    """Toggle a task's completed status."""
    tasks = load_tasks()
    updated_task = None
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            updated_task = task
            break
            
    if not updated_task:
        return jsonify({'error': 'Task not found.'}), 404
        
    if save_tasks(tasks):
        return jsonify(updated_task)
    return jsonify({'error': 'Failed to update task.'}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task_api(task_id):
    """Delete a task."""
    tasks = load_tasks()
    original_len = len(tasks)
    tasks = [t for t in tasks if t['id'] != task_id]
    
    if len(tasks) == original_len:
        return jsonify({'error': 'Task not found.'}), 404
        
    if save_tasks(tasks):
        return jsonify({'success': True})
    return jsonify({'error': 'Failed to delete task.'}), 500

if __name__ == '__main__':
    import webbrowser
    from threading import Timer

    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5001/")

    # Only open browser in the main reloader thread if running in debug mode
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
        Timer(1.0, open_browser).start()

    # Run server locally on port 5001 (to avoid standard port 5000 conflict on macOS)
    app.run(host='127.0.0.1', port=5001, debug=True)
