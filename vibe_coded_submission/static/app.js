let tasks = [];
let currentFilter = 'All'; // 'All' | 'Active' | 'Completed'

// HTML elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const taskList = document.getElementById('task-list');
const remainingBadge = document.getElementById('remaining-badge');
const progressBar = document.getElementById('progress-bar');
const statsSummary = document.getElementById('stats-summary');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// On Load
window.addEventListener('DOMContentLoaded', fetchTasks);

// Form Submit
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  try {
    const response = await fetch('/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (response.ok) {
      todoInput.value = '';
      await fetchTasks();
    }
  } catch (err) {
    console.error('Error adding task:', err);
  }
});

// Fetch Tasks from server
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (response.ok) {
      tasks = await response.json();
      renderTasks();
    }
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
}

// Toggle Task
async function toggleTask(id, completed) {
  try {
    const response = await fetch('/api/tasks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed })
    });
    if (response.ok) {
      // Update client-side local state first for visual snappiness
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        
        // Toggle completed class directly on element for instant visual response
        const taskEl = document.getElementById(`task-${id}`);
        if (taskEl) {
          if (completed) {
            taskEl.classList.add('completed');
          } else {
            taskEl.classList.remove('completed');
          }
        }
      }
      // Refresh list to properly handle filtering and progress updates
      updateProgressAndStats();
      if (currentFilter !== 'All') {
        renderTasks();
      }
    }
  } catch (err) {
    console.error('Error toggling task:', err);
  }
}

// Delete Task
async function deleteTask(id) {
  const taskEl = document.getElementById(`task-${id}`);
  if (taskEl) {
    taskEl.classList.add('removing');
  }

  // Wait for exit animation to complete before calling server & rendering
  setTimeout(async () => {
    try {
      const response = await fetch('/api/tasks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      fetchTasks(); // Restore sync in case of failure
    }
  }, 200);
}

// Clear Completed
async function clearCompleted() {
  // Find completed task elements and animate them out
  const completedEls = document.querySelectorAll('.task-item.completed');
  completedEls.forEach(el => el.classList.add('removing'));

  setTimeout(async () => {
    try {
      const response = await fetch('/api/tasks/clear-completed', {
        method: 'POST'
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error clearing completed:', err);
      fetchTasks();
    }
  }, 200);
}

// Filter switching
function setFilter(filterType) {
  currentFilter = filterType;
  
  // Update active tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(`tab-${filterType.toLowerCase()}`).classList.add('active');

  renderTasks();
}

// Render logic
function renderTasks() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'Active') return !task.completed;
    if (currentFilter === 'Completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    renderEmptyState();
  } else {
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.id = `task-${task.id}`;

      taskItem.innerHTML = `
        <label class="checkbox-container">
          <input 
            type="checkbox" 
            id="check-${task.id}" 
            ${task.completed ? 'checked' : ''}
            onchange="toggleTask('${task.id}', this.checked)"
          >
          <span class="checkmark"></span>
        </label>
        <span class="task-text" onclick="triggerCheckboxClick('${task.id}')">${escapeHTML(task.text)}</span>
        <button type="button" class="delete-btn" aria-label="Delete task" onclick="deleteTask('${task.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      taskList.appendChild(taskItem);
    });
  }

  updateProgressAndStats();
}

// Trigger checkbox change on text click
function triggerCheckboxClick(id) {
  const checkbox = document.getElementById(`check-${id}`);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    toggleTask(id, checkbox.checked);
  }
}

// Helper to render empty illustration
function renderEmptyState() {
  taskList.innerHTML = `
    <div class="empty-state">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <p>No ${currentFilter === 'All' ? '' : currentFilter.toLowerCase()} tasks found.</p>
    </div>
  `;
}

// Update Progress & Status bar values
function updateProgressAndStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  // Badges & text
  remainingBadge.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
  statsSummary.textContent = `Total: ${total} • Completed: ${completed}`;

  // Progress bar fill percent
  const percent = total > 0 ? (completed / total) * 100 : 0;
  progressBar.style.width = `${percent}%`;

  // Clear completed visibility
  if (completed > 0) {
    clearCompletedBtn.style.display = 'block';
  } else {
    clearCompletedBtn.style.display = 'none';
  }
}

// HTML escape utility
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
