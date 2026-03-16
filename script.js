(() => {
  'use strict';

  const STORAGE_KEY = 'todo_tasks';

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const form            = document.getElementById('task-form');
  const input           = document.getElementById('task-input');
  const taskList        = document.getElementById('task-list');
  const taskCounter     = document.getElementById('task-counter');
  const validationMsg   = document.getElementById('validation-msg');
  const clearBtn        = document.getElementById('clear-completed-btn');

  // ── State ─────────────────────────────────────────────────────────────────
  let tasks = loadTasks();

  // ── Local Storage helpers ─────────────────────────────────────────────────
  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ── Rendering ─────────────────────────────────────────────────────────────
  function render() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks yet — add one above!';
      taskList.appendChild(empty);
    } else {
      tasks.forEach((task) => {
        taskList.appendChild(createTaskElement(task));
      });
    }

    updateCounter();
    updateClearButton();
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('span');
    checkbox.className = 'task-checkbox';
    checkbox.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Delete "${task.text}"`);
    deleteBtn.textContent = '✕';

    // Toggle completion when clicking the item (but not the delete button)
    li.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-delete')) {
        toggleTask(task.id);
      }
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id, li);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    return li;
  }

  function updateCounter() {
    const total     = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    taskCounter.textContent = `${total} task${total !== 1 ? 's' : ''} \u00b7 ${completed} completed`;
  }

  function updateClearButton() {
    const hasCompleted = tasks.some((t) => t.completed);
    clearBtn.disabled = !hasCompleted;
    clearBtn.style.opacity = hasCompleted ? '1' : '0.45';
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  function addTask(text) {
    const task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      completed: false,
    };
    tasks.unshift(task);
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks();
    render();
  }

  function deleteTask(id, element) {
    element.classList.add('completing');
    element.addEventListener('animationend', () => {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      render();
    }, { once: true });
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
  }

  // ── Input validation ──────────────────────────────────────────────────────
  function showError(msg) {
    validationMsg.textContent = msg;
    input.classList.add('input-error');
    input.addEventListener('input', clearError, { once: true });
  }

  function clearError() {
    validationMsg.textContent = '';
    input.classList.remove('input-error');
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) {
      showError('Task cannot be empty.');
      input.focus();
      return;
    }

    clearError();
    addTask(text);
    input.value = '';
    input.focus();
  });

  clearBtn.addEventListener('click', clearCompleted);

  // ── Init ──────────────────────────────────────────────────────────────────
  render();
})();
