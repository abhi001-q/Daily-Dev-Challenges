"""Full-stack Notes App — Day 13 Fullstack | Author: devashmit"""
from fastapi import FastAPI,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import database
app=FastAPI(title="Notes API")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173","http://localhost:3000"],allow_methods=["*"],allow_headers=["*"])
@app.on_event("startup")
def startup():database.init_db()
class NC(BaseModel):title:str;content:Optional[str]=""
class NU(BaseModel):title:Optional[str]=None;content:Optional[str]=None
class NO(BaseModel):id:int;title:str;content:str;created_at:str;updated_at:str
def row(r)->NO:return NO(id=r["id"],title=r["title"],content=r["content"],created_at=r["created_at"],updated_at=r["updated_at"])
def get404(nid,c):
    r=c.execute("SELECT * FROM notes WHERE id=?",(nid,)).fetchone()
    if not r:raise HTTPException(404,"Note not found")
    return r
@app.get("/notes",response_model=list[NO])
def list_notes():
    with database.get_conn() as c:return[row(r) for r in c.execute("SELECT * FROM notes ORDER BY updated_at DESC").fetchall()]
@app.get("/notes/{nid}",response_model=NO)
def get_note(nid:int):
    with database.get_conn() as c:return row(get404(nid,c))
@app.post("/notes",response_model=NO,status_code=201)
def create(b:NC):
    with database.get_conn() as c:
        cur=c.execute("INSERT INTO notes(title,content) VALUES(?,?)",(b.title,b.content or ""))
        return row(c.execute("SELECT * FROM notes WHERE id=?",(cur.lastrowid,)).fetchone())
@app.put("/notes/{nid}",response_model=NO)
def update(nid:int,b:NU):
    with database.get_conn() as c:
        get404(nid,c);u=b.model_dump(exclude_unset=True)
        if u:sc=", ".join(f"{k}=?" for k in u)+", updated_at=datetime('now')";c.execute(f"UPDATE notes SET {sc} WHERE id=?",(*u.values(),nid))
        return row(c.execute("SELECT * FROM notes WHERE id=?",(nid,)).fetchone())
@app.delete("/notes/{nid}",status_code=204)
def delete(nid:int):
    with database.get_conn() as c:get404(nid,c);c.execute("DELETE FROM notes WHERE id=?",(nid,))
