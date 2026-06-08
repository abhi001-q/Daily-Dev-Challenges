# 🚀 URL Shortener with Click Analytics — Day 11 Fullstack Challenge

**Issue:** [#310](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/310) | Week 2 | Advanced

## 📋 Description

Bitly-style URL shortener. FastAPI backend generates 6-char codes via `secrets.token_urlsafe`, stores in SQLite, tracks click count. React frontend with form, short link display, copy-to-clipboard, and analytics view.

## ✨ Features

**Backend (FastAPI)**
- `POST /shorten` — 6-char unique code via `secrets.token_urlsafe`
- `GET /{code}` — redirect + increment click counter
- `GET /analytics` — all links with click counts

**Frontend (React)**
- URL input form with validation
- Short link display + copy-to-clipboard
- Analytics table with live click counts

## 🧠 Concepts Practiced

`URL shortening` · `SQLite` · `Click tracking` · `Clipboard API`

## 🚀 How to Run

```bash
# Backend
cd backend && pip install fastapi uvicorn && uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```
