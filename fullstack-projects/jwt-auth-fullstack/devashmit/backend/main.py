"""JWT Auth System — Day 6 Fullstack | Author: devashmit"""
from fastapi import Cookie, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import decode_token, hash_pw, make_token, verify_pw

app = FastAPI(title="JWT Auth")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

db: dict[str, str] = {}  # username → hashed_password
COOKIE = "access_token"

class Creds(BaseModel): username: str; password: str
class UserOut(BaseModel): username: str

def current_user(access_token: str | None = Cookie(default=None)) -> str:
    if not access_token: raise HTTPException(401, "Not authenticated")
    u = decode_token(access_token)
    if not u or u not in db: raise HTTPException(401, "Invalid token")
    return u

@app.post("/auth/register", response_model=UserOut, status_code=201)
def register(b: Creds):
    if b.username in db: raise HTTPException(400, "Username taken")
    if len(b.password) < 6: raise HTTPException(422, "Password min 6 chars")
    db[b.username] = hash_pw(b.password)
    return UserOut(username=b.username)

@app.post("/auth/login", response_model=UserOut)
def login(b: Creds, res: Response):
    h = db.get(b.username)
    if not h or not verify_pw(b.password, h): raise HTTPException(401, "Wrong credentials")
    res.set_cookie(key=COOKIE, value=make_token({"sub": b.username}),
                   httponly=True, samesite="lax", max_age=3600)
    return UserOut(username=b.username)

@app.post("/auth/logout")
def logout(res: Response): res.delete_cookie(COOKIE); return {"ok": True}

@app.get("/auth/me", response_model=UserOut)
def me(access_token: str | None = Cookie(default=None)):
    return UserOut(username=current_user(access_token))
