import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from scipy import stats as _  # ensures scipy is importable

BASE = os.path.join(os.path.dirname(__file__), "../../trained_models")
os.makedirs(BASE, exist_ok=True)


def train_risk_model():
    rng = np.random.RandomState(42)
    n = 500
    X = np.column_stack([
        rng.randint(50, 2000, n),
        rng.uniform(10, 500, n),
        rng.uniform(100, 12000, n),
        rng.uniform(10, 95, n),
        rng.uniform(40, 98, n),
        rng.uniform(5, 60, n),
        rng.uniform(0.02, 0.35, n),
    ])
    y = (
        0.15 * X[:, 0] / 2000 + 0.20 * X[:, 1] / 500
        + 0.10 * X[:, 2] / 12000 + 0.10 * X[:, 3] / 95
        - 0.15 * X[:, 4] / 98 + 0.15 * (1 - X[:, 5] / 60)
        + 0.15 * X[:, 6] / 0.35 + rng.normal(0, 0.05, n)
    )
    y = np.clip(y, 0, 1)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    joblib.dump(model, os.path.join(BASE, "risk_score_model.pkl"))
    print("✓ risk_score_model.pkl saved")


def train_anomaly_model():
    rng = np.random.RandomState(42)
    n = 1000
    X = np.column_stack([
        rng.randint(16, 70, n),
        rng.randint(0, 3, n),
        rng.randint(0, 24, n),
        rng.randint(0, 7, n),
        rng.randint(1, 9, n),
        rng.randint(1, 16, n),
    ])
    outliers = rng.randint(0, n, int(n * 0.05))
    X[outliers, 2] = rng.randint(0, 24, len(outliers))
    X[outliers, 3] = rng.randint(0, 7, len(outliers))
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(X)
    joblib.dump(model, os.path.join(BASE, "anomaly_model.pkl"))
    print("✓ anomaly_model.pkl saved")


if __name__ == "__main__":
    train_risk_model()
    train_anomaly_model()
    print("All models trained successfully.")
