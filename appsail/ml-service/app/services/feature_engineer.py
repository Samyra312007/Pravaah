import pandas as pd
import numpy as np


class FeatureEngineer:
    @staticmethod
    def create_risk_features(df: pd.DataFrame) -> pd.DataFrame:
        features = df.copy()
        features["crime_rate_per_100k"] = (
            features["total_cases"] / features["population"] * 100000
        )
        features["repeat_offender_ratio"] = (
            features["repeat_offender_cases"] / features["total_cases"]
        ).fillna(0)
        features["seasonality_sin"] = np.sin(
            2 * np.pi * features["month"] / 12
        )
        features["seasonality_cos"] = np.cos(
            2 * np.pi * features["month"] / 12
        )
        return features

    @staticmethod
    def create_anomaly_features(df: pd.DataFrame) -> pd.DataFrame:
        features = df.copy()
        features["hour_of_day"] = pd.to_datetime(
            features["crime_registered_date"]
        ).dt.hour
        features["day_of_week"] = pd.to_datetime(
            features["crime_registered_date"]
        ).dt.dayofweek
        features["is_weekend"] = features["day_of_week"].isin([5, 6]).astype(int)
        return features
