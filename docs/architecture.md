# Architecture Overview

## Platform
KSP Crime Intelligence & Analytical Platform built on Zoho Catalyst.

## Architecture
- **Frontend**: Next.js 14+ (static export) served via Catalyst Slate
- **Backend**: Node.js Advanced I/O Functions via Catalyst API Gateway
- **ML Service**: Python FastAPI container on Catalyst AppSail
- **Database**: Relational store via Catalyst Data Store (ZCQL) + OLAP
- **Cache**: Catalyst Cache (Redis)
- **Storage**: Catalyst Stratus (S3-compatible)
- **Auth**: Catalyst Authentication with 5 RBAC roles

## Data Flow
1. User Browser → Catalyst Slate (Next.js static)
2. API Gateway (auth, throttle, route)
3. Functions (Node.js) ↔ Data Store / Stratus / SmartBrowz
4. AppSail (Python ML) ↔ Data Store (read)
5. Cron jobs for nightly alerts and ML retraining
6. Event functions triggered by Data Store signals

For full details, see PLANNING_DOCUMENT.md §2.
