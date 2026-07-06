import{useReducer,useState,useEffect,useRef}from"react";

const COLS=[{id:"todo",title:"To Do",color:"#6366f1"},{id:"inprogress",title:"In Progress",color:"#f59e0b"},{id:"done",title:"Done",color:"#22c55e"}];
const KEY="devd39kanban";
const DEMO=[{id:crypto.randomUUID(),title:"Set up project",desc:"Init Vite + React",col:"done"},{id:crypto.randomUUID(),title:"Build UI layout",desc:"Columns + cards",col:"inprogress"},{id:crypto.randomUUID(),title:"Add drag & drop",desc:"HTML5 API",col:"todo"},{id:crypto.randomUUID(),title:"Persist to localStorage",desc:"",col:"todo"}];

function reducer(s,a){
  switch(a.type){
    case"ADD":return[...s,{id:crypto.randomUUID(),title:a.title,desc:a.desc,col:"todo"}];
    case"DEL":return s.filter(t=>t.id!==a.id);
    case"MOVE":return s.map(t=>t.id===a.id?{...t,col:a.col}:t);
    case"LOAD":return a.tasks;
    default:return s;
  }
}

function Column({col,tasks,dispatch}){
  const[over,setOver]=useState(false);
  return(<div className={`column${over?" column--over":""}`} onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("taskId");dispatch({type:"MOVE",id,col:col.id});setOver(false);}}>
    <div className="column__header" style={{"--accent":col.color}}><h2>{col.title}</h2><span className="count">{tasks.length}</span></div>
    <div className="column__body">
      {tasks.map(t=><div key={t.id} className="task-card" draggable onDragStart={e=>e.dataTransfer.setData("taskId",t.id)}>
        <div className="task-card__body"><p className="task-card__title">{t.title}</p>{t.desc&&<p className="task-card__desc">{t.desc}</p>}</div>
        <button className="task-card__del" onClick={()=>dispatch({type:"DEL",id:t.id})} aria-label="Delete">✕</button>
      </div>)}
      {tasks.length===0&&<p className="column__empty">Drop tasks here</p>}
    </div>
  </div>);
}

function AddForm({dispatch}){
  const[title,setTitle]=useState("");const[desc,setDesc]=useState("");const[open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(open)setTimeout(()=>ref.current?.focus(),0);},[open]);
  const submit=e=>{e.preventDefault();if(!title.trim())return;dispatch({type:"ADD",title:title.trim(),desc:desc.trim()});setTitle("");setDesc("");setOpen(false);};
  if(!open)return<button className="btn-add-open" onClick={()=>setOpen(true)}>+ Add Task</button>;
  return(<form className="add-form" onSubmit={submit}>
    <input ref={ref} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title…" required/>
    <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description (optional)" rows={2}/>
    <div className="add-form__actions"><button className="btn btn--primary" type="submit">Add</button><button className="btn btn--ghost" type="button" onClick={()=>setOpen(false)}>Cancel</button></div>
  </form>);
}

export default function App(){
  const[tasks,dispatch]=useReducer(reducer,null,()=>{try{const s=localStorage.getItem(KEY);return s?JSON.parse(s):DEMO;}catch{return DEMO;}});
  useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(tasks));},[tasks]);
  return(<div className="app">
    <header className="app__header"><h1>📋 Kanban Board</h1><p>Drag tasks between columns</p></header>
    <div className="app__add"><AddForm dispatch={dispatch}/></div>
    <div className="board">{COLS.map(col=><Column key={col.id} col={col} tasks={tasks.filter(t=>t.col===col.id)} dispatch={dispatch}/>)}</div>
  </div>);
}
