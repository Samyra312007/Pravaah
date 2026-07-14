import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const mlUrl = __ENV.ML_URL || 'https://ml-service.ksp.catalystappsail.in';
const token = __ENV.AUTH_TOKEN || 'test-token';

const errorRate = new Rate('ml_errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    ml_errors: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

const headers = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};

const districts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function () {
  const districtId = districts[Math.floor(Math.random() * districts.length)];

  const riskRes = http.get(`${mlUrl}/predict/risk-score/${districtId}`, headers);
  check(riskRes, { 'risk score status 200': (r) => r.status === 200 });
  errorRate.add(riskRes.status !== 200);

  sleep(0.5);

  const anomalyRes = http.get(`${mlUrl}/detect/anomalies`, headers);
  check(anomalyRes, { 'anomaly status 200': (r) => r.status === 200 });
  errorRate.add(anomalyRes.status !== 200);

  sleep(1);
}
