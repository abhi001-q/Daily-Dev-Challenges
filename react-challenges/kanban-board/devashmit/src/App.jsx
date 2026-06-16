import { useReducer, useState, useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: "todo",       title: "To Do",       color: "#6366f1" },
  { id: "inprogress", title: "In Progress", color: "#f59e0b" },
  { id: "done",       title: "Done",        color: "#22c55e" },
];

const STORAGE_KEY = "devashmit-kanban-day11";

const DEMO_TASKS = [
  { id: crypto.randomUUID(), title: "Set up project",  desc: "Init Vite + React",   col: "done"       },
  { id: crypto.randomUUID(), title: "Build UI layout", desc: "Columns + cards",     col: "inprogress" },
  { id: crypto.randomUUID(), title: "Add drag & drop", desc: "HTML5 Drag & Drop",   col: "todo"       },
  { id: crypto.randomUUID(), title: "Persist to localStorage", desc: "",            col: "todo"       },
];

// ── Reducer ────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, { id: crypto.randomUUID(), title: action.title, desc: action.desc, col: "todo" }];
    case "DELETE_TASK":
      return state.filter(t => t.id !== action.id);
    case "MOVE_TASK":
      return state.map(t => t.id === action.id ? { ...t, col: action.col } : t);
    case "LOAD":
      return action.tasks;
    default:
      return state;
  }
}

// ── Column Component ───────────────────────────────────────────────────────
function Column({ col, tasks, dispatch }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("taskId");
    dispatch({ type: "MOVE_TASK", id, col: col.id });
    setDragOver(false);
  };

  return (
    <div
      className={`column ${dragOver ? "column--over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      aria-label={`${col.title} column`}
      role="region"
    >
      <div className="column__header" style={{ "--accent": col.color }}>
        <h2>{col.title}</h2>
        <span className="count">{tasks.length}</span>
      </div>
      <div className="column__body">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} dispatch={dispatch} />
        ))}
        {tasks.length === 0 && (
          <p className="column__empty">Drop tasks here</p>
        )}
      </div>
    </div>
  );
}

// ── Task Card Component ────────────────────────────────────────────────────
function TaskCard({ task, dispatch }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      aria-label={`Task: ${task.title}`}
      role="listitem"
    >
      <div className="task-card__body">
        <p className="task-card__title">{task.title}</p>
        {task.desc && <p className="task-card__desc">{task.desc}</p>}
      </div>
      <button
        className="task-card__del"
        onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
        aria-label={`Delete task: ${task.title}`}
      >
        ✕
      </button>
    </div>
  );
}

// ── Add Task Form ──────────────────────────────────────────────────────────
function AddTaskForm({ dispatch }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [open, setOpen]   = useState(false);
  const inputRef          = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: "ADD_TASK", title: title.trim(), desc: desc.trim() });
    setTitle(""); setDesc(""); setOpen(false);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button className="btn-add-open" onClick={() => setOpen(true)}>
        + Add Task
      </button>
    );
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        ref={inputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title…"
        required
        aria-label="Task title"
      />
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        aria-label="Task description"
      />
      <div className="add-form__actions">
        <button className="btn btn--primary" type="submit">Add</button>
        <button className="btn btn--ghost" type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_TASKS;
    } catch {
      return DEMO_TASKS;
    }
  });

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>📋 Kanban Board</h1>
        <p>Drag tasks between columns</p>
      </header>

      <div className="app__add">
        <AddTaskForm dispatch={dispatch} />
      </div>

      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            col={col}
            tasks={tasks.filter(t => t.col === col.id)}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
}
