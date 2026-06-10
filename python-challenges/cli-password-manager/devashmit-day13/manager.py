"""CLI Password Manager — Day 13 Python | Author: devashmit"""
import argparse, base64, getpass, json, os, sys
from pathlib import Path
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

VAULT = Path("vault.json")

def derive_key(passphrase: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=480_000)
    return base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))

def load_vault() -> dict:
    if not VAULT.exists(): return {"salt": None, "entries": {}}
    return json.loads(VAULT.read_text())

def save_vault(v: dict): VAULT.write_text(json.dumps(v, indent=2))

def get_fernet(v: dict, pw: str) -> Fernet:
    return Fernet(derive_key(pw, bytes.fromhex(v["salt"])))

def cmd_add(_):
    v = load_vault(); pw = getpass.getpass("Master passphrase: ")
    if v["salt"] is None:
        v["salt"] = os.urandom(16).hex(); save_vault(v); print("  Vault created.")
    f = get_fernet(v, pw)
    site = input("Site: ").strip(); user = input("Username: ").strip()
    password = getpass.getpass("Password: ")
    v["entries"][site] = {"username": user, "password": f.encrypt(password.encode()).decode()}
    save_vault(v); print(f"  Saved '{site}'.")

def cmd_get(_):
    v = load_vault()
    if not v["salt"]: print("Vault empty."); return
    site = input("Site: ").strip()
    if site not in v["entries"]: print("Not found."); return
    pw = getpass.getpass("Master passphrase: ")
    try:
        f = get_fernet(v, pw); e = v["entries"][site]
        print(f"\n  Site:     {site}\n  Username: {e['username']}\n  Password: {f.decrypt(e['password'].encode()).decode()}\n")
    except InvalidToken: print("Wrong passphrase.")

def cmd_list(_):
    v = load_vault(); e = v.get("entries", {})
    if not e: print("Vault is empty."); return
    print(f"\n  {len(e)} entr{'y' if len(e)==1 else 'ies'}:\n")
    for i, (s, d) in enumerate(sorted(e.items()), 1): print(f"  {i:2}. {s}  ({d['username']})")
    print()

def cmd_delete(_):
    v = load_vault()
    if not v["salt"]: print("Vault empty."); return
    site = input("Site to delete: ").strip()
    if site not in v["entries"]: print("Not found."); return
    pw = getpass.getpass("Master passphrase: ")
    try:
        get_fernet(v, pw).decrypt(v["entries"][site]["password"].encode())
        del v["entries"][site]; save_vault(v); print(f"  Deleted '{site}'.")
    except InvalidToken: print("Wrong passphrase.")

def main():
    p = argparse.ArgumentParser()
    s = p.add_subparsers(dest="cmd", required=True)
    for c in ["add","get","list","delete"]: s.add_parser(c)
    args = p.parse_args()
    {"add":cmd_add,"get":cmd_get,"list":cmd_list,"delete":cmd_delete}[args.cmd](args)

if __name__ == "__main__": main()
