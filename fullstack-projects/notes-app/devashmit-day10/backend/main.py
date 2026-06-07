"""Full-stack Notes App — Day 10 Fullstack | Author: devashmit"""
from fastapi import FastAPI,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import database
app=FastAPI(title="Notes API")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173","http://localhost:3000"],allow_methods=["*"],allow_headers=["*"])
@app.on_event("startup")
def startup():database.init_db()
class NoteCreate(BaseModel):title:str;content:Optional[str]=""
class NoteUpdate(BaseModel):title:Optional[str]=None;content:Optional[str]=None
class NoteOut(BaseModel):id:int;title:str;content:str;created_at:str;updated_at:str
def row(r)->NoteOut:return NoteOut(id=r["id"],title=r["title"],content=r["content"],created_at=r["created_at"],updated_at=r["updated_at"])
def get404(nid,conn):
    r=conn.execute("SELECT * FROM notes WHERE id=?",(nid,)).fetchone()
    if not r:raise HTTPException(404,"Note not found")
    return r
@app.get("/notes",response_model=list[NoteOut])
def list_notes():
    with database.get_conn() as c:return[row(r) for r in c.execute("SELECT * FROM notes ORDER BY updated_at DESC").fetchall()]
@app.get("/notes/{nid}",response_model=NoteOut)
def get_note(nid:int):
    with database.get_conn() as c:return row(get404(nid,c))
@app.post("/notes",response_model=NoteOut,status_code=201)
def create_note(b:NoteCreate):
    with database.get_conn() as c:
        cur=c.execute("INSERT INTO notes(title,content) VALUES(?,?)",(b.title,b.content or ""))
        return row(c.execute("SELECT * FROM notes WHERE id=?",(cur.lastrowid,)).fetchone())
@app.put("/notes/{nid}",response_model=NoteOut)
def update_note(nid:int,b:NoteUpdate):
    with database.get_conn() as c:
        get404(nid,c)
        u=b.model_dump(exclude_unset=True)
        if u:
            sc=", ".join(f"{k}=?" for k in u)+", updated_at=datetime('now')"
            c.execute(f"UPDATE notes SET {sc} WHERE id=?",(*u.values(),nid))
        return row(c.execute("SELECT * FROM notes WHERE id=?",(nid,)).fetchone())
@app.delete("/notes/{nid}",status_code=204)
def delete_note(nid:int):
    with database.get_conn() as c:get404(nid,c);c.execute("DELETE FROM notes WHERE id=?",(nid,))
