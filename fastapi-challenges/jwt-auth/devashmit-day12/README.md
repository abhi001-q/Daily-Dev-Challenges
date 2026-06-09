# ⚡ JWT Authentication System — Day 12 FastAPI Challenge

**Issue:** [#316](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/316) | Week 2 | Intermediate

## 📋 Description

FastAPI JWT auth: `POST /register`, `POST /login` (returns access token), protected `GET /me`. Passwords hashed with bcrypt. Uses `OAuth2PasswordBearer`.

## ✨ Features
- `POST /register` — bcrypt password hashing
- `POST /login` — returns signed JWT access token
- `GET /me` — protected endpoint (Bearer token)
- Token expiry handling
- Works with Swagger UI Authorize button

## 🚀 How to Run
```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt]
uvicorn main:app --reload
```
Visit http://localhost:8000/docs
