"""CLI Password Manager — Day 28 Python | Author: devashmit"""
import argparse,base64,getpass,json,os,sys
from pathlib import Path
from cryptography.fernet import Fernet,InvalidToken
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

VAULT=Path("vault.json")

def derive_key(pw:str,salt:bytes)->bytes:
    kdf=PBKDF2HMAC(algorithm=hashes.SHA256(),length=32,salt=salt,iterations=480_000)
    return base64.urlsafe_b64encode(kdf.derive(pw.encode()))

def load()->dict:
    if not VAULT.exists():return{"salt":None,"entries":{}}
    return json.loads(VAULT.read_text())

def save(v:dict):VAULT.write_text(json.dumps(v,indent=2))

def fernet(v,pw)->Fernet:return Fernet(derive_key(pw,bytes.fromhex(v["salt"])))

def cmd_add(_):
    v=load();pw=getpass.getpass("Master passphrase: ")
    if v["salt"] is None:v["salt"]=os.urandom(16).hex();save(v);print("  Vault created.")
    f=fernet(v,pw);site=input("Site: ").strip();user=input("Username: ").strip();passwd=getpass.getpass("Password: ")
    v["entries"][site]={"username":user,"password":f.encrypt(passwd.encode()).decode()}
    save(v);print(f"  Saved '{site}'.")

def cmd_get(_):
    v=load()
    if not v["salt"]:print("Vault empty.");return
    site=input("Site: ").strip()
    if site not in v["entries"]:print("Not found.");return
    pw=getpass.getpass("Master passphrase: ")
    try:
        f=fernet(v,pw);e=v["entries"][site]
        print(f"\n  Site:     {site}\n  Username: {e['username']}\n  Password: {f.decrypt(e['password'].encode()).decode()}\n")
    except InvalidToken:print("Wrong passphrase.")

def cmd_list(_):
    v=load();e=v.get("entries",{})
    if not e:print("Vault is empty.");return
    print(f"\n  {len(e)} entries:\n")
    for i,(s,d) in enumerate(sorted(e.items()),1):print(f"  {i:2}. {s}  ({d['username']})")
    print()

def cmd_delete(_):
    v=load()
    if not v["salt"]:print("Vault empty.");return
    site=input("Site to delete: ").strip()
    if site not in v["entries"]:print("Not found.");return
    pw=getpass.getpass("Master passphrase: ")
    try:
        fernet(v,pw).decrypt(v["entries"][site]["password"].encode())
        del v["entries"][site];save(v);print(f"  Deleted '{site}'.")
    except InvalidToken:print("Wrong passphrase.")

def main():
    p=argparse.ArgumentParser();s=p.add_subparsers(dest="cmd",required=True)
    for c in["add","get","list","delete"]:s.add_parser(c)
    args=p.parse_args()
    {"add":cmd_add,"get":cmd_get,"list":cmd_list,"delete":cmd_delete}[args.cmd](args)

if __name__=="__main__":main()
