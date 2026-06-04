# 🚀 Full-stack Notes App (React + FastAPI) — Day 7

**Issue:** [#271](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/271) | Week 1 | Intermediate

## 📋 Description

A full-stack note-taking app built end-to-end. FastAPI + SQLite backend with full CRUD. React frontend with create/edit forms, list view, and React Router. Connected via Fetch API with CORS handled.

## ✨ Features

**Backend (FastAPI)**
- `GET /notes` — list all notes
- `GET /notes/{id}` — get single note
- `POST /notes` — create note
- `PUT /notes/{id}` — update note
- `DELETE /notes/{id}` — delete note
- SQLite storage via `sqlite3`
- CORS via `CORSMiddleware`

**Frontend (React)**
- Notes list view at `/notes`
- Note detail view at `/notes/:id`
- Create / Edit form
- Delete with confirmation
- React Router navigation
- Clean dark UI

## 🧠 Concepts Practiced

`FastAPI + React` · `CORS` · `SQLite` · `React Router` · `Full-stack flow`

## 🚀 How to Run

**Backend:**
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## 🗂 Project Structure

```
devashmit/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── NotesPage.jsx
│   │   │   ├── NotePage.jsx
│   │   │   └── NoteFormPage.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```
