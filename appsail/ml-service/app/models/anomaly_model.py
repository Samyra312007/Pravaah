import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

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
            else:
                self._train_synthetic()
                os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
                joblib.dump(self.model, MODEL_PATH)
        except Exception:
            self._train_synthetic()

    def _train_synthetic(self):
        rng = np.random.RandomState(42)
        n = 1000
        X = np.column_stack([
            rng.randint(16, 70, n),          # age_year
            rng.randint(0, 3, n),            # gender_id
            rng.randint(0, 24, n),           # hour_of_day
            rng.randint(0, 7, n),            # day_of_week
            rng.randint(1, 9, n),            # crime_head_id
            rng.randint(1, 16, n),           # district_id
        ])
        outliers = rng.randint(0, n, int(n * 0.05))
        X[outliers, 2] = rng.randint(0, 24, len(outliers))
        X[outliers, 3] = rng.randint(0, 7, len(outliers))
        self.model = IsolationForest(
            n_estimators=100, contamination=0.05, random_state=42
        )
        self.model.fit(X)

    def predict(self, features: dict) -> tuple:
        X = self._extract_features(features)
        pred = self.model.predict(X)[0]
        score = self.model.score_samples(X)[0]
        is_anomaly = bool(pred == -1)
        normalized_score = float(2.0 / (1.0 + np.exp(-abs(score))) - 1.0)
        return is_anomaly, round(normalized_score, 4)

    def _extract_features(self, features: dict) -> np.ndarray:
        return np.array([[
            features.get("age_year", 0),
            features.get("gender_id", 0),
            features.get("hour_of_day", 12),
            features.get("day_of_week", 0),
            features.get("crime_head_id", 0),
            features.get("district_id", 0),
        ]])
