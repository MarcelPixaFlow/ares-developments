from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "ares.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_schema(bind: Engine | None = None) -> None:
    """SQLite create_all does not add columns to existing tables."""
    target = bind or engine
    statements = {
        "lotes_total": "ALTER TABLE projects ADD COLUMN lotes_total INTEGER NOT NULL DEFAULT 0",
        "lotes_disponiveis": "ALTER TABLE projects ADD COLUMN lotes_disponiveis INTEGER NOT NULL DEFAULT 0",
    }
    with target.connect() as connection:
        existing = {
            row[1] for row in connection.execute(text("PRAGMA table_info(projects)")).fetchall()
        }
        if not existing:
            return
        for column, statement in statements.items():
            if column not in existing:
                connection.execute(text(statement))
        connection.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
