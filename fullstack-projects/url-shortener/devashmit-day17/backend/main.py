"""URL Shortener — Day 17 Fullstack | Author: devashmit"""
import secrets
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel,HttpUrl
import database

app=FastAPI(title="URL Shortener")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173","http://localhost:3000"],allow_methods=["*"],allow_headers=["*"])

@app.on_event("startup")
def startup():database.init_db()

class Req(BaseModel):url:HttpUrl
class Res(BaseModel):code:str;short_url:str;original:str
class AItem(BaseModel):code:str;original:str;clicks:int;created_at:str

@app.post("/shorten",response_model=Res,status_code=201)
def shorten(body:Req):
    original=str(body.url)
    for _ in range(10):
        code=secrets.token_urlsafe(6)[:6]
        with database.get_conn() as c:
            if not c.execute("SELECT 1 FROM urls WHERE code=?",(code,)).fetchone():
                c.execute("INSERT INTO urls(code,original) VALUES(?,?)",(code,original))
                return Res(code=code,short_url=f"http://localhost:8000/{code}",original=original)
    raise HTTPException(500,"Could not generate unique code")

@app.get("/analytics",response_model=list[AItem])
def analytics():
    with database.get_conn() as c:rows=c.execute("SELECT * FROM urls ORDER BY created_at DESC").fetchall()
    return[AItem(**dict(r)) for r in rows]

@app.get("/{code}")
def redirect(code:str):
    with database.get_conn() as c:
        row=c.execute("SELECT original FROM urls WHERE code=?",(code,)).fetchone()
        if not row:raise HTTPException(404,"Not found")
        c.execute("UPDATE urls SET clicks=clicks+1 WHERE code=?",(code,))
    return RedirectResponse(url=row["original"],status_code=302)
