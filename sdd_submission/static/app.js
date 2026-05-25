document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');
    const progressBar = document.getElementById('progress-bar');
    const formError = document.getElementById('form-error');
    const offlineBanner = document.getElementById('offline-banner');
    const filterBar = document.getElementById('filter-bar');

    let allTasks = [];
    let currentFilter = 'all';

    // Check if the page is opened as a local file directly
    const isLocalFile = window.location.protocol === 'file:';
    if (isLocalFile && offlineBanner) {
        offlineBanner.style.display = 'flex';
    }

    // Initialize application
    fetchTasks();
    setupFilters();

    // Event listener for adding task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const category = taskCategory.value;
        
        if (!text) {
            showError('Task description cannot be empty.');
            return;
        }

        clearError();
        addTask(text, category);
    });

    // Clear error message when user starts typing
    taskInput.addEventListener('input', () => {
        clearError();
    });

    /**
     * Set up category filter listeners
     */
    function setupFilters() {
        if (!filterBar) return;
        
        filterBar.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;

            // Remove active class from all pills and set to clicked pill
            filterBar.querySelectorAll('.filter-pill').forEach(btn => {
                btn.classList.remove('active');
            });
            pill.classList.add('active');

            // Apply filter
            currentFilter = pill.dataset.category;
            renderTasks();
        });
    }

    /**
     * Helper to generate local unique IDs
     */
    function generateId() {
        return 'local_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }

    /**
     * Abstract data access: load tasks from appropriate source
     */
    async function loadTasksFromSource() {
        if (isLocalFile) {
            try {
                const stored = localStorage.getItem('todo-tasks');
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error("Local storage read failed:", e);
                return [];
            }
        } else {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks.');
            return await response.json();
        }
    }

    /**
     * Abstract data access: add a task to appropriate source
     */
    async function addTaskToSource(text, category) {
        if (isLocalFile) {
            const newTask = {
                id: generateId(),
                text: text,
                category: category,
                completed: false
            };
            const tasks = await loadTasksFromSource();
            tasks.push(newTask);
            localStorage.setItem('todo-tasks', JSON.stringify(tasks));
            return newTask;
        } else {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, category })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add task.');
            }

            return await response.json();
        }
    }

    /**
     * Abstract data access: toggle status in appropriate source
     */
    async function toggleTaskInSource(id) {
        if (isLocalFile) {
            const tasks = await loadTasksFromSource();
            let updatedTask = null;
            const updatedList = tasks.map(t => {
                if (t.id === id) {
                    t.completed = !t.completed;
                    updatedTask = t;
                }
                return t;
            });
            
            if (!updatedTask) throw new Error('Task not found.');
            
            localStorage.setItem('todo-tasks', JSON.stringify(updatedList));
            return updatedTask;
        } else {
            const response = await fetch(`/api/tasks/${id}/toggle`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Failed to update task.');
            return await response.json();
        }
    }

    /**
     * Abstract data access: delete task from appropriate source
     */
    async function deleteTaskFromSource(id) {
        if (isLocalFile) {
            const tasks = await loadTasksFromSource();
            const filteredTasks = tasks.filter(t => t.id !== id);
            localStorage.setItem('todo-tasks', JSON.stringify(filteredTasks));
            return { success: true };
        } else {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task.');
            return await response.json();
        }
    }

    /**
     * Fetch all tasks
     */
    async function fetchTasks() {
        try {
            allTasks = await loadTasksFromSource();
            renderTasks();
        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Add task
     */
    async function addTask(text, category) {
        try {
            addTaskBtn.disabled = true;
            const newTask = await addTaskToSource(text, category);
            allTasks.push(newTask);
            
            taskInput.value = '';
            taskCategory.value = ''; // Reset to default "No Category"
            taskInput.focus();

            renderTasks();
        } catch (error) {
            showError(error.message);
        } finally {
            addTaskBtn.disabled = false;
        }
    }

    /**
     * Toggle status of a task
     */
    async function toggleTask(id) {
        try {
            const updatedTask = await toggleTaskInSource(id);
            allTasks = allTasks.map(t => t.id === id ? updatedTask : t);
            renderTasks();
        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Delete a task
     */
    async function deleteTask(id, itemElement) {
        try {
            await deleteTaskFromSource(id);

            // Apply exit animation
            itemElement.classList.add('fade-out-animation');
            
            // Remove from array and DOM after animation completes
            setTimeout(() => {
                allTasks = allTasks.filter(t => t.id !== id);
                renderTasks();
            }, 250);

        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Render tasks list based on currentFilter
     */
    function renderTasks() {
        tasksList.innerHTML = '';
        
        // Filter tasks client-side
        const filteredTasks = currentFilter === 'all' 
            ? allTasks 
            : allTasks.filter(task => (task.category || '') === currentFilter);
        
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'flex';
            const emptyTextEl = emptyState.querySelector('.empty-text');
            if (emptyTextEl) {
                if (currentFilter !== 'all') {
                    emptyTextEl.textContent = `No tasks in category "${currentFilter}".`;
                } else {
                    emptyTextEl.textContent = `Your flow is clear. Enjoy your day!`;
                }
            }
        } else {
            emptyState.style.display = 'none';
            
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.dataset.id = task.id;

                // Task Content wrapper (click triggers toggle)
                const contentDiv = document.createElement('div');
                contentDiv.className = 'task-content';
                contentDiv.addEventListener('click', () => toggleTask(task.id));

                // Checkbox indicator
                const checkbox = document.createElement('div');
                checkbox.className = 'custom-checkbox';
                checkbox.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                // Task text
                const textSpan = document.createElement('span');
                textSpan.className = 'task-text';
                textSpan.textContent = task.text;

                contentDiv.appendChild(checkbox);
                contentDiv.appendChild(textSpan);

                // Add Category Tag if exists
                if (task.category) {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = `task-category-tag tag-${task.category.toLowerCase()}`;
                    tagSpan.textContent = task.category;
                    contentDiv.appendChild(tagSpan);
                }

                // Delete action button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
                deleteBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTask(task.id, li);
                });

                li.appendChild(contentDiv);
                li.appendChild(deleteBtn);
                tasksList.appendChild(li);
            });
        }

        updateStats(filteredTasks);
    }

    /**
     * Calculate and display total tasks, completed tasks, and progress bar width for current filter
     */
    function updateStats(activeTasks) {
        const total = activeTasks.length;
        const completed = activeTasks.filter(t => t.completed).length;

        totalCountEl.textContent = total;
        completedCountEl.textContent = completed;

        const progressPercent = total > 0 ? (completed / total) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
    }

    /**
     * Display error helper
     */
    function showError(msg) {
        formError.textContent = msg;
        formError.style.opacity = 1;
    }

    /**
     * Clear error helper
     */
    function clearError() {
        formError.textContent = '';
        formError.style.opacity = 0;
    }
});
