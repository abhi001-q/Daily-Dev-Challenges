# ⚡ JWT Authentication System — Day 17 FastAPI Challenge

**Issue:** [#359](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/359) | Week 3 | Intermediate

## 📋 Description

FastAPI JWT auth: POST /register, POST /login (returns access token), protected GET /me. bcrypt + OAuth2PasswordBearer.

## ✨ Features
- `POST /register` — bcrypt hashing
- `POST /login` — JWT access token
- `GET /me` — protected endpoint
- OAuth2PasswordBearer (Swagger Authorize button works)

## 🚀 How to Run
```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt]
uvicorn main:app --reload
```
