# ⚡ Todo CRUD API with Pydantic Validation [FASTAPI] — Day 6

**Issue:** [#259](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/259) | Week 1 | Beginner

## 📋 Description

Full CRUD REST API for todos with Pydantic validation. In-memory store. Fully testable via Swagger UI at `/docs`.

## ✨ Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos` | List all todos |
| GET | `/todos/{id}` | Get one todo |
| POST | `/todos` | Create todo |
| PUT | `/todos/{id}` | Update todo |
| DELETE | `/todos/{id}` | Delete todo |

## 🚀 How to Run

```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

Visit http://localhost:8000/docs
