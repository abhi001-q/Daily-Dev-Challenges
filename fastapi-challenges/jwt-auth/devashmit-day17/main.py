"""JWT Authentication System — Day 17 FastAPI | Author: devashmit"""
from fastapi import Depends,FastAPI,HTTPException,status
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from pydantic import BaseModel
from auth import decode_token,hash_pw,make_token,verify_pw

app=FastAPI(title="JWT Auth API")
oauth2=OAuth2PasswordBearer(tokenUrl="/login")
db:dict[str,str]={}

class Reg(BaseModel): username:str; password:str
class Token(BaseModel): access_token:str; token_type:str
class Out(BaseModel): username:str

def current(token:str=Depends(oauth2))->str:
    u=decode_token(token)
    if not u or u not in db: raise HTTPException(401,"Invalid token",headers={"WWW-Authenticate":"Bearer"})
    return u

@app.post("/register",response_model=Out,status_code=201)
def register(b:Reg):
    if b.username in db: raise HTTPException(400,"Username taken")
    if len(b.password)<6: raise HTTPException(422,"Min 6 chars")
    db[b.username]=hash_pw(b.password); return Out(username=b.username)

@app.post("/login",response_model=Token)
def login(form:OAuth2PasswordRequestForm=Depends()):
    h=db.get(form.username)
    if not h or not verify_pw(form.password,h): raise HTTPException(401,"Wrong credentials",headers={"WWW-Authenticate":"Bearer"})
    return Token(access_token=make_token({"sub":form.username}),token_type="bearer")

@app.get("/me",response_model=Out)
def me(u:str=Depends(current)): return Out(username=u)
