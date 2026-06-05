# 🚀 URL Shortener with Click Analytics — Day 8 Fullstack Challenge

**Issue:** [#281](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/281) | Week 2 | Advanced

## 📋 Description

A Bitly-style URL shortener with click analytics. FastAPI backend generates a 6-char code using `secrets.token_urlsafe`, stores in SQLite, and tracks click count. React frontend provides form, short link display, copy-to-clipboard, and analytics view.

## ✨ Features

**Backend (FastAPI)**
- `POST /shorten` — generates 6-char code
- `GET /{code}` — redirects + increments click counter
- `GET /analytics` — all links with click counts
- SQLite via `sqlite3`

**Frontend (React)**
- URL input form
- Short link display + copy-to-clipboard
- Analytics table with click counts

## 🧠 Concepts Practiced

`URL shortening` · `SQLite` · `Click tracking` · `Clipboard API`

## 🚀 How to Run

```bash
# Backend
cd backend && pip install fastapi uvicorn && uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```
