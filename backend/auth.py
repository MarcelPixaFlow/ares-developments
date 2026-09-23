import os

from fastapi import Header, HTTPException

DASHBOARD_PASSWORD = os.getenv("ARES_DASHBOARD_PASSWORD", "ares-admin")


def require_dashboard_key(x_ares_key: str | None = Header(default=None, alias="X-Ares-Key")):
    if not x_ares_key or x_ares_key != DASHBOARD_PASSWORD:
        raise HTTPException(status_code=401, detail="Acesso não autorizado")
