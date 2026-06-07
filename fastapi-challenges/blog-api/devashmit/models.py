from datetime import datetime, timezone
from sqlalchemy import ForeignKey, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int]  = mapped_column(primary_key=True)
    title: Mapped[str]  = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    author: Mapped[str]  = mapped_column(String(100), default="Anonymous")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[int]  = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column(Text)
    author: Mapped[str] = mapped_column(String(100), default="Anonymous")
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    post: Mapped["Post"] = relationship("Post", back_populates="comments")
