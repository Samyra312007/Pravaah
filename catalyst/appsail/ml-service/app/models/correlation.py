import numpy as np
from scipy import stats


class SocioEconomicCorrelation:
    def __init__(self):
        self._synthetic_data = self._generate_synthetic()

    def _generate_synthetic(self):
        rng = np.random.RandomState(42)
        n = 15
        return {
            "unemployment_rate": rng.uniform(3, 18, n),
            "literacy_rate": rng.uniform(55, 95, n),
            "poverty_index": rng.uniform(5, 40, n),
            "urbanization_index": rng.uniform(15, 90, n),
            "police_per_capita": rng.uniform(0.5, 3.5, n),
            "crime_rate": rng.uniform(50, 450, n),
        }

    def analyze(self, features: dict) -> dict:
        district_ids = features.get("district_ids")
        indicators = features.get("indicators") or [
            "unemployment_rate", "literacy_rate", "poverty_index",
            "urbanization_index", "police_per_capita",
        ]

        results = []
        crime_rate = self._synthetic_data["crime_rate"]

        for ind in indicators:
            if ind not in self._synthetic_data:
                continue
            values = self._synthetic_data[ind]
            if district_ids:
                mask = np.isin(np.arange(len(values)), district_ids)
                if mask.sum() < 3:
                    continue
                values = values[mask]
                cr = crime_rate[mask]
            else:
                cr = crime_rate

            coef, p_val = stats.pearsonr(values, cr)
            results.append({
                "indicator": ind,
                "coefficient": round(coef, 4),
                "p_value": round(p_val, 6),
                "significant": p_val < 0.05,
            })

        significant = [r["indicator"] for r in results if r["significant"]]
        avg_coef = np.mean([r["coefficient"] for r in results]) if results else 0.0
        avg_p = np.mean([r["p_value"] for r in results]) if results else 1.0

        return {
            "coefficient": round(avg_coef, 4),
            "p_value": round(avg_p, 6),
            "significant_variables": significant,
            "details": results,
        }
