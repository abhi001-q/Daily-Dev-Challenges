import React, { useReducer, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import './index.css';

const initialState = {
  tasks: [
    { id: crypto.randomUUID(), columnId: 'todo', title: 'Research competitors', description: 'Analyze top 3 competitor features.' },
    { id: crypto.randomUUID(), columnId: 'todo', title: 'Design system', description: 'Create typography and color tokens.' },
    { id: crypto.randomUUID(), columnId: 'in-progress', title: 'Build Kanban Board', description: 'Implement drag and drop functionality.' },
    { id: crypto.randomUUID(), columnId: 'done', title: 'Setup Repo', description: 'Initialize Git and Vite project.' }
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_STATE':
      return action.payload;
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case 'MOVE_TASK': {
      const { taskId, toColumnId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, columnId: toColumnId } : task
        )
      };
    }
    default:
      return state;
  }
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#ff7675' },
  { id: 'in-progress', title: 'In Progress', color: '#fdcb6e' },
  { id: 'done', title: 'Done', color: '#00b894' }
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('kanban-state');
    if (saved) {
      try {
        dispatch({ type: 'INIT_STATE', payload: JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse state from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-state', JSON.stringify(state));
  }, [state]);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires data to be set
    e.dataTransfer.setData('text/plain', taskId);
    
    // Slight delay so the element doesn't disappear while dragging
    setTimeout(() => {
      if (e.target) {
        e.target.classList.add('is-dragging');
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    setDraggedTaskId(null);
    e.target.classList.remove('is-dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTaskId) {
      dispatch({ 
        type: 'MOVE_TASK', 
        payload: { taskId: draggedTaskId, toColumnId: columnId } 
      });
    }
  };

  const addTask = (columnId) => {
    const newTask = {
      id: crypto.randomUUID(),
      columnId,
      title: 'New Task',
      description: 'Double click to edit...'
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Kanban Board</h1>
      </header>

      <div className="board">
        {COLUMNS.map((col) => {
          const columnTasks = state.tasks.filter((t) => t.columnId === col.id);
          return (
            <div 
              key={col.id} 
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div className="column-title">
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: col.color }} />
                  {col.title}
                </div>
                <div className="task-count">{columnTasks.length}</div>
              </div>

              <div className="task-list">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                ))}
              </div>
              
              <button className="add-task-btn" onClick={() => addTask(col.id)}>
                <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Add Task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
