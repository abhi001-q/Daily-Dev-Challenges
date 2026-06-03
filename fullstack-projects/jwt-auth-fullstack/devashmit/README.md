# 🚀 JWT Auth System (React + FastAPI) [FULLSTACK] — Day 6

**Issue:** [#262](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/262) | Week 1 | Advanced

## 📋 Description

Complete auth system: Register, Login, protected Dashboard, Logout. FastAPI backend with JWT + bcrypt. React frontend with protected routes. Token stored in httpOnly cookie.

## ✨ Features

**Backend (FastAPI)**
- `POST /auth/register` — bcrypt password hashing
- `POST /auth/login` — JWT in httpOnly cookie
- `POST /auth/logout` — clears cookie
- `GET /auth/me` — protected endpoint

**Frontend (React)**
- Register / Login forms
- Protected Dashboard route
- axios with `withCredentials: true`

## 🧠 Concepts Practiced

`JWT` · `httpOnly cookies` · `Protected routes` · `bcrypt` · `axios`

## 🚀 How to Run

```bash
# Backend
cd backend && pip install fastapi uvicorn python-jose passlib[bcrypt] python-multipart
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```
