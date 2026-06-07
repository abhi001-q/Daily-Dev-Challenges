import{useEffect,useState}from"react";import{Link,useNavigate}from"react-router-dom";
const API="http://localhost:8000";
export default function NotesPage(){
  const[notes,setNotes]=useState([]);const[loading,setLoading]=useState(true);const[error,setError]=useState("");
  const navigate=useNavigate();
  useEffect(()=>{fetch(`${API}/notes`).then(r=>r.json()).then(setNotes).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
  if(loading)return<div className="layout"><p className="loading">Loading…</p></div>;
  if(error)return<div className="layout"><p className="err">⚠️ {error}</p></div>;
  return(<div className="layout">
    <div className="topbar"><h1>📝 My Notes</h1><Link to="/notes/new" className="btn btn--primary">+ New Note</Link></div>
    {notes.length===0?(<div className="empty"><span>🗒️</span><p>No notes yet.</p><Link to="/notes/new" className="btn btn--primary">+ New Note</Link></div>):(
    <div className="notes-grid">
      {notes.map(n=>(
        <article key={n.id} className="note-card" onClick={()=>navigate(`/notes/${n.id}`)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&navigate(`/notes/${n.id}`)}>
          <h2>{n.title}</h2><p>{n.content||"No content"}</p>
          <small>Updated {new Date(n.updated_at).toLocaleDateString()}</small>
        </article>
      ))}
    </div>)}
  </div>);
}
