import sqlite3
from contextlib import contextmanager

DB = "urls.db"

def init_db():
    with get_conn() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS urls(
            code       TEXT PRIMARY KEY,
            original   TEXT NOT NULL,
            clicks     INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')))""")

@contextmanager
def get_conn():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    try: yield c; c.commit()
    finally: c.close()
