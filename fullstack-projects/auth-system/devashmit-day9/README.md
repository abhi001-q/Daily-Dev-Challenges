# 🚀 JWT Auth System (React + FastAPI) — Day 9 Fullstack Challenge

**Issue:** [#291](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/291) | Week 2 | Advanced

## 📋 Description

Complete auth system: Register, Login, protected Dashboard, Logout. FastAPI backend with JWT + bcrypt. React frontend with protected routes. Token stored in httpOnly cookie (XSS safe). Uses axios with `withCredentials: true`.

## ✨ Features
**Backend:** `/auth/register`, `/auth/login` (httpOnly cookie), `/auth/logout`, `/auth/me`
**Frontend:** Register/Login forms, protected Dashboard, axios withCredentials

## 🚀 How to Run
```bash
# Backend
cd backend && pip install fastapi uvicorn python-jose passlib[bcrypt] python-multipart
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```
