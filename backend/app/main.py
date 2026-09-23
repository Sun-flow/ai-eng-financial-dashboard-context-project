import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

origins_str = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in origins_str.split(",")]

app = FastAPI(title="Financial Metrics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
