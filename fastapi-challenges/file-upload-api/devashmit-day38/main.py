"""File Upload & Image Processing API — Day 38 FastAPI | Author: devashmit"""
import io,secrets
from datetime import date
from pathlib import Path
from fastapi import FastAPI,HTTPException,UploadFile,status
from fastapi.staticfiles import StaticFiles
from PIL import Image
from pydantic import BaseModel

app=FastAPI(title="Image Upload API")
ROOT=Path("uploads");ROOT.mkdir(exist_ok=True)
MAX=5*1024*1024;ALLOWED={"image/jpeg","image/png","image/webp"}
SIZES={"thumbnail":(150,150),"medium":(600,600),"large":(1200,1200)}
app.mount("/images",StaticFiles(directory=str(ROOT)),name="images")

class UpRes(BaseModel):original_name:str;thumbnail_url:str;medium_url:str;large_url:str

@app.post("/upload",response_model=UpRes,status_code=201)
async def upload(file:UploadFile):
    if file.content_type not in ALLOWED:raise HTTPException(415,"JPEG/PNG/WebP only")
    data=await file.read()
    if len(data)>MAX:raise HTTPException(413,"Max 5MB")
    folder=ROOT/str(date.today());folder.mkdir(parents=True,exist_ok=True)
    base=secrets.token_hex(8)
    try:img=Image.open(io.BytesIO(data))
    except Exception as e:raise HTTPException(400,f"Invalid image: {e}")
    if img.mode in("RGBA","P"):img=img.convert("RGB")
    urls={}
    for name,dims in SIZES.items():
        r=img.copy();r.thumbnail(dims,Image.LANCZOS);fn=f"{base}_{name}.jpg";r.save(folder/fn,"JPEG",quality=85)
        urls[name]=f"/images/{date.today()}/{fn}"
    return UpRes(original_name=file.filename,thumbnail_url=urls["thumbnail"],medium_url=urls["medium"],large_url=urls["large"])
