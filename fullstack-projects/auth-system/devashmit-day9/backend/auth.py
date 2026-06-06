from datetime import datetime,timedelta,timezone
from jose import JWTError,jwt
from passlib.context import CryptContext
SECRET="change-me-long-random-secret";ALGO="HS256";EXP=60
pwd=CryptContext(schemes=["bcrypt"],deprecated="auto")
def hash_pw(p): return pwd.hash(p)
def verify_pw(p,h): return pwd.verify(p,h)
def make_token(d):
    x=d.copy();x["exp"]=datetime.now(timezone.utc)+timedelta(minutes=EXP)
    return jwt.encode(x,SECRET,algorithm=ALGO)
def decode_token(t):
    try: return jwt.decode(t,SECRET,algorithms=[ALGO]).get("sub")
    except JWTError: return None
