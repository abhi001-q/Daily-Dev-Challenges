"""URL Shortener v2 — Day 5 Fullstack | Author: devashmit"""
import secrets
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl
import database

app = FastAPI(title="URL Shortener v2")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup(): database.init_db()

class ShortenReq(BaseModel): url: HttpUrl
class ShortenRes(BaseModel): code: str; short_url: str; original: str

@app.post("/shorten", response_model=ShortenRes, status_code=201)
def shorten(body: ShortenReq):
    original = str(body.url)
    for _ in range(10):
        code = secrets.token_urlsafe(6)[:6]
        with database.get_conn() as c:
            if not c.execute("SELECT 1 FROM urls WHERE code=?", (code,)).fetchone():
                c.execute("INSERT INTO urls(code,original) VALUES(?,?)", (code, original))
                return ShortenRes(code=code, short_url=f"http://localhost:8000/{code}", original=original)
    raise HTTPException(500, "Could not generate unique code")

@app.get("/analytics")
def analytics():
    with database.get_conn() as c:
        rows = c.execute("""SELECT u.code, u.original, u.created_at,
            COUNT(cl.id) as clicks FROM urls u
            LEFT JOIN clicks cl ON u.code=cl.code
            GROUP BY u.code ORDER BY u.created_at DESC""").fetchall()
    return [dict(r) for r in rows]

@app.get("/{code}")
def redirect(code: str, request: Request):
    with database.get_conn() as c:
        row = c.execute("SELECT original FROM urls WHERE code=?", (code,)).fetchone()
        if not row: raise HTTPException(404, "Not found")
        c.execute("INSERT INTO clicks(code,user_agent) VALUES(?,?)",
                  (code, request.headers.get("user-agent", "")))
    return RedirectResponse(url=row["original"], status_code=302)
