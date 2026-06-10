# ⚡ File Upload & Image Processing API — Day 13 FastAPI Challenge

**Issue:** [#325](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/325) | Week 2 | Intermediate

## 📋 Description

FastAPI image upload API. Accepts images, validates type/size, uses Pillow to resize to 3 sizes (thumbnail/medium/large), returns processed URLs.

## ✨ Features
- `POST /upload` — validate + resize to thumbnail/medium/large
- File type validation (JPEG, PNG, WebP)
- 5MB size limit
- Files organized by date
- `GET /images/{file}` — serve processed images

## 🚀 How to Run
```bash
pip install fastapi uvicorn pillow python-multipart
uvicorn main:app --reload
```
