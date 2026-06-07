import sqlite3
from contextlib import contextmanager
DB="notes.db"
def init_db():
    with get_conn() as c:
        c.execute("""CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,content TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now')))""")
@contextmanager
def get_conn():
    c=sqlite3.connect(DB);c.row_factory=sqlite3.Row
    try:yield c;c.commit()
    finally:c.close()
