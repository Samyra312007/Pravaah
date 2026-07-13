import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "../../trained_models/risk_score_model.pkl"
)


class RiskScoreModel:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(MODEL_PATH):
                self.model = joblib.load(MODEL_PATH)
        except Exception:
            self.model = None

    def predict(self, features: dict) -> float:
        if self.model:
            X = self._extract_features(features)
            return float(self.model.predict(X)[0])
        return self._fallback_predict(features)

    def predict_for_district(self, district_id: int) -> float:
        return self._fallback_predict({"district_id": district_id})

    def _extract_features(self, features: dict) -> np.ndarray:
        return np.array([[
            features.get("cases_last_quarter", 0),
            features.get("crime_rate_per_100k", 0),
            features.get("population_density", 0),
            features.get("urbanization_index", 0),
            features.get("literacy_rate", 0),
            features.get("avg_response_time", 0),
            features.get("repeat_offender_ratio", 0),
        ]])

    def _fallback_predict(self, features: dict) -> float:
        return 0.3
