# API Specification

## Base URL
Production: `https://ksp-crime.karnataka.gov.in/api`
Staging: `https://staging.ksp-crime.karnataka.gov.in/api`

## Authentication
All endpoints require `Authorization: Bearer <token>` header.

## Response Format
```json
{
  "status": "success|error",
  "data": { ... },
  "meta": { "page": 1, "perPage": 50, "total": 1247, "timestamp": "..." },
  "error": { "code": "...", "message": "..." }
}
```

## Endpoints
See PLANNING_DOCUMENT.md §11 for full route table.

### Cases
- `GET /api/cases` — List with pagination and filters
- `GET /api/cases/:id` — Case detail
- `POST /api/cases` — Create
- `PUT /api/cases/:id` — Update
- `DELETE /api/cases/:id` — Soft delete
- `GET /api/cases/search` — Full-text search

### Analytics
- `GET /api/analytics/dashboard` — Dashboard KPIs
- `GET /api/analytics/trends` — Monthly/quarterly trends
- `GET /api/analytics/hotspots` — Spatiotemporal hotspots
- `GET /api/analytics/district/:id` — District stats

### Network
- `GET /api/network/connections/:entityId` — Entity connections
- `GET /api/network/repeat-offenders` — Repeat offender list
- `GET /api/network/associations` — Hidden associations

### ML
- `GET /api/ml/risk-score/:districtId` — Risk score
- `GET /api/ml/anomalies` — Recent anomalies
- `GET /api/ml/correlate` — Correlation data

### Reports
- `POST /api/reports/generate` — Trigger report
- `GET /api/reports/:id/download` — Download PDF
