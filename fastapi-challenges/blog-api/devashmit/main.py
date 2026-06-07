"""
Blog API with SQLAlchemy — Day 10 FastAPI Challenge
Author: devashmit
"""
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import Base, engine, get_db
from models import Post, Comment

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Blog API", version="1.0.0")

class PostCreate(BaseModel): title: str; content: str; author: Optional[str]="Anonymous"
class PostUpdate(BaseModel): title: Optional[str]=None; content: Optional[str]=None
class PostOut(BaseModel):
    id: int; title: str; content: str; author: str; created_at: str; updated_at: str
    model_config={"from_attributes":True}
    def model_post_init(self,_): self.created_at=str(self.created_at); self.updated_at=str(self.updated_at)
class CommentCreate(BaseModel): body: str; author: Optional[str]="Anonymous"
class CommentOut(BaseModel):
    id: int; body: str; author: str; post_id: int; created_at: str
    model_config={"from_attributes":True}

def get_post_or_404(pid,db): p=db.get(Post,pid); _ = p or (_ for _ in ()).throw(HTTPException(404,"Post not found")); return p

@app.get("/posts",response_model=list[PostOut])
def list_posts(page:int=Query(1,ge=1),size:int=Query(10,ge=1,le=100),db:Session=Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).offset((page-1)*size).limit(size).all()

@app.get("/posts/{pid}",response_model=PostOut)
def get_post(pid:int,db:Session=Depends(get_db)):
    p = db.get(Post,pid)
    if not p: raise HTTPException(404,"Post not found")
    return p

@app.post("/posts",response_model=PostOut,status_code=201)
def create_post(b:PostCreate,db:Session=Depends(get_db)):
    p=Post(**b.model_dump()); db.add(p); db.commit(); db.refresh(p); return p

@app.put("/posts/{pid}",response_model=PostOut)
def update_post(pid:int,b:PostUpdate,db:Session=Depends(get_db)):
    p=db.get(Post,pid)
    if not p: raise HTTPException(404,"Post not found")
    for k,v in b.model_dump(exclude_unset=True).items(): setattr(p,k,v)
    db.commit(); db.refresh(p); return p

@app.delete("/posts/{pid}",status_code=204)
def delete_post(pid:int,db:Session=Depends(get_db)):
    p=db.get(Post,pid)
    if not p: raise HTTPException(404,"Post not found")
    db.delete(p); db.commit()

@app.get("/posts/{pid}/comments",response_model=list[CommentOut])
def list_comments(pid:int,db:Session=Depends(get_db)):
    if not db.get(Post,pid): raise HTTPException(404,"Post not found")
    return db.query(Comment).filter(Comment.post_id==pid).all()

@app.post("/posts/{pid}/comments",response_model=CommentOut,status_code=201)
def add_comment(pid:int,b:CommentCreate,db:Session=Depends(get_db)):
    if not db.get(Post,pid): raise HTTPException(404,"Post not found")
    c=Comment(**b.model_dump(),post_id=pid); db.add(c); db.commit(); db.refresh(c); return c
