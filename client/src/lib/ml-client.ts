const ML_API_BASE = process.env.NEXT_PUBLIC_ML_API_URL || "https://ml-service.ksp.catalystappsail.in";

async function mlRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${ML_API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    throw new Error(`ML API Error: ${res.status}`);
  }

  return res.json();
}

export const mlApi = {
  getRiskScore: <T>(districtId: number) =>
    mlRequest<T>(`/predict/risk-score/${districtId}`),
  getAnomalies: <T>() =>
    mlRequest<T>("/detect/anomalies"),
  getCorrelation: <T>(params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return mlRequest<T>(`/correlate/socioeconomic${qs}`);
  },
  health: () => mlRequest<{ status: string }>("/health"),
};
