# 🚀 URL Shortener with Click Analytics — Day 14 Fullstack Challenge

**Issue:** [#337](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/337) | Week 2 | Advanced

## 📋 Description

Bitly-style URL shortener. FastAPI generates 6-char code via `secrets.token_urlsafe`, stores in SQLite, tracks click count. React frontend with form, short link, copy-to-clipboard, analytics view.

## ✨ Features
**Backend:** `POST /shorten`, `GET /{code}` redirect + click tracking, `GET /analytics`
**Frontend:** URL form, copy button, analytics table

## 🚀 How to Run
```bash
cd backend && pip install fastapi uvicorn && uvicorn main:app --reload
cd frontend && npm install && npm run dev
```
