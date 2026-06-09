"""JWT Authentication System — Day 12 FastAPI | Author: devashmit"""
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from auth import make_token, decode_token, hash_pw, verify_pw

app = FastAPI(title="JWT Auth API")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
db: dict[str, str] = {}  # username -> hashed_password

class UserRegister(BaseModel): username: str; password: str
class Token(BaseModel): access_token: str; token_type: str
class UserOut(BaseModel): username: str

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    u = decode_token(token)
    if not u or u not in db: raise HTTPException(401, "Invalid or expired token", headers={"WWW-Authenticate": "Bearer"})
    return u

@app.post("/register", response_model=UserOut, status_code=201)
def register(body: UserRegister):
    if body.username in db: raise HTTPException(400, "Username already taken")
    if len(body.password) < 6: raise HTTPException(422, "Password min 6 chars")
    db[body.username] = hash_pw(body.password)
    return UserOut(username=body.username)

@app.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    h = db.get(form.username)
    if not h or not verify_pw(form.password, h): raise HTTPException(401, "Wrong credentials", headers={"WWW-Authenticate": "Bearer"})
    return Token(access_token=make_token({"sub": form.username}), token_type="bearer")

@app.get("/me", response_model=UserOut)
def me(current: str = Depends(get_current_user)):
    return UserOut(username=current)
