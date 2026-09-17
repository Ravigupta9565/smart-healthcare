import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, appointments, health_metrics, medicines, patients
from app.database.database import initialize_database

# Import all models so SQLAlchemy creates their tables
from app.models import user, appointment, health_metrics as hm_model, medicine as med_model  # noqa: F401

initialize_database()

app = FastAPI(
    title="SmartHealth AI — Healthcare Management System",
    version="2.0.0",
    description="AI-Powered Smart Healthcare Platform with health metrics, medicine reminders, and appointment management.",
)

# Allowed origins: Vercel frontend, local development, and custom environment variable
default_origins = [
    "https://smart-healthcare-phi.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
custom_origins = os.getenv("ALLOWED_ORIGINS", "")
origins = list(default_origins)
if custom_origins:
    for o in custom_origins.split(","):
        cleaned = o.strip()
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

# CORS Middleware Setup (Secure origin control allowing Vercel deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response


# Register all routers
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(health_metrics.router)
app.include_router(medicines.router)
app.include_router(patients.router)


@app.get("/")
def root():
    return {
        "message": "SmartHealth AI API is running ✅",
        "version": "2.0.0",
        "endpoints": [
            "/api/auth",
            "/api/appointments",
            "/api/health-metrics",
            "/api/medicines",
            "/api/patients/{patient_id}/export-pdf",
            "/docs",
            "/health",
        ],
    }



@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "smart-healthcare-backend"}

