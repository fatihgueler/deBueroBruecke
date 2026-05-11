"""FastAPI-Einstiegspunkt für BüroBrücke."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

try:
    from config import get_settings
    from database import init_db
    from limiter import limiter
    from routers import analysis as analysis_router
    from routers import auth as auth_router
    from routers import documents as documents_router
    from routers import stats as stats_router
except ImportError:
    from backend.config import get_settings
    from backend.database import init_db
    from backend.limiter import limiter
    from backend.routers import analysis as analysis_router
    from backend.routers import auth as auth_router
    from backend.routers import documents as documents_router
    from backend.routers import stats as stats_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")
logger = logging.getLogger("buerbruecke")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("BüroBrücke gestartet (env=%s)", settings.environment)
    yield


app = FastAPI(
    title="BüroBrücke API",
    version="0.1.0",
    description="Fotografiere deinen Behördenbrief — wir erklären, was du tun musst.",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": "Ungültige Eingabe.", "errors": exc.errors()},
    )


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
    return {"status": "ok", "service": "BüroBrücke API"}


@app.get("/api/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router.router)
app.include_router(documents_router.router)
app.include_router(analysis_router.router)
app.include_router(stats_router.router)
