# ⚡ Blog API with PostgreSQL + SQLAlchemy — Day 10 FastAPI Challenge

**Issue:** [#298](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/298) | Week 2 | Advanced

## 📋 Description

Full Blog REST API using FastAPI with SQLAlchemy ORM (SQLite fallback). Posts + comments CRUD with pagination.

## ✨ Endpoints
- `GET /posts?page=1&size=10` — paginated list
- `GET/POST/PUT/DELETE /posts/{id}` — CRUD
- `GET/POST /posts/{id}/comments` — comments

## 🚀 How to Run
```bash
pip install fastapi uvicorn sqlalchemy python-dotenv
uvicorn main:app --reload
```
