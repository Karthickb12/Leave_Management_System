from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import requests
from .core.config import settings

app = FastAPI(title="College Event Tracker API")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(requests.router)

@app.get("/")
def read_root():
    return {"message": "College Event Tracker API is running securely."}
