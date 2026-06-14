from datetime import datetime,timedelta,timezone
from jose import JWTError,jwt
from passlib.context import CryptContext
SECRET="change-me-long-random-secret";ALGO="HS256";EXP=30
pwd=CryptContext(schemes=["bcrypt"],deprecated="auto")
def hash_pw(p): return pwd.hash(p)
def verify_pw(p,h): return pwd.verify(p,h)
def make_token(data):
    d=data.copy();d["exp"]=datetime.now(timezone.utc)+timedelta(minutes=EXP)
    return jwt.encode(d,SECRET,algorithm=ALGO)
def decode_token(token):
    try: return jwt.decode(token,SECRET,algorithms=[ALGO]).get("sub")
    except JWTError: return None
