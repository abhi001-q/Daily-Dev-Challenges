from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class CommentCreate(BaseModel):
    body: str
    author: Optional[str] = "Anonymous"

class CommentOut(BaseModel):
    id: int; body: str; author: str; created_at: datetime; post_id: int
    model_config = {"from_attributes": True}

class PostCreate(BaseModel):
    title: str; content: str; author: Optional[str] = "Anonymous"

class PostUpdate(BaseModel):
    title: Optional[str] = None; content: Optional[str] = None

class PostOut(BaseModel):
    id: int; title: str; content: str; author: str
    created_at: datetime; updated_at: datetime
    model_config = {"from_attributes": True}

class PostDetail(PostOut):
    comments: list[CommentOut] = []
