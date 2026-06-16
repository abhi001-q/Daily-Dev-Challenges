import{useEffect,useState}from"react";import{useNavigate,useParams}from"react-router-dom";
const API="http://localhost:8000";
export default function NoteFormPage(){
  const{id}=useParams();const isEdit=Boolean(id);const navigate=useNavigate();
  const[title,setTitle]=useState("");const[content,setContent]=useState("");const[saving,setSaving]=useState(false);const[error,setError]=useState("");
  useEffect(()=>{if(!isEdit)return;fetch(`${API}/notes/${id}`).then(r=>r.json()).then(n=>{setTitle(n.title);setContent(n.content);}).catch(()=>navigate("/notes"));},[id,isEdit]);
  const submit=async e=>{
    e.preventDefault();if(!title.trim()){setError("Title required");return;}setSaving(true);setError("");
    try{const r=await fetch(isEdit?`${API}/notes/${id}`:`${API}/notes`,{method:isEdit?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:title.trim(),content})});
      if(!r.ok)throw new Error("Failed");const n=await r.json();navigate(`/notes/${n.id}`);
    }catch(e){setError(e.message);}finally{setSaving(false);}};
  return(<div className="layout"><button className="back-link" onClick={()=>navigate(isEdit?`/notes/${id}`:"/notes")}>← Back</button>
    <h1 className="form-title">{isEdit?"✏️ Edit Note":"📝 New Note"}</h1>
    <form onSubmit={submit}>
      <div className="form-group"><label htmlFor="title">Title</label><input id="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title…" autoFocus/></div>
      <div className="form-group"><label htmlFor="content">Content</label><textarea id="content" value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your note…"/></div>
      {error&&<p className="err" style={{padding:0,textAlign:"left",marginBottom:"1rem"}}>⚠️ {error}</p>}
      <div className="form-actions"><button className="btn btn--primary" disabled={saving}>{saving?"Saving…":isEdit?"Save Changes":"Create Note"}</button><button className="btn btn--ghost" type="button" onClick={()=>navigate(isEdit?`/notes/${id}`:"/notes")}>Cancel</button></div>
    </form>
  </div>);}
