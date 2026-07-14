import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const baseUrl = __ENV.BASE_URL || 'https://ksp-crime.karnataka.gov.in/api';
const token = __ENV.AUTH_TOKEN || 'test-token';

const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 200 },
    { duration: '1m', target: 500 },
    { duration: '2m', target: 500 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.05'],
    http_req_duration: ['p(95)<500'],
  },
};

const authHeaders = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  group('Case API', () => {
    const listRes = http.get(`${baseUrl}/cases?page=1&perPage=25`, authHeaders);
    check(listRes, { 'cases list status 200': (r) => r.status === 200 });
    errorRate.add(listRes.status !== 200);
    apiLatency.add(listRes.timings.duration);
    sleep(0.5);

    const searchRes = http.get(`${baseUrl}/cases/search?q=murder`, authHeaders);
    check(searchRes, { 'search status 200': (r) => r.status === 200 });
    errorRate.add(searchRes.status !== 200);
    sleep(0.3);
  });

  group('Analytics API', () => {
    const dashboardRes = http.get(`${baseUrl}/analytics/dashboard`, authHeaders);
    check(dashboardRes, { 'dashboard status 200': (r) => r.status === 200 });
    errorRate.add(dashboardRes.status !== 200);
    sleep(0.5);

    const trendsRes = http.get(`${baseUrl}/analytics/trends?period=monthly`, authHeaders);
    check(trendsRes, { 'trends status 200': (r) => r.status === 200 });
    errorRate.add(trendsRes.status !== 200);
    sleep(0.3);
  });

  group('Network API', () => {
    const networkRes = http.get(`${baseUrl}/network/repeat-offenders`, authHeaders);
    check(networkRes, { 'network status 200': (r) => r.status === 200 });
    errorRate.add(networkRes.status !== 200);
    sleep(0.5);
  });

  group('ML API', () => {
    const riskRes = http.get(`${baseUrl}/ml/risk-score/1`, authHeaders);
    check(riskRes, { 'risk score status 200': (r) => r.status === 200 });
    errorRate.add(riskRes.status !== 200);
    apiLatency.add(riskRes.timings.duration);
    sleep(1);
  });
}
