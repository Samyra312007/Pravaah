# Load Testing — KSP Crime Intelligence Platform

## Prerequisites
- Node.js 18+
- `k6` (https://k6.io) or `artillery` (https://artillery.io)

## Test Scenarios

### 1. API Throughput (k6)
```bash
k6 run load-testing/api-throughput.js
```

### 2. Concurrent Users (Artillery)
```bash
npx artillery run load-testing/concurrent-users.yaml
```

### 3. ML Service Load
```bash
k6 run load-testing/ml-inference.js
```

## Targets
| Metric | Target |
|--------|--------|
| API response time (p95) | < 500ms |
| ML prediction latency | < 1s |
| Concurrent users | 500 |
| Requests/second (API) | 200 |
| Search response time | < 200ms |

## Test Data
- 10,000+ case records pre-loaded
- 15 districts with station data
- Historical case data spanning 3 years
