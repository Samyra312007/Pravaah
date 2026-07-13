import pandas as pd
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../data")


class DataLoader:
    @staticmethod
    def load_crime_data() -> pd.DataFrame:
        path = os.path.join(DATA_DIR, "historical_cases.csv")
        if os.path.exists(path):
            return pd.read_csv(path)
        return pd.DataFrame()

    @staticmethod
    def load_census_data() -> pd.DataFrame:
        path = os.path.join(DATA_DIR, "census_data.csv")
        if os.path.exists(path):
            return pd.read_csv(path)
        return pd.DataFrame()
