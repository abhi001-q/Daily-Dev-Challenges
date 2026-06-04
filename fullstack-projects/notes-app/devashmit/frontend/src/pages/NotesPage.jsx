import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:8000";

export default function NotesPage() {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/notes`)
      .then(r => { if (!r.ok) throw new Error("Failed to load notes"); return r.json(); })
      .then(setNotes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="layout"><p className="loading">Loading notes…</p></div>;
  if (error)   return <div className="layout"><p className="error-msg">⚠️ {error}</p></div>;

  return (
    <div className="layout">
      <div className="topbar">
        <h1 className="topbar__title">📝 My Notes</h1>
        <Link to="/notes/new" className="btn btn--primary">+ New Note</Link>
      </div>

      {notes.length === 0 ? (
        <div className="empty">
          <span className="empty__icon">🗒️</span>
          <p>No notes yet. Create your first one!</p>
          <Link to="/notes/new" className="btn btn--primary">+ New Note</Link>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <article
              key={note.id}
              className="note-card"
              onClick={() => navigate(`/notes/${note.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && navigate(`/notes/${note.id}`)}
              aria-label={`Open note: ${note.title}`}
            >
              <h2 className="note-card__title">{note.title}</h2>
              <p className="note-card__content">
                {note.content || <em style={{ color: "#4b5280" }}>No content</em>}
              </p>
              <p className="note-card__date">
                Updated {new Date(note.updated_at).toLocaleDateString("en", {
                  year: "numeric", month: "short", day: "numeric"
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
