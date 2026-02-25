from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import employee, attendance

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(employee.router)
app.include_router(attendance.router)

@app.get("/")
def read_root():
    return {"message": "HRMS API", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
