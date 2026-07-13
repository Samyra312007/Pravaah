import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "../../trained_models/anomaly_model.pkl"
)


class AnomalyDetectionModel:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(MODEL_PATH):
                self.model = joblib.load(MODEL_PATH)
        except Exception:
            self.model = None

    def predict(self, features: dict) -> tuple:
        if self.model:
            X = self._extract_features(features)
            pred = self.model.predict(X)[0]
            score = self.model.score_samples(X)[0]
            return bool(pred == -1), float(score)
        return self._fallback_predict(features)

    def _extract_features(self, features: dict) -> np.ndarray:
        return np.array([[
            features.get("age_year", 0),
            features.get("gender_id", 0),
            features.get("hour_of_day", 12),
            features.get("day_of_week", 0),
            features.get("crime_head_id", 0),
            features.get("district_id", 0),
        ]])

    def _fallback_predict(self, features: dict) -> tuple:
        return False, 0.0
