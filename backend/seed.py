import json
from pathlib import Path

from sqlalchemy.orm import Session

from models import Project

# Fonte única: src/data/inventory.json (landing, ROI, formulário, dashboard e seed).
INVENTORY_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "inventory.json"


def _load_portfolio() -> list[dict]:
    payload = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    return [
        {
            "nome": item["nome"],
            "tipo": item["tipo"],
            "preco_base": float(item["preco_base"]),
            "status": item["status"],
            "lotes_total": int(item["lotes_total"]),
            "lotes_disponiveis": int(item["lotes_disponiveis"]),
        }
        for item in payload["projects"]
    ]


PORTFOLIO_PROJECTS = _load_portfolio()


def seed_projects(db: Session) -> int:
    inserted = 0
    updated = 0
    # Stock e status vivem no SQLite depois da primeira carga (vendas do painel).
    fields = ("tipo", "preco_base", "lotes_total")
    for item in PORTFOLIO_PROJECTS:
        exists = db.query(Project).filter(Project.nome == item["nome"]).first()
        if exists is not None:
            changed = False
            for field in fields:
                if getattr(exists, field) != item[field]:
                    setattr(exists, field, item[field])
                    changed = True
            if changed:
                updated += 1
            continue
        db.add(Project(**item))
        inserted += 1

    if inserted or updated:
        db.commit()
    return inserted


if __name__ == "__main__":
    from database import Base, SessionLocal, engine, ensure_schema

    Base.metadata.create_all(bind=engine)
    ensure_schema(engine)
    db = SessionLocal()
    try:
        inserted = seed_projects(db)
        rows = db.query(Project).order_by(Project.id).all()
        print(f"db={engine.url}")
        print(f"inserted={inserted} projects={len(rows)}")
        for project in rows:
            print(
                f"{project.id} {project.nome}: "
                f"{project.lotes_disponiveis}/{project.lotes_total} "
                f"({project.status})"
            )
    finally:
        db.close()
