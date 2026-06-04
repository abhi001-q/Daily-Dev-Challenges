import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:8000";

export default function NoteFormPage() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  // Load existing note when editing
  useEffect(() => {
    if (!isEdit) return;
    fetch(`${API}/notes/${id}`)
      .then(r => { if (!r.ok) throw new Error("Note not found"); return r.json(); })
      .then(n => { setTitle(n.title); setContent(n.content); })
      .catch(() => navigate("/notes"));
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");

    const method  = isEdit ? "PUT" : "POST";
    const url     = isEdit ? `${API}/notes/${id}` : `${API}/notes`;

    try {
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      const note = await res.json();
      navigate(`/notes/${note.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout">
      <button
        className="back-link"
        onClick={() => navigate(isEdit ? `/notes/${id}` : "/notes")}
        aria-label="Go back"
      >
        ← Back
      </button>

      <h1 className="form-page__title">
        {isEdit ? "✏️ Edit Note" : "📝 New Note"}
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title…"
            autoFocus
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your note here…"
            aria-multiline="true"
          />
        </div>

        {error && <p className="error-msg" role="alert" style={{textAlign:"left",padding:0,marginBottom:"1rem"}}>⚠️ {error}</p>}

        <div className="form-actions">
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Note"}
          </button>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => navigate(isEdit ? `/notes/${id}` : "/notes")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
