from fastapi import APIRouter, HTTPException
from app.models.anomaly_model import AnomalyDetectionModel
from app.schemas.requests import AnomalyDetectionRequest, AnomalyDetectionResponse

router = APIRouter()
model = AnomalyDetectionModel()


@router.post("/anomalies", response_model=AnomalyDetectionResponse)
async def detect_anomalies(request: AnomalyDetectionRequest):
    try:
        is_anomaly, score = model.predict(request.dict())
        return AnomalyDetectionResponse(
            is_anomaly=is_anomaly,
            anomaly_score=score,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/anomalies")
async def get_recent_anomalies():
    return {"anomalies": [], "total": 0}
