# 🚀 JWT Auth System (React + FastAPI) — Day 12 Fullstack Challenge

**Issue:** [#319](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/319) | Week 2 | Advanced

## 📋 Description

Complete auth system: Register, Login, protected Dashboard, Logout. FastAPI + JWT + bcrypt backend. React frontend with protected routes. Token in httpOnly cookie (XSS safe). axios `withCredentials: true`.

## ✨ Features
**Backend:** `/auth/register`, `/auth/login` (httpOnly cookie), `/auth/logout`, `/auth/me`
**Frontend:** Register/Login forms, protected Dashboard, axios

## 🚀 How to Run
```bash
# Backend
cd backend && pip install fastapi uvicorn python-jose passlib[bcrypt] python-multipart
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```
