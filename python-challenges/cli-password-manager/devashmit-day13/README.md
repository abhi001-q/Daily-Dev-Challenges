# 🐍 CLI Password Manager — Day 13 Python Challenge

**Issue:** [#323](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/323) | Week 2 | Intermediate

## 📋 Description

Terminal password manager with add, get, list, delete commands. Fernet encryption + PBKDF2HMAC key derivation from master passphrase. `getpass` for secure input. Stores in encrypted local JSON file.

## ✨ Features
- `add` / `get` / `list` / `delete` commands
- Fernet symmetric encryption
- PBKDF2HMAC key derivation
- `getpass` — no echo input

## 🚀 How to Run
```bash
pip install cryptography
python manager.py add
python manager.py list
```
