# URL Shortener (FastAPI backend)

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Dict
import uvicorn

app = FastAPI()

# In‑memory storage for demo purposes
url_map: Dict[str, Dict] = {}

class ShortenRequest(BaseModel):
    url: str

class StatsResponse(BaseModel):
    url: str
    clicks: int

@app.post("/shorten", response_model=StatsResponse)
async def shorten(req: ShortenRequest):
    # simple deterministic short code (first 6 chars of hash)
    import hashlib
    code = hashlib.sha256(req.url.encode()).hexdigest()[:6]
    if code not in url_map:
        url_map[code] = {"url": req.url, "clicks": 0}
    return {"url": req.url, "clicks": url_map[code]["clicks"]}

@app.get("/r/{code}")
async def redirect(code: str, request: Request):
    entry = url_map.get(code)
    if not entry:
        raise HTTPException(status_code=404, detail="Not found")
    entry["clicks"] += 1
    return {"location": entry["url"]}

@app.get("/stats/{code}", response_model=StatsResponse)
async def stats(code: str):
    entry = url_map.get(code)
    if not entry:
        raise HTTPException(status_code=404, detail="Not found")
    return {"url": entry["url"], "clicks": entry["clicks"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
