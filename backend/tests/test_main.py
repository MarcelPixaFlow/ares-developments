ADMIN = {"X-Ares-Key": "ares-admin"}


def test_create_and_list_projects(client):
    payload = {
        "nome": "Arcana Valley",
        "tipo": "Terreno",
        "preco_base": 250000,
        "status": "Disponível",
        "lotes_total": 40,
        "lotes_disponiveis": 28,
    }
    created = client.post("/projects", json=payload, headers=ADMIN)
    assert created.status_code == 201
    body = created.json()
    assert body["nome"] == "Arcana Valley"
    assert body["id"] is not None
    assert body["lotes_disponiveis"] == 28
    assert body["lotes_total"] == 40

    listed = client.get("/projects")
    assert listed.status_code == 200
    projects = listed.json()
    assert len(projects) == 1
    assert projects[0]["status"] == "Disponível"


def test_create_project_without_key_returns_401(client):
    response = client.post(
        "/projects",
        json={
            "nome": "Arcana Valley",
            "tipo": "Terreno",
            "preco_base": 250000,
            "status": "Disponível",
        },
    )
    assert response.status_code == 401


def test_create_and_list_leads_with_project(client):
    project = client.post(
        "/projects",
        json={
            "nome": "Ares Colony",
            "tipo": "Habitat",
            "preco_base": 890000,
            "status": "Em Construção",
        },
        headers=ADMIN,
    ).json()

    created = client.post(
        "/leads",
        json={
            "nome": "Helena Voss",
            "email": "helena.voss@example.com",
            "project_id": project["id"],
        },
    )
    assert created.status_code == 201
    lead = created.json()
    assert lead["nome"] == "Helena Voss"
    assert lead["project"]["nome"] == "Ares Colony"

    listed = client.get("/leads", headers=ADMIN)
    assert listed.status_code == 200
    leads = listed.json()
    assert len(leads) == 1
    assert leads[0]["project_id"] == project["id"]


def test_list_leads_without_key_returns_401(client):
    assert client.get("/leads").status_code == 401


def test_create_lead_with_missing_project_returns_404(client):
    response = client.post(
        "/leads",
        json={
            "nome": "Marcus Chen",
            "email": "marcus.chen@example.com",
            "project_id": 999,
        },
    )
    assert response.status_code == 404


def test_seed_portfolio_projects(client):
    from seed import PORTFOLIO_PROJECTS, seed_projects
    from tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    try:
        first = seed_projects(db)
        second = seed_projects(db)
        assert first == len(PORTFOLIO_PROJECTS)
        assert second == 0
    finally:
        db.close()

    listed = client.get("/projects").json()
    names = {project["nome"] for project in listed}
    assert names == {project["nome"] for project in PORTFOLIO_PROJECTS}
    helios = next(project for project in listed if project["nome"] == "Cidadela Helios")
    assert helios["lotes_disponiveis"] == 9
    assert helios["lotes_total"] == 12


def test_register_sale_decrements_stock(client):
    project = client.post(
        "/projects",
        json={
            "nome": "Cidadela Helios",
            "tipo": "Infraestrutura",
            "preco_base": 2400000,
            "status": "Sítio",
            "lotes_total": 12,
            "lotes_disponiveis": 9,
        },
        headers=ADMIN,
    ).json()

    sold = client.post(
        f"/projects/{project['id']}/sales",
        json={"quantidade": 2},
        headers=ADMIN,
    )
    assert sold.status_code == 200
    body = sold.json()
    assert body["lotes_disponiveis"] == 7
    assert body["status"] == "Sítio"


def test_register_sale_marks_sold_out(client):
    project = client.post(
        "/projects",
        json={
            "nome": "Mars Retail Arcology",
            "tipo": "Comercial",
            "preco_base": 1200000,
            "status": "Disponível",
            "lotes_total": 2,
            "lotes_disponiveis": 1,
        },
        headers=ADMIN,
    ).json()

    sold = client.post(
        f"/projects/{project['id']}/sales",
        json={"quantidade": 1},
        headers=ADMIN,
    )
    assert sold.status_code == 200
    assert sold.json()["lotes_disponiveis"] == 0
    assert sold.json()["status"] == "Esgotado"


def test_register_sale_insufficient_stock_returns_409(client):
    project = client.post(
        "/projects",
        json={
            "nome": "Habitats Modulares",
            "tipo": "Habitat",
            "preco_base": 420000,
            "status": "Disponível",
            "lotes_total": 10,
            "lotes_disponiveis": 1,
        },
        headers=ADMIN,
    ).json()

    response = client.post(
        f"/projects/{project['id']}/sales",
        json={"quantidade": 2},
        headers=ADMIN,
    )
    assert response.status_code == 409


def test_seed_does_not_reset_sales(client):
    from models import Project
    from seed import seed_projects
    from tests.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    try:
        seed_projects(db)
        helios = db.query(Project).filter(Project.nome == "Cidadela Helios").first()
        helios.lotes_disponiveis = 3
        helios.status = "Sítio"
        db.commit()
        seed_projects(db)
        db.refresh(helios)
        assert helios.lotes_disponiveis == 3
        assert helios.status == "Sítio"
    finally:
        db.close()
