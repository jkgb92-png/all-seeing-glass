import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY_NAME = 'momentum_name';
const STORAGE_KEY_FOCUS = 'momentum_focus';
const STORAGE_KEY_TODOS = 'momentum_todos';

const getGreeting = (hour) => {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatTime = (date) => {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return { time: `${h12}:${m}:${s}`, ampm };
};

const formatDate = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MomentumDashboard = () => {
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState(() => localStorage.getItem(STORAGE_KEY_NAME) || '');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [focus, setFocus] = useState(() => localStorage.getItem(STORAGE_KEY_FOCUS) || '');
  const [editingFocus, setEditingFocus] = useState(false);
  const [focusInput, setFocusInput] = useState('');
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_TODOS)) || [];
    } catch {
      return [];
    }
  });
  const [todoInput, setTodoInput] = useState('');
  const nameInputRef = useRef(null);
  const focusInputRef = useRef(null);
  const todoInputRef = useRef(null);

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist name
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NAME, name);
  }, [name]);

  // Persist focus
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FOCUS, focus);
  }, [focus]);

  // Persist todos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  }, [todos]);

  // Auto-focus inputs when editing starts
  useEffect(() => {
    if (editingName && nameInputRef.current) nameInputRef.current?.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingFocus && focusInputRef.current) focusInputRef.current?.focus();
  }, [editingFocus]);

  const { time, ampm } = formatTime(now);
  const greeting = `${getGreeting(now.getHours())}${name ? `, ${name}` : ''}`;

  const startEditName = useCallback(() => {
    setNameInput(name);
    setEditingName(true);
  }, [name]);

  const saveName = useCallback(() => {
    setName(nameInput.trim());
    setEditingName(false);
  }, [nameInput]);

  const startEditFocus = useCallback(() => {
    setFocusInput(focus);
    setEditingFocus(true);
  }, [focus]);

  const saveFocus = useCallback(() => {
    setFocus(focusInput.trim());
    setEditingFocus(false);
  }, [focusInput]);

  const addTodo = useCallback(() => {
    const text = todoInput.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setTodoInput('');
    todoInputRef.current?.focus();
  }, [todoInput]);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done));
  }, []);

  const doneTodos = todos.filter((t) => t.done).length;

  return (
    <div className="momentum-dashboard">
      {/* Clock */}
      <div className="momentum-clock-section">
        <div className="momentum-clock">
          <span className="momentum-time">{time}</span>
          <span className="momentum-ampm">{ampm}</span>
        </div>
        <div className="momentum-date">{formatDate(now)}</div>
      </div>

      {/* Greeting / Name */}
      <div className="momentum-greeting-section">
        {editingName ? (
          <div className="momentum-name-edit">
            <input
              ref={nameInputRef}
              className="momentum-text-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') setEditingName(false);
              }}
              placeholder="Your name"
              maxLength={40}
            />
            <button className="momentum-save-btn" onClick={saveName}>Save</button>
            <button className="momentum-cancel-btn" onClick={() => setEditingName(false)}>✕</button>
          </div>
        ) : (
          <h2 className="momentum-greeting" onClick={startEditName} title="Click to set your name">
            {greeting}
            <span className="momentum-edit-hint"> ✏</span>
          </h2>
        )}
      </div>

      {/* Daily Focus */}
      <div className="momentum-focus-section">
        <p className="momentum-focus-label">✦ Today's Focus</p>
        {editingFocus ? (
          <div className="momentum-focus-edit">
            <input
              ref={focusInputRef}
              className="momentum-text-input momentum-focus-input"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveFocus();
                if (e.key === 'Escape') setEditingFocus(false);
              }}
              placeholder="What is your main focus today?"
              maxLength={100}
            />
            <button className="momentum-save-btn" onClick={saveFocus}>Save</button>
            <button className="momentum-cancel-btn" onClick={() => setEditingFocus(false)}>✕</button>
          </div>
        ) : (
          <p
            className={`momentum-focus-text${!focus ? ' momentum-focus-placeholder' : ''}`}
            onClick={startEditFocus}
            title="Click to set your focus"
          >
            {focus || 'What is your main focus today?'}
            <span className="momentum-edit-hint"> ✏</span>
          </p>
        )}
      </div>

      {/* Todo List */}
      <div className="momentum-todo-section">
        <div className="momentum-todo-header">
          <p className="momentum-todo-title">☑ To-Do List</p>
          {doneTodos > 0 && (
            <button className="momentum-clear-done-btn" onClick={clearDone}>
              Clear done ({doneTodos})
            </button>
          )}
        </div>

        <div className="momentum-todo-input-row">
          <input
            ref={todoInputRef}
            className="momentum-text-input momentum-todo-input"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
            placeholder="Add a task and press Enter…"
            maxLength={120}
          />
          <button className="momentum-add-btn" onClick={addTodo}>Add</button>
        </div>

        {todos.length === 0 && (
          <p className="momentum-todo-empty">No tasks yet. Add one above!</p>
        )}

        <ul className="momentum-todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`momentum-todo-item${todo.done ? ' momentum-todo-done' : ''}`}>
              <button
                className="momentum-todo-check"
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {todo.done ? '✓' : '○'}
              </button>
              <span className="momentum-todo-text">{todo.text}</span>
              <button
                className="momentum-todo-delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MomentumDashboard;
