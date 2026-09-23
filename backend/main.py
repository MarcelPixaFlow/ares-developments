from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from auth import require_dashboard_key
from database import Base, SessionLocal, engine, ensure_schema, get_db
from models import Lead, Project
from schemas import LeadCreate, LeadOut, ProjectCreate, ProjectOut, SaleCreate
from seed import seed_projects


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_schema(engine)
    db = SessionLocal()
    try:
        seed_projects(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Ares Developments API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_dashboard_key),
):
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/sales", response_model=ProjectOut)
def register_sale(
    project_id: int,
    payload: SaleCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_dashboard_key),
):
    if payload.quantidade < 1:
        raise HTTPException(status_code=400, detail="Quantidade inválida")

    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    available = project.lotes_disponiveis or 0
    if available < payload.quantidade:
        raise HTTPException(status_code=409, detail="Estoque insuficiente")

    project.lotes_disponiveis = available - payload.quantidade
    if project.lotes_disponiveis == 0:
        project.status = "Esgotado"
    db.commit()
    db.refresh(project)
    return project


@app.get("/leads", response_model=list[LeadOut])
def list_leads(
    db: Session = Depends(get_db),
    _: None = Depends(require_dashboard_key),
):
    return db.query(Lead).options(joinedload(Lead.project)).all()


@app.post("/leads", response_model=LeadOut, status_code=201)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    db.refresh(lead, attribute_names=["project"])
    return lead
