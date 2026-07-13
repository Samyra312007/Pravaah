from fastapi import APIRouter, HTTPException
from app.models.risk_model import RiskScoreModel
from app.schemas.requests import RiskScoreRequest, RiskScoreResponse

router = APIRouter()
model = RiskScoreModel()


@router.post("/risk-score", response_model=RiskScoreResponse)
async def predict_risk_score(request: RiskScoreRequest):
    try:
        score = model.predict(request.dict())
        return RiskScoreResponse(
            district_id=request.district_id,
            risk_score=score,
            risk_level=_get_risk_level(score),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/risk-score/{district_id}", response_model=RiskScoreResponse)
async def get_risk_score(district_id: int):
    try:
        score = model.predict_for_district(district_id)
        return RiskScoreResponse(
            district_id=district_id,
            risk_score=score,
            risk_level=_get_risk_level(score),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _get_risk_level(score: float) -> str:
    if score < 0.25:
        return "Low"
    elif score < 0.50:
        return "Medium"
    elif score < 0.75:
        return "High"
    return "Critical"
