import{useEffect,useState}from"react";import{Link,useNavigate,useParams}from"react-router-dom";
const API="http://localhost:8000";
export default function NotePage(){
  const{id}=useParams();const navigate=useNavigate();const[note,setNote]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{fetch(`${API}/notes/${id}`).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(setNote).catch(()=>navigate("/notes")).finally(()=>setLoading(false));},[id]);
  const del=async()=>{if(!confirm("Delete?"))return;await fetch(`${API}/notes/${id}`,{method:"DELETE"});navigate("/notes");};
  if(loading)return<div className="layout"><p className="loading">Loading…</p></div>;
  return(<div className="layout"><button className="back-link" onClick={()=>navigate("/notes")}>← Back</button><h1 className="note-title">{note.title}</h1><p className="note-meta">Updated {new Date(note.updated_at).toLocaleString()}</p><p className="note-content">{note.content||"No content."}</p><div className="actions"><Link to={`/notes/${id}/edit`} className="btn btn--primary">✏️ Edit</Link><button className="btn btn--danger" onClick={del}>🗑️ Delete</button><button className="btn btn--ghost" onClick={()=>navigate("/notes")}>← Back</button></div></div>);
}
