# Handover Documentation — KSP Crime Intelligence Platform

## 1. Project Overview
| Item | Details |
|------|---------|
| Project Name | KSP Crime Intelligence & Analytical Platform |
| Platform | Zoho Catalyst |
| Repository | `github.com/karnataka-police/ksp-crime-intelligence` |
| Production URL | `https://ksp-crime.karnataka.gov.in` |
| Staging URL | `https://staging.ksp-crime.karnataka.gov.in` |
| ML Service | `https://ml-service.ksp.catalystappsail.in` |

## 2. Architecture Documents
- [x] PLANNING_DOCUMENT.md — Full project plan and architecture
- [x] docs/architecture.md — System architecture diagram
- [x] docs/api-spec.md — API documentation
- [x] docs/user-roles.md — RBAC documentation
- [x] docs/uat-plan.md — User acceptance test plan

## 3. Database
- [x] database/zcql-schema.sql — Full schema DDL
- [x] database/migrations/ — Migration scripts
- [x] database/seeds/ — Seed data files
- [x] database/olap-queries/ — Analytical queries
- [x] database/indexes.sql — Search indexes

## 4. Catalyst Services Used
- [x] Catalyst Slate (Next.js static hosting)
- [x] Catalyst Functions (Node.js API backend)
- [x] Catalyst AppSail (Python ML service)
- [x] Catalyst Data Store + OLAP (Relational DB)
- [x] Catalyst Authentication (RBAC with 5 roles)
- [x] Catalyst Cache (Redis)
- [x] Catalyst Search (Full-text search)
- [x] Catalyst Stratus (File storage)
- [x] Catalyst SmartBrowz (PDF generation)
- [x] Catalyst Mail (Email notifications)
- [x] Catalyst Circuits (Workflow orchestration)
- [x] Catalyst Cron (Scheduled jobs)
- [x] Catalyst Signals (Event triggers)
- [x] Catalyst API Gateway (API routing + throttling)
- [x] Catalyst Pipelines (CI/CD)

## 5. Environment Variables
| Variable | Description | Source |
|----------|-------------|--------|
| ML_SERVICE_URL | ML inference endpoint | Pipeline secrets |
| JWT_SECRET | Auth token signing key | Catalyst Console |
| APP_URL | Application base URL | Catalyst Console |
| NEXT_PUBLIC_API_URL | API Gateway URL | Client env |
| NEXT_PUBLIC_ML_API_URL | ML API URL | Client env |

## 6. Scheduled Jobs
| Job | Schedule | Description |
|-----|----------|-------------|
| cron-trends | Daily 02:00 IST | Nightly trend analysis + ML recalculation |
| cron-reports | Weekly Sunday 06:00 IST | Generate district intelligence reports |

## 7. CI/CD Pipeline
- **Trigger:** Push to `main` or `staging` branch
- **Stages:** Lint → Build → Deploy Staging → Integration Tests → Deploy Production
- **Production requires approval** (SCRB team lead)
- **Notifications:** Pipeline failures → devops@ksp.karnataka.gov.in

## 8. Support Contacts
| Role | Contact |
|------|---------|
| SCRB Admin | scrb-team@ksp.karnataka.gov.in |
| DevOps | devops@ksp.karnataka.gov.in |
| Catalyst Support | Zoho Catalyst Console |
