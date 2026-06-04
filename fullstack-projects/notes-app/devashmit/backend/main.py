"""
Full-stack Notes App — FastAPI Backend
Day 7 — Fullstack Challenge
Author: devashmit

Endpoints:
  GET    /notes          — list all notes (newest first)
  GET    /notes/{id}     — get a single note
  POST   /notes          — create a new note
  PUT    /notes/{id}     — update a note
  DELETE /notes/{id}     — delete a note
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import database

app = FastAPI(title="Notes API", version="1.0.0")

# Allow the React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    database.init_db()


# ── Schemas ───────────────────────────────────────────────────────────────────

class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
    updated_at: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def row_to_dict(row) -> NoteOut:
    return NoteOut(
        id=row["id"], title=row["title"], content=row["content"],
        created_at=row["created_at"], updated_at=row["updated_at"],
    )


def get_or_404(note_id: int, conn) -> dict:
    row = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Note {note_id} not found")
    return row


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/notes", response_model=list[NoteOut])
def list_notes():
    """Return all notes, newest first."""
    with database.get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM notes ORDER BY updated_at DESC"
        ).fetchall()
    return [row_to_dict(r) for r in rows]


@app.get("/notes/{note_id}", response_model=NoteOut)
def get_note(note_id: int):
    """Return a single note by ID."""
    with database.get_conn() as conn:
        return row_to_dict(get_or_404(note_id, conn))


@app.post("/notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(body: NoteCreate):
    """Create a new note."""
    with database.get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO notes (title, content) VALUES (?, ?)",
            (body.title, body.content or ""),
        )
        row = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
    return row_to_dict(row)


@app.put("/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, body: NoteUpdate):
    """Update title and/or content of a note."""
    with database.get_conn() as conn:
        get_or_404(note_id, conn)
        updates = body.model_dump(exclude_unset=True)
        if updates:
            set_clause = ", ".join(f"{k} = ?" for k in updates)
            set_clause += ", updated_at = datetime('now')"
            conn.execute(
                f"UPDATE notes SET {set_clause} WHERE id = ?",
                (*updates.values(), note_id),
            )
        row = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()
    return row_to_dict(row)


@app.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int):
    """Delete a note by ID."""
    with database.get_conn() as conn:
        get_or_404(note_id, conn)
        conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
