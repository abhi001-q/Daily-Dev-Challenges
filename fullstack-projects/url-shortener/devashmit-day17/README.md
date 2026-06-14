# 🚀 URL Shortener with Click Analytics — Day 17 Fullstack Challenge

**Issue:** [#362](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/362) | Week 3 | Advanced

## 📋 Description

Bitly-style URL shortener. FastAPI + SQLite backend tracks click counts. React frontend with form, short link, copy-to-clipboard, analytics view.

## ✨ Features
**Backend:** `POST /shorten`, `GET /{code}` redirect+click tracking, `GET /analytics`
**Frontend:** URL form, copy button, analytics table

## 🚀 How to Run
```bash
cd backend && pip install fastapi uvicorn && uvicorn main:app --reload
cd frontend && npm install && npm run dev
```
