from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routes import words, groups, sessions, dashboard

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Punjabi LangPortal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(words.router, prefix="/words", tags=["words"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(sessions.router, tags=["sessions"])
app.include_router(dashboard.router, tags=["dashboard"])
