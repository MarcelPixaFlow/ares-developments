from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    nome: str
    tipo: str
    preco_base: float
    status: str
    lotes_total: int = 1
    lotes_disponiveis: int = 1


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class LeadCreate(BaseModel):
    nome: str
    email: str
    project_id: int


class LeadOut(BaseModel):
    id: int
    nome: str
    email: str
    project_id: int
    project: ProjectOut
    model_config = ConfigDict(from_attributes=True)


class SaleCreate(BaseModel):
    quantidade: int = 1
