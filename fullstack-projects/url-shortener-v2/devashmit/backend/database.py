import sqlite3
from contextlib import contextmanager
from datetime import datetime

DB = "urls.db"

def init_db():
    with get_conn() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS urls(
            code TEXT PRIMARY KEY, original TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')))""")
        c.execute("""CREATE TABLE IF NOT EXISTS clicks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL, clicked_at TEXT DEFAULT (datetime('now')),
            user_agent TEXT)""")

@contextmanager
def get_conn():
    c = sqlite3.connect(DB); c.row_factory = sqlite3.Row
    try: yield c; c.commit()
    finally: c.close()
