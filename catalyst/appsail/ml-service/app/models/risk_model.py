import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

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
            else:
                self._train_synthetic()
                os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
                joblib.dump(self.model, MODEL_PATH)
        except Exception:
            self._train_synthetic()

    def _train_synthetic(self):
        rng = np.random.RandomState(42)
        n = 500
        X = np.column_stack([
            rng.randint(50, 2000, n),       # cases_last_quarter
            rng.uniform(10, 500, n),         # crime_rate_per_100k
            rng.uniform(100, 12000, n),      # population_density
            rng.uniform(10, 95, n),          # urbanization_index
            rng.uniform(40, 98, n),          # literacy_rate
            rng.uniform(5, 60, n),           # avg_response_time
            rng.uniform(0.02, 0.35, n),      # repeat_offender_ratio
        ])
        y = (
            0.15 * X[:, 0] / 2000
            + 0.20 * X[:, 1] / 500
            + 0.10 * X[:, 2] / 12000
            + 0.10 * X[:, 3] / 95
            - 0.15 * X[:, 4] / 98
            + 0.15 * (1 - X[:, 5] / 60)
            + 0.15 * X[:, 6] / 0.35
            + rng.normal(0, 0.05, n)
        )
        y = np.clip(y, 0, 1)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X, y)

    def predict(self, features: dict) -> float:
        X = self._extract_features(features)
        return float(np.clip(self.model.predict(X)[0], 0, 1))

    def predict_for_district(self, district_id: int) -> float:
        X = np.array([[
            500 + district_id * 30,
            150 + district_id * 10,
            2000 + district_id * 300,
            40 + district_id * 2,
            75 - district_id * 1.5,
            30 - district_id * 0.5,
            0.10 + district_id * 0.005,
        ]])
        return float(np.clip(self.model.predict(X)[0], 0, 1))

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
