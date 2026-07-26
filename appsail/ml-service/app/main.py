from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.predict import router as predict_router
from app.api.detect import router as detect_router
from app.api.correlate import router as correlate_router

app = FastAPI(
    title="KSP ML Intelligence Service",
    version="1.0.0",
    description="ML inference service for crime risk scoring, anomaly detection, and socio-economic correlation",
)

app.include_router(health_router, tags=["health"])
app.include_router(predict_router, prefix="/predict", tags=["predict"])
app.include_router(detect_router, prefix="/detect", tags=["detect"])
app.include_router(correlate_router, prefix="/correlate", tags=["correlate"])


@app.get("/")
async def root():
    return {"service": "KSP ML Intelligence", "status": "running"}
