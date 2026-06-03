"""
Todo CRUD API — Day 6 FastAPI Challenge
Author: devashmit
"""
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Todo CRUD API", version="1.0.0")

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoOut(BaseModel):
    id: int; title: str; description: Optional[str]; completed: bool

_db: dict[int, dict] = {}
_next = 1

def _get(tid):
    if tid not in _db: raise HTTPException(404, "Todo not found")
    return _db[tid]

@app.get("/todos", response_model=list[TodoOut])
def list_todos(): return list(_db.values())

@app.get("/todos/{tid}", response_model=TodoOut)
def get_todo(tid: int): return _get(tid)

@app.post("/todos", response_model=TodoOut, status_code=201)
def create_todo(body: TodoCreate):
    global _next
    todo = {"id": _next, **body.model_dump()}
    _db[_next] = todo; _next += 1
    return todo

@app.put("/todos/{tid}", response_model=TodoOut)
def update_todo(tid: int, body: TodoUpdate):
    todo = _get(tid)
    for k, v in body.model_dump(exclude_unset=True).items(): todo[k] = v
    return todo

@app.delete("/todos/{tid}", status_code=204)
def delete_todo(tid: int): _get(tid); del _db[tid]
