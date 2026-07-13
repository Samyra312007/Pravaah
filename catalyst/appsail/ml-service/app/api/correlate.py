from fastapi import APIRouter, HTTPException
from app.models.correlation import SocioEconomicCorrelation
from app.schemas.requests import CorrelationRequest, CorrelationResponse

router = APIRouter()
model = SocioEconomicCorrelation()


@router.post("/socioeconomic", response_model=CorrelationResponse)
async def correlate_socioeconomic(request: CorrelationRequest):
    try:
        result = model.analyze(request.dict())
        return CorrelationResponse(
            correlation_coefficient=result["coefficient"],
            p_value=result["p_value"],
            significant_variables=result["significant_variables"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/socioeconomic")
async def get_correlation_data():
    return {"correlations": []}
