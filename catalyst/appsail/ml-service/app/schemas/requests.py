from pydantic import BaseModel, Field
from typing import Optional, List


class RiskScoreRequest(BaseModel):
    district_id: int
    cases_last_quarter: Optional[int] = 0
    crime_rate_per_100k: Optional[float] = 0.0
    population_density: Optional[float] = 0.0
    urbanization_index: Optional[float] = 0.0
    literacy_rate: Optional[float] = 0.0
    avg_response_time: Optional[float] = 0.0
    repeat_offender_ratio: Optional[float] = 0.0


class RiskScoreResponse(BaseModel):
    district_id: int
    risk_score: float
    risk_level: str


class AnomalyDetectionRequest(BaseModel):
    case_id: Optional[int] = None
    age_year: Optional[int] = 0
    gender_id: Optional[int] = 0
    crime_head_id: Optional[int] = 0
    district_id: Optional[int] = 0
    hour_of_day: Optional[int] = 12
    day_of_week: Optional[int] = 0


class AnomalyDetectionResponse(BaseModel):
    is_anomaly: bool
    anomaly_score: float


class CorrelationRequest(BaseModel):
    district_ids: Optional[List[int]] = None
    indicators: Optional[List[str]] = None


class VariableDetail(BaseModel):
    indicator: str
    coefficient: float
    p_value: float
    significant: bool

class CorrelationResponse(BaseModel):
    correlation_coefficient: float
    p_value: float
    significant_variables: List[str]
    details: Optional[List[VariableDetail]] = None
