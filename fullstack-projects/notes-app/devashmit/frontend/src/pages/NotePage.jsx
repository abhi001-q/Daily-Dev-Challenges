import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API = "http://localhost:8000";

export default function NotePage() {
  const { id }  = useParams();
  const navigate = useNavigate();
  const [note, setNote]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    fetch(`${API}/notes/${id}`)
      .then(r => { if (!r.ok) throw new Error("Note not found"); return r.json(); })
      .then(setNote)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    navigate("/notes");
  };

  if (loading) return <div className="layout"><p className="loading">Loading…</p></div>;
  if (error)   return <div className="layout"><p className="error-msg">⚠️ {error}</p><Link to="/notes" className="btn btn--ghost" style={{marginTop:"1rem"}}>← Back</Link></div>;

  return (
    <div className="layout">
      <button className="back-link" onClick={() => navigate("/notes")} aria-label="Back to notes">
        ← Back to notes
      </button>

      <h1 className="note-detail__title">{note.title}</h1>
      <p className="note-detail__meta">
        Created {new Date(note.created_at).toLocaleString()} ·
        Updated {new Date(note.updated_at).toLocaleString()}
      </p>

      <p className="note-detail__content">
        {note.content || <em style={{ color: "#4b5280" }}>No content.</em>}
      </p>

      <div className="note-detail__actions">
        <Link to={`/notes/${id}/edit`} className="btn btn--primary">✏️ Edit</Link>
        <button className="btn btn--danger" onClick={handleDelete}>🗑️ Delete</button>
        <button className="btn btn--ghost" onClick={() => navigate("/notes")}>← Back</button>
      </div>
    </div>
  );
}
