from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    preco_base = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    lotes_total = Column(Integer, nullable=False, default=0)
    lotes_disponiveis = Column(Integer, nullable=False, default=0)

    leads = relationship("Lead", back_populates="project")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    project = relationship("Project", back_populates="leads")
