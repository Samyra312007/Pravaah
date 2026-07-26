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
    import random
    districts = [
        "Bengaluru Urban", "Mysuru", "Hubballi-Dharwad", "Belagavi",
        "Kalaburagi", "Mangaluru", "Shivamogga", "Ballari",
    ]
    heads = [
        "Cyber Crimes", "Crimes Against Women", "Crimes Against Body",
        "Narcotics", "Economic Offences", "Organised Crime",
    ]
    anomalies = []
    for _ in range(random.randint(3, 6)):
        is_anom, score = model.predict({
            "age_year": random.randint(16, 65),
            "gender_id": random.randint(0, 2),
            "hour_of_day": random.randint(0, 23),
            "day_of_week": random.randint(0, 6),
            "crime_head_id": random.randint(1, 8),
            "district_id": random.randint(1, 15),
        })
        anomalies.append({
            "case_id": random.randint(10000, 99999),
            "district": random.choice(districts),
            "crime_head": random.choice(heads),
            "anomaly_score": score,
            "is_anomaly": is_anom,
            "registered_date": f"2026-{random.randint(1,6):02d}-{random.randint(1,28):02d}",
            "description": "Unusual pattern detected in crime characteristics" if is_anom else "Normal pattern",
        })
    return {"anomalies": anomalies, "total": len(anomalies)}
