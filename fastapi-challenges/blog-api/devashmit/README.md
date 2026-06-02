# ⚡ Blog API with PostgreSQL + SQLAlchemy [FASTAPI] — Day 5

**Issue:** [#249](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/249) | Week 1 | Advanced

## 📋 Description

A full Blog REST API using FastAPI with PostgreSQL (via SQLAlchemy ORM). Supports posts and comments CRUD, pagination, and uses Alembic for migrations.

## ✨ Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/posts?page=1&size=10` | List posts with pagination |
| GET | `/posts/{id}` | Get single post |
| POST | `/posts` | Create post |
| PUT | `/posts/{id}` | Update post |
| DELETE | `/posts/{id}` | Delete post |
| GET | `/posts/{id}/comments` | List comments |
| POST | `/posts/{id}/comments` | Add comment |

## 🧠 Concepts Practiced

`SQLAlchemy ORM` · `PostgreSQL` · `Alembic migrations` · `Pagination`

## 🚀 How to Run

```bash
pip install -r requirements.txt
# Set DATABASE_URL in .env
alembic upgrade head
uvicorn main:app --reload
```

## 🗂 Project Structure

```
devashmit/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── requirements.txt
├── alembic.ini
├── alembic/
│   └── versions/
└── README.md
```
