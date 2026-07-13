# KSP Crime Intelligence & Analytical Platform

Karnataka State Police — Strategic Crime Intelligence Platform built on Zoho Catalyst.

## Project Structure

```
pravaah/
├── catalyst/           # Catalyst CLI project
│   ├── client/         # Next.js frontend (Slate)
│   ├── functions/      # Node.js API Functions
│   ├── appsail/        # Python ML Service (AppSail)
│   └── pipelines/      # CI/CD configuration
├── database/           # Schema, migrations, seeds, OLAP queries
├── docs/               # Architecture, API spec, user roles
└── PLANNING_DOCUMENT.md
```

## Tech Stack

- **Frontend**: Next.js 14+, Tailwind CSS, shadcn/ui, Recharts, MapLibre GL, D3.js
- **Backend**: Catalyst Functions (Node.js Advanced I/O)
- **ML**: FastAPI, scikit-learn, pandas (Catalyst AppSail)
- **Database**: Catalyst Data Store (ZCQL) + OLAP
- **Auth**: Catalyst Authentication (5 RBAC roles)

## Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.11
- Catalyst CLI (latest)
- Zoho Catalyst account

### Development

1. Clone the repo
2. Install frontend dependencies:
   ```bash
   cd catalyst/client && npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

### Deployment

Deployment is handled via Catalyst Pipelines on git push to `main`.

## Phases

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1 — Foundation | Days 1-3 | Project scaffold, DB, auth, shell deployed |
| 2 — Core CRUD | Days 4-5 | Full case management |
| 3 — Visualization | Days 6-9 | Dashboards, maps, alerts |
| 4 — Network Analysis | Days 10-11 | D3 network graphs, repeat offenders |
| 5 — ML Intelligence | Days 12-15 | Risk scores, anomaly detection |
| 6 — Reports & Alerts | Days 16-17 | PDF reports, email digests |
| 7 — Production | Week 18 | Security, performance, UAT |
