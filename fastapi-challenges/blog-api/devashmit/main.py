"""
Blog API with SQLAlchemy
Day 5 — FastAPI Challenge
Author: devashmit
"""

from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import Post, Comment
from schemas import CommentCreate, CommentOut, PostCreate, PostDetail, PostOut, PostUpdate

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Blog API", version="1.0.0")


# ── Posts ─────────────────────────────────────────────────────────────────────

@app.get("/posts", response_model=list[PostOut])
def list_posts(page: int = Query(1, ge=1), size: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).offset((page-1)*size).limit(size).all()


@app.get("/posts/{post_id}", response_model=PostDetail)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if not post: raise HTTPException(404, "Post not found")
    return post


@app.post("/posts", response_model=PostOut, status_code=201)
def create_post(body: PostCreate, db: Session = Depends(get_db)):
    post = Post(**body.model_dump())
    db.add(post); db.commit(); db.refresh(post)
    return post


@app.put("/posts/{post_id}", response_model=PostOut)
def update_post(post_id: int, body: PostUpdate, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if not post: raise HTTPException(404, "Post not found")
    for k, v in body.model_dump(exclude_unset=True).items(): setattr(post, k, v)
    db.commit(); db.refresh(post)
    return post


@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if not post: raise HTTPException(404, "Post not found")
    db.delete(post); db.commit()


# ── Comments ──────────────────────────────────────────────────────────────────

@app.get("/posts/{post_id}/comments", response_model=list[CommentOut])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    if not db.get(Post, post_id): raise HTTPException(404, "Post not found")
    return db.query(Comment).filter(Comment.post_id == post_id).all()


@app.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=201)
def add_comment(post_id: int, body: CommentCreate, db: Session = Depends(get_db)):
    if not db.get(Post, post_id): raise HTTPException(404, "Post not found")
    comment = Comment(**body.model_dump(), post_id=post_id)
    db.add(comment); db.commit(); db.refresh(comment)
    return comment
