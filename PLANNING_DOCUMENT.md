# Crime Intelligence & Analytical Platform — Project Plan

## Karnataka State Police (KSP)

---

## Table of Contents

1.  [Executive Summary](#1-executive-summary)
2.  [Architecture Overview](#2-architecture-overview)
3.  [Technology Stack](#3-technology-stack)
4.  [Feature-to-Catalyst Service Mapping](#4-feature-to-catalyst-service-mapping)
5.  [Project Structure](#5-project-structure)
6.  [Database Schema](#6-database-schema)
7.  [RBAC Design](#7-rbac-design)
8.  [Implementation Phases](#8-implementation-phases)
9.  [ML Model Strategy](#9-ml-model-strategy)
10. [Key Visualization Components](#10-key-visualization-components)
11. [API Design](#11-api-design)

---

## 1. Executive Summary

The Karnataka State Police (KSP) requires a state-of-the-art Crime Intelligence & Analytical Platform that integrates sociological insights and criminological intelligence with cutting-edge technology. The platform replaces manual, Excel-based reporting with interactive dashboards, geospatial maps, network analysis, and AI-driven predictive intelligence.

### Key Capabilities

| # | Capability | Description |
|---|-----------|-------------|
| **1** | **Advanced Visualization** | Interactive dashboards, geospatial maps (MapLibre GL), district-level drill-down, spatiotemporal crime hotspots, emerging trend alerts |
| **2** | **Network & Link Analysis** | Node-based relationship mapping (D3-force), repeat offender tracking with MO profiles, hidden association detection |
| **3** | **Predictive Intelligence** | Socio-economic correlation overlays, AI-driven risk scoring, anomaly detection via ML |
| **4** | **Pattern Discovery** | Statistical spatial/temporal hotspot identification for smarter resource deployment |
| **5** | **Network & Behavioral Analysis** | Suspect connections, organized crime network detection, recurring MO identification |
| **6** | **AI/ML Intelligence** | Hidden correlation detection, anomaly detection, predictive crime risk forecasting |

### Platform Goals

- Move from **reactive** to **proactive** policing
- Break down **data silos** across police stations and districts
- Enable **evidence-based prevention** strategies
- Transform SCRB into a **Strategic Intelligence Hub**

---

## 2. Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         Catalyst Platform                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────┐                               │
│  │     Catalyst Slate (Static Hosting)      │                               │
│  │  ┌─────────────────────────────────────┐ │                               │
│  │  │   Next.js (Static Export)           │ │                               │
│  │  │                                     │ │                               │
│  │  │  ┌──────────┐ ┌──────────┐ ┌─────┐ │ │                               │
│  │  │  │Dashboard │ │  Maps    │ │ Net │ │ │                               │
│  │  │  │(Recharts)│ │(MapLibre)│ │(D3) │ │ │                               │
│  │  │  └──────────┘ └──────────┘ └─────┘ │ │                               │
│  │  └─────────────────────────────────────┘ │                               │
│  └──────────────────┬──────────────────────┘                               │
│                     │                                                      │
│  ┌──────────────────▼──────────────────────────────────────────────────┐   │
│  │               Catalyst API Gateway                                  │   │
│  │  /api/cases · /api/analytics · /api/network · /api/reports         │   │
│  │  (routing · throttling · auth enforcement)                         │   │
│  └──────────────────┬──────────────────────────────────────────────────┘   │
│                     │                                                      │
│  ┌──────────────────▼──────────────────────────────────────────────────┐   │
│  │            Catalyst Functions (Node.js — Advanced I/O)               │   │
│  │                                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │ Case CRUD│  │ Network  │  │Analytics │  │ SmartBrowz       │   │   │
│  │  │ API      │  │ Analysis │  │ API      │  │ Report Gen       │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────┐  ┌──────────────────┐                         │   │
│  │  │ Event Functions  │  │ Cron Functions   │                         │   │
│  │  │ (Signals-driven) │  │ (nightly alerts) │                         │   │
│  │  └──────────────────┘  └──────────────────┘                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │     Catalyst AppSail (Custom OCI Runtime) — Python ML Service        │   │
│  │  ┌───────────────────────────────────────────────────────────────┐   │   │
│  │  │  FastAPI + scikit-learn + pandas                              │   │   │
│  │  │  /predict/risk-score  /detect/anomalies  /correlate           │   │   │
│  │  └───────────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐  ┌──────────────────┐    │
│  │  Data Store │  │  Cache   │  │  Stratus   │  │  Search          │    │
│  │  (ZCQL)     │  │  (Redis) │  │  (Files)   │  │  (Indexed cols)  │    │
│  │  + OLAP     │  │          │  │            │  │                  │    │
│  └─────────────┘  └──────────┘  └────────────┘  └──────────────────┘    │
│                                                                            │
│  ┌──────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Auth + RBAC  │  │ Zia AutoML │  │   Mail   │  │   Signals +      │  │
│  │ (5 Roles)    │  │ (Training) │  │          │  │   Cron           │  │
│  └──────────────┘  └────────────┘  └──────────┘  └──────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │              Catalyst Pipelines (CI/CD)                      │        │
│  └──────────────────────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Browser (Next.js static on Slate)
       │
       ▼  HTTPS
API Gateway (auth, throttle, route)
       │
       ├──► Functions (Node.js) ──► Data Store (ZCQL)
       │         │                       │
       │         ├──► Stratus (files)    ├──► OLAP (analytics)
       │         ├──► SmartBrowz (PDF)   └──► Search (full-text)
       │         └──► Mail (notify)
       │
       └──► AppSail (Python ML) ──► Data Store (read)
                                        │
                                        └──► Cache (frequent queries)
```

---

## 3. Technology Stack

| Layer | Technology | Catalyst Service | Justification |
|-------|-----------|-----------------|---------------|
| **Frontend** | Next.js 14+ (static export) | **Catalyst Slate** | Static hosting, CDN-cached, fast load. D3/MapLibre bundled client-side |
| **UI Framework** | Tailwind CSS + shadcn/ui | — | Consistent design system, accessible components |
| **Charts** | Recharts (dashboards) + D3.js (advanced) | — | Declarative charts + full programmatic control |
| **Geospatial Maps** | MapLibre GL JS | — | GPU-accelerated heatmaps, clustering, drill-down |
| **Network Graphs** | D3-force / Sigma.js | — | Force-directed node-link for criminal networks |
| **Tables** | TanStack Table | — | Sortable, filterable, paginated data grids |
| **Backend API** | Node.js (Advanced I/O Functions) | **Catalyst Functions** | Serverless, auto-scaling, native Data Store SDK |
| **API Layer** | REST via API Gateway | **Catalyst API Gateway** | Unified endpoints, throttling, auth enforcement |
| **Database** | Relational (ZCQL) | **Catalyst Data Store** + OLAP | Relational for OLTP + OLAP for analytical queries |
| **Auth + RBAC** | 5 roles, hosted login | **Catalyst Authentication** | Built-in user/role management |
| **File Storage** | Object storage (S3-compatible) | **Catalyst Stratus** | Evidence files, FIR scans, photos |
| **Cache** | Key-value | **Catalyst Cache** | Frequent query results, session data |
| **ML Training** | Automated tabular training | **Catalyst Zia AutoML** | Train on historical crime + census data |
| **ML Inference** | Docker container (FastAPI + scikit-learn) | **Catalyst AppSail** (Custom OCI) | Deploy custom Python ML service |
| **PDF Reports** | Headless browser HTML→PDF | **Catalyst SmartBrowz** | Automated intelligence reports |
| **Scheduled Jobs** | Cron-based Functions | **Catalyst Cron** | Nightly anomaly calc, trend alerts |
| **Event Triggers** | Data Store events | **Catalyst Signals** + Event Functions | New case → trigger anomaly detection |
| **Workflow** | Multi-step orchestration | **Catalyst Circuits** | Complex report generation pipelines |
| **CI/CD** | Auto-deploy from GitHub | **Catalyst Pipelines** | Push-to-deploy |
| **Search** | Full-text on indexed columns | **Catalyst Search** | Search across cases, accused, FIR text |
| **Email** | Transactional | **Catalyst Mail** | Notifications, digests, alerts |
| **Text Analytics** | LLM/keyword extraction | **Catalyst Zia Services** | MO description entity extraction |

---

## 4. Feature-to-Catalyst Service Mapping

| # | Requirement | Catalyst Service | Details |
|---|-------------|-----------------|---------|
| 1 | Serverless backend logic | **Functions** (Advanced I/O) | All CRUD, analytics, network endpoints in Node.js |
| 2 | Docker ML deployment | **AppSail** (Custom OCI) | FastAPI + scikit-learn container |
| 3 | Web app managed runtime | **AppSail** (Managed) | Fallback if SSR needed later |
| 4 | Frontend / Next.js / SPA | **Slate** | Next.js static export served via CDN |
| 5 | Custom domain + SSL | **Domain Mappings** | Map `ksp-crime.karnataka.gov.in` |
| 6 | Relational database | **Data Store** | All 26 tables via ZCQL |
| 7 | File evidence storage | **Stratus** | FIR PDFs, photos, scanned documents |
| 8 | Cache | **Cache** | Frequent queries, session data |
| 9 | Full-text search | **Search** (on Data Store) | Indexed columns for case/accused search |
| 10 | Text LLMs / RAG | **QuickML** | Future: crime report summarization |
| 11 | No-code ML pipelines | **QuickML** | Future: automated pipelines |
| 12 | Automated ML training | **Zia AutoML** | Risk score model training |
| 13 | OCR / Face / Text Analytics | **Zia Services** | FIR digitization, MO text analysis |
| 14 | PDF report generation | **SmartBrowz** | Intelligence reports, case summaries |
| 15 | User auth / RBAC | **Authentication** | 5 roles with scoped access |
| 16 | API routing + throttling | **API Gateway** | Unified API layer |
| 17 | OAuth tokens | **Connections** | Zoho/3rd-party integrations |
| 18 | Scheduled jobs | **Cron** | Nightly ML retraining, trend alerts |
| 19 | Event-driven processing | **Signals** + Event Functions | New case → trigger analysis |
| 20 | Workflow orchestration | **Circuits** | Multi-step report pipeline |
| 21 | Transactional email | **Mail** | Alerts, digests, notifications |
| 22 | Push notifications | **Push Notifications** | Mobile alerts for investigators |
| 23 | CI/CD | **Pipelines** | Auto-deploy on git push |

---

## 5. Project Structure

```
pravaah/
│
├── PLANNING_DOCUMENT.md              # This file
│
├── catalyst/                         # Catalyst CLI project root
│   ├── client/                       # Frontend source (Next.js)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/        # Main dashboard pages
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── maps/             # Geospatial pages
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── network/          # Link analysis pages
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── cases/            # Case detail pages
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── reports/          # Intelligence reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── login/            # Auth pages
│   │   │   │   ├── layout.tsx        # Root layout with sidebar
│   │   │   │   └── page.tsx          # Landing/redirect
│   │   │   ├── components/
│   │   │   │   ├── charts/           # Recharts wrappers
│   │   │   │   │   ├── TrendChart.tsx
│   │   │   │   │   ├── DistrictComparison.tsx
│   │   │   │   │   ├── CrimeCategoryBreakdown.tsx
│   │   │   │   │   └── RiskScoreChart.tsx
│   │   │   │   ├── maps/             # MapLibre components
│   │   │   │   │   ├── CrimeHeatMap.tsx
│   │   │   │   │   ├── DistrictDrillDown.tsx
│   │   │   │   │   ├── HotspotLayer.tsx
│   │   │   │   │   └── StationMarkers.tsx
│   │   │   │   ├── network/          # D3-force network graph
│   │   │   │   │   ├── NetworkGraph.tsx
│   │   │   │   │   ├── NodeDetails.tsx
│   │   │   │   │   └── AssociationTable.tsx
│   │   │   │   ├── alerts/           # Trend alert indicators
│   │   │   │   │   └── TrendAlertBadge.tsx
│   │   │   │   ├── layout/           # Layout components
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   └── RoleGuard.tsx
│   │   │   │   └── ui/               # shadcn/ui primitives
│   │   │   ├── lib/
│   │   │   │   ├── catalyst.ts       # Catalyst SDK + API client
│   │   │   │   ├── ml-client.ts      # FastAPI client
│   │   │   │   ├── auth.ts           # Auth helpers
│   │   │   │   └── utils.ts          # Shared utilities
│   │   │   ├── hooks/
│   │   │   │   ├── useCases.ts
│   │   │   │   ├── useAnalytics.ts
│   │   │   │   ├── useNetwork.ts
│   │   │   │   └── useMaps.ts
│   │   │   └── types/
│   │   │       ├── case.ts
│   │   │       ├── analytics.ts
│   │   │       ├── network.ts
│   │   │       └── common.ts
│   │   ├── public/
│   │   │   ├── map-styles/           # MapLibre style files
│   │   │   └── icons/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── functions/                    # Catalyst Functions (Node.js)
│   │   ├── cases-api/                # Case CRUD operations
│   │   │   ├── index.js
│   │   │   ├── create.js
│   │   │   ├── read.js
│   │   │   ├── update.js
│   │   │   ├── delete.js
│   │   │   ├── search.js
│   │   │   └── catalyst-config.json
│   │   ├── analytics-api/            # Aggregation & trend endpoints
│   │   │   ├── index.js
│   │   │   ├── trends.js
│   │   │   ├── hotspots.js
│   │   │   ├── district-stats.js
│   │   │   └── catalyst-config.json
│   │   ├── network-api/              # Link analysis queries
│   │   │   ├── index.js
│   │   │   ├── associations.js
│   │   │   ├── repeat-offenders.js
│   │   │   ├── case-connections.js
│   │   │   └── catalyst-config.json
│   │   ├── reports-api/              # SmartBrowz report triggers
│   │   │   ├── index.js
│   │   │   ├── generate-pdf.js
│   │   │   └── catalyst-config.json
│   │   ├── event-anomaly/            # Event Function: anomaly detection
│   │   │   ├── index.js
│   │   │   └── catalyst-config.json
│   │   ├── cron-trends/              # Cron Function: nightly alerts
│   │   │   ├── index.js
│   │   │   └── catalyst-config.json
│   │   └── common/                   # Shared function utilities
│   │       ├── db.js                 # Data Store client wrapper
│   │       ├── cache.js              # Cache helpers
│   │       └── validators.js
│   │
│   ├── appsail/                      # AppSail custom runtime
│   │   └── ml-service/              # Python FastAPI ML service
│   │       ├── app/
│   │       │   ├── __init__.py
│   │       │   ├── main.py           # FastAPI app entry
│   │       │   ├── api/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── predict.py    # /predict/risk-score
│   │       │   │   ├── detect.py     # /detect/anomalies
│   │       │   │   ├── correlate.py  # /correlate/socioeconomic
│   │       │   │   └── health.py     # /health
│   │       │   ├── models/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── risk_model.py     # Random Forest
│   │       │   │   ├── anomaly_model.py  # Isolation Forest
│   │       │   │   └── correlation.py    # Regression + PCA
│   │       │   ├── services/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── feature_engineer.py
│   │       │   │   └── data_loader.py
│   │       │   └── schemas/
│   │       │       ├── __init__.py
│   │       │       └── requests.py
│   │       ├── trained_models/       # Serialized .pkl files
│   │       │   └── .gitkeep
│   │       ├── notebooks/            # Jupyter exploration
│   │       │   └── eda.ipynb
│   │       ├── Dockerfile
│   │       ├── requirements.txt
│   │       └── catalyst-config.json
│   │
│   ├── catalyst-config.json          # Root Catalyst configuration
│   │
│   └── pipelines/                    # Catalyst Pipelines CI/CD
│       └── deploy.yaml
│
├── database/
│   ├── zcql-schema.sql              # ZCQL DDL for all tables
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_seed_data.sql
│   ├── seeds/
│   │   ├── districts.csv
│   │   ├── police_stations.csv
│   │   ├── sample_cases.csv
│   │   └── socio_economic.csv
│   ├── olap-queries/
│   │   ├── monthly_trends.zcql
│   │   ├── district_comparison.zcql
│   │   └── hotspot_detection.zcql
│   └── indexes.sql                  # Search-enabled columns
│
├── docs/
│   ├── architecture.md
│   ├── api-spec.md
│   └── user-roles.md
│
└── README.md
```

---

## 6. Database Schema

### 6.1 Catalyst Data Store (ZCQL)

All tables from the KSP ERD are implemented in Catalyst Data Store using ZCQL. Below is the complete table list organized by domain.

#### Core Case Tables

| Table | Description | Key Columns | Relationships |
|-------|-------------|-------------|--------------|
| **CaseMaster** | Primary FIR/case record | CaseMasterID (PK), CrimeNo, CaseNo, CrimeRegisteredDate, IncidentFromDate, IncidentToDate, InfoReceivedPSDate, latitude, longitude, BriefFacts | FK→Employee, FK→Unit, FK→CaseCategory, FK→GravityOffence, FK→CrimeHead, FK→CrimeSubHead, FK→CaseStatus, FK→Court |
| **ComplainantDetails** | Complainant information | ComplainantID (PK), CaseMasterID (FK), ComplainantName, AgeYear | FK→OccupationMaster, FK→ReligionMaster, FK→CasteMaster |
| **Victim** | Victim information | VictimMasterID (PK), CaseMasterID (FK), VictimName, AgeYear, GenderID, VictimPolice | |
| **Accused** | Accused persons | AccusedMasterID (PK), CaseMasterID (FK), AccusedName, AgeYear, GenderID, PersonID | |
| **ArrestSurrender** | Arrest/surrender events | ArrestSurrenderID (PK), CaseMasterID (FK), ArrestSurrenderTypeID, ArrestSurrenderDate | FK→State, FK→District, FK→Unit, FK→Employee, FK→Court, FK→AccusedMaster |
| **ActSectionAssociation** | Act-section mapping per case | CaseMasterID (FK), ActID (FK), SectionID (FK), ActOrderID, SectionOrderID | FK→Act, FK→Section |
| **ChargesheetDetails** | Chargesheet information | CSID (PK), CaseMasterID (FK), csdate, cstype | FK→Employee |

#### Lookup & Reference Tables

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **Act** | Legal acts (IPC, NDPS, etc.) | ActCode (PK), ActDescription, ShortName, Active |
| **Section** | Sections under acts | ActCode (FK), SectionCode, SectionDescription, Active |
| **CrimeHead** | Major crime heads | CrimeHeadID (PK), CrimeGroupName, Active |
| **CrimeSubHead** | Crime sub-heads | CrimeSubHeadID (PK), CrimeHeadID (FK), CrimeHeadName, SeqID |
| **CrimeHeadActSection** | Crime head ↔ act-section mapping | CrimeHeadID (FK), ActCode (FK), SectionCode |
| **CaseCategory** | FIR, UDR, PAR, Zero FIR | CaseCategoryID (PK), LookupValue |
| **GravityOffence** | Heinous, Non-Heinous | GravityOffenceID (PK), LookupValue |
| **CaseStatusMaster** | Case statuses | CaseStatusID (PK), CaseStatusName |
| **Court** | Court information | CourtID (PK), CourtName, DistrictID (FK), StateID (FK), Active |
| **Unit** | Police stations/units | UnitID (PK), UnitName, TypeID (FK), ParentUnit, DistrictID (FK), StateID (FK), Active |
| **UnitType** | Unit type classification | UnitTypeID (PK), UnitTypeName, CityDistState, Hierarchy, Active |
| **Employee** | Police personnel | EmployeeID (PK), DistrictID (FK), UnitID (FK), RankID (FK), DesignationID (FK), KGID, FirstName, EmployeeDOB, GenderID |
| **Rank** | Police ranks | RankID (PK), RankName, Hierarchy, Active |
| **Designation** | Designations | DesignationID (PK), DesignationName, Active, SortOrder |
| **District** | Districts of Karnataka | DistrictID (PK), DistrictName, StateID (FK), Active |
| **State** | States | StateID (PK), StateName, NationalityID, Active |
| **CasteMaster** | Caste reference | caste_master_id (PK), caste_master_name |
| **ReligionMaster** | Religion reference | ReligionID (PK), ReligionName |
| **OccupationMaster** | Occupation reference | OccupationID (PK), OccupationName |

### 6.2 OLAP Database (Analytical Queries)

Catalyst Data Store's OLAP feature is used for analytical queries that scan large datasets:

- **Monthly crime trends** by district, crime head, and case category
- **District comparison** across multiple KPIs
- **Spatiotemporal hotspot detection** by time-of-day + location
- **Repeat offender frequency** across jurisdictions

### 6.3 Search-Enabled Columns

Catalyst Search is configured on these indexed columns:

| Table | Indexed Columns |
|-------|----------------|
| CaseMaster | CrimeNo, CaseNo, BriefFacts |
| Accused | AccusedName |
| Victim | VictimName |
| ComplainantDetails | ComplainantName |
| Unit | UnitName |
| Employee | FirstName, KGID |

---

## 7. RBAC Design

### 7.1 Roles in Catalyst Authentication

| Role | Permissions | Data Scope |
|------|------------|------------|
| **SCRB Admin** | Full access: read/write all cases, all dashboards, all analytics, ML predictions, network analysis, user management | State-wide |
| **District SP** | Read/write own district cases, view district dashboards, access district-level analytics, view ML predictions for own district | Own district |
| **Station SHO** | Read/write own station cases, view station-level dashboards, register new cases, assign investigators | Own police station |
| **Investigator** | Read/update assigned cases, view network analysis for linked cases, view case details | Assigned cases |
| **Analyst (Read-Only)** | View all dashboards, maps, network graphs, reports, ML predictions (no edit on any data) | State-wide (read) |

### 7.2 Access Control Strategy

Catalyst Authentication provides:
- **User management** with custom role assignment
- **Hosted authentication** (login page) or **embedded** (custom UI)
- **Public signup** disabled (admin-provisioned accounts only)
- **Session management** with token-based auth

Data-level access is enforced within **Catalyst Functions** using the authenticated user's role + district/unit metadata from the JWT token. Each Function checks:

1.  User role from the auth context
2.  Data scope (district/station) from the request
3.  Row-level filtering in ZCQL queries based on scope

---

## 8. Implementation Phases

### Phase 1 — Foundation (Days 1-3)

**Objective:** Scaffold the entire project on Catalyst, create database tables, set up auth, and deploy a basic shell.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 1.1 | Initialize Catalyst project via CLI | Catalyst CLI |
| 1.2 | Create all 26 tables in Data Store using ZCQL DDL | Data Store |
| 1.3 | Configure Search on indexed columns | Search |
| 1.4 | Set up Catalyst Authentication with 5 roles + admin user | Authentication |
| 1.5 | Scaffold Next.js project with Tailwind + shadcn/ui | — |
| 1.6 | Build layout: sidebar navigation, header with user menu, role-based routing | — |
| 1.7 | Configure API Gateway with initial routes + auth enforcement | API Gateway |
| 1.8 | Set up Catalyst Pipelines for CI/CD | Pipelines |
| 1.9 | Deploy Next.js static export to Catalyst Slate | Slate |
| **Deliverable** | Catalyst project live, database ready, auth working, empty app shell deployed | |

### Phase 2 — Core CRUD (Days 4-5)

**Objective:** Full case management functionality with search and filtering.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 2.1 | Build Functions: Case CRUD (create, read, update, delete, list) | Functions |
| 2.2 | Build Functions: Complainant, Victim, Accused CRUD | Functions |
| 2.3 | Build Functions: Act-section association management | Functions |
| 2.4 | Build Functions: Case search with filters (date, district, crime head, status) | Functions + Search |
| 2.5 | API Gateway: Wire all endpoints with auth + throttling | API Gateway |
| 2.6 | Build case list page with TanStack Table (sort, filter, paginate) | — |
| 2.7 | Build case detail page with all related entities | — |
| 2.8 | Build case registration form (multi-step: details → complainant → victim → accused → sections) | — |
| 2.9 | Seed sample data: 200+ cases across 5 districts, 10 police stations | Data Store |
| **Deliverable** | Full case management: create, read, update, search, filter | |

### Phase 3 — Visualization Suite (Days 6-9)

**Objective:** Interactive dashboards, geospatial maps, and trend alerts.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 3.1 | **Dashboard**: Build summary KPI cards (total cases, by category, by district, clearance rate) | Functions (analytics aggregation) |
| 3.2 | **Dashboard**: Crime category breakdown (pie/bar chart via Recharts) | — |
| 3.3 | **Dashboard**: District comparison chart (bar chart via Recharts) | — |
| 3.4 | **Dashboard**: Monthly/quarterly trend line chart with anomaly markers | Functions + Recharts |
| 3.5 | **Map Module**: Initialize MapLibre GL with Karnataka district boundaries | — |
| 3.6 | **Map Module**: Crime heatmap overlay weighted by severity | — |
| 3.7 | **Map Module**: Police station markers with popup stats | — |
| 3.8 | **Map Module**: District drill-down — click district → show station-level data | — |
| 3.9 | **Spatiotemporal**: Time-of-day + location layered heatmap with filter controls | — |
| 3.10 | **Trend Alerts**: Build alert detection logic in Functions (2σ deviation from historical mean) | Functions |
| 3.11 | **Trend Alerts**: Red-zone pulsing indicator component | — |
| 3.12 | OLAP queries configured for fast aggregation | Data Store OLAP |
| **Deliverable** | Interactive dashboard with KPIs, maps with heatmap + drill-down, trend alerts | |

### Phase 4 — Network & Link Analysis (Days 10-11)

**Objective:** Node-based visualization connecting suspects, victims, cases, and locations.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 4.1 | Build Functions: Network queries — get all connections for a suspect/victim/case | Functions |
| 4.2 | Build Functions: Repeat offender query — find all cases linked to same accused across stations | Functions |
| 4.3 | Build Functions: Hidden association detection — co-accused in different cases, shared locations | Functions |
| 4.4 | Build D3-force network graph component | — |
| 4.5 | Implement node types (suspect, victim, case, location) with distinct colors | — |
| 4.6 | Implement edge types (involved-in, associated-with, occurred-at) with distinct strokes | — |
| 4.7 | Add interactivity: hover for details, click to expand, drag nodes, zoom/pan | — |
| 4.8 | Build search bar: type a name → highlight node + 1st/2nd-degree connections | — |
| 4.9 | Build repeat offender profile panel: all linked cases, MO description, timeline | — |
| 4.10 | Build association table: sortable grid of connections | — |
| **Deliverable** | Interactive network graph with search, repeat offender profiles, association detection | |

### Phase 5 — ML Intelligence (Days 12-15)

**Objective:** AI-driven predictions, anomaly detection, and socio-economic correlation.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 5.1 | **Data Prep**: Build feature engineering pipeline (historical crime → training features) | AppSail (Python) |
| 5.2 | **AutoML**: Upload historical crime + census data to Zia AutoML, train risk scoring model | Zia AutoML |
| 5.3 | **AutoML**: Evaluate model, export trained model | Zia AutoML |
| 5.4 | **AppSail**: Dockerize FastAPI app with scikit-learn | AppSail |
| 5.5 | **AppSail**: Deploy `/predict/risk-score` endpoint | AppSail |
| 5.6 | **AppSail**: Deploy `/detect/anomalies` endpoint (Isolation Forest) | AppSail |
| 5.7 | **AppSail**: Deploy `/correlate/socioeconomic` endpoint (regression + PCA) | AppSail |
| 5.8 | **Event Function**: Trigger anomaly detection when new case is created | Signals + Event Functions |
| 5.9 | **Cron Function**: Nightly risk score recalculation + trend alert generation | Cron |
| 5.10 | Risk score heatmap layer on MapLibre (choropleth by district) | — |
| 5.11 | Anomaly call-out cards on dashboard | — |
| 5.12 | Socio-economic correlation charts (scatter plot, regression line) | — |
| **Deliverable** | Predictive risk scores, anomaly flags, socio-economic correlation visualizations | |

### Phase 6 — Intelligence Reports & Alerts (Days 16-17)

**Objective:** Automated PDF reports, scheduled digests, and notification system.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 6.1 | Build HTML report templates for district intelligence summaries | — |
| 6.2 | Build SmartBrowz Function to convert HTML → PDF | SmartBrowz |
| 6.3 | Build Circuits workflow: generate report → store in Stratus → email link | Circuits |
| 6.4 | Build Cron: weekly district report generation | Cron |
| 6.5 | Build Mail integration for report delivery | Mail |
| 6.6 | Build trend alert notification system (email for SP-level alerts) | Mail |
| 6.7 | Build drill-down navigation: State → District → Station → Case | — |
| 6.8 | Build export functionality (CSV, PDF for individual case reports) | SmartBrowz |
| **Deliverable** | Automated PDF reports, scheduled email digests, alert notifications | |

### Phase 7 — Production Readiness (Week 18)

**Objective:** Security hardening, performance optimization, and deployment.

| Task | Details | Catalyst Service |
|------|---------|-----------------|
| 7.1 | Security audit: API Gateway throttling rules, Function Security Rules, data validation | API Gateway |
| 7.2 | Load testing: 10K+ records, concurrent users | — |
| 7.3 | Cache configuration for frequent queries | Cache |
| 7.4 | Domain mapping for production URL | Domain Mappings |
| 7.5 | Pipelines finalization: staging → production deploy | Pipelines |
| 7.6 | User acceptance testing with SCRB team | — |
| 7.7 | Documentation handover | — |
| **Deliverable** | Production-ready platform deployed on Catalyst | |

---

## 9. ML Model Strategy

### 9.1 Model Inventory

| Model | Purpose | Algorithm | Training Data | Frequency | Service |
|-------|---------|-----------|---------------|-----------|---------|
| **Crime Risk Score** | Predict district-level risk next quarter | Random Forest Regressor | Historical cases (3yr) + census (population, literacy, urbanization) | Monthly retraining | Zia AutoML → AppSail inference |
| **Anomaly Detection** | Flag unusual cases (MO, location, time) | Isolation Forest | All historical case features | Real-time on new case | AppSail |
| **Socio-Economic Correlation** | Identify drivers behind crime patterns | Linear Regression + PCA | Case data + per-district census indicators | Quarterly | AppSail |
| **Repeat Offender Matching** | Link same accused across name variations | Fuzzy matching (Levenshtein) + clustering | Accused name, age, location across cases | On-demand | AppSail |
| **Hotspot Prediction** | Predict next-period hotspot zones | ST-DBSCAN + time-series | Spatiotemporal case data | Weekly | AppSail |

### 9.2 Training Pipeline (Zia AutoML)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Historical  │───►│  Zia AutoML  │───►│  Trained     │
│  Case Data   │    │  Upload CSV  │    │  Model (.pkl)│
│  + Census    │    │  Configure   │    │  Download    │
└──────────────┘    │  Target Col  │    └──────┬───────┘
                    │  Train/Test  │           │
                    └──────────────┘           ▼
                                       ┌──────────────┐
                                       │  AppSail     │
                                       │  FastAPI     │
                                       │  Load model  │
                                       │  Serve API   │
                                       └──────────────┘
```

### 9.3 Feature Engineering Pipeline (Python/AppSail)

**Input features for risk scoring:**

- `cases_last_quarter` — total cases in district
- `crime_rate_per_100k` — normalized by population
- `population_density` — from census
- `urbanization_index` — % urban population
- `literacy_rate` — district literacy %
- `avg_response_time` — police response time
- `repeat_offender_ratio` — % cases with repeat offenders
- `seasonality_factor` — month-of-year encoding
- `district_id_encoded` — categorical encoding

---

## 10. Key Visualization Components

| Feature | Library | Description | Interactions |
|---------|---------|-------------|-------------|
| **District Crime Heatmap** | MapLibre GL | Weighted heatmap overlay on district polygons | Filter by crime type, date range, severity |
| **Spatiotemporal Clusters** | MapLibre GL | Hexbin aggregation by time + location | Time slider, crime type selector |
| **Police Station Map** | MapLibre GL | Markers with popup stats | Click → station detail sidebar |
| **District Drill-Down** | MapLibre GL | Click district → zoom to station-level | Breadcrumb navigation |
| **Trend Line Chart** | Recharts | Monthly crime counts with anomaly markers | Hover for details, click to filter |
| **Category Breakdown** | Recharts | Pie/bar chart of crime categories | Click to drill into sub-heads |
| **District Comparison** | Recharts | Grouped bar chart across districts | Toggle metrics |
| **Risk Score Choropleth** | MapLibre GL | District fill color by predicted risk | Legend, hover tooltip |
| **Network Graph** | D3-force | Force-directed node-link diagram | Drag, zoom, hover, click, search |
| **Repeat Offender Timeline** | Recharts + custom | Horizontal timeline of linked cases | Click case → navigate to detail |
| **Socio-Economic Scatter** | Recharts | Scatter plot: indicator vs. crime rate | Brush to select region |

---

## 11. API Design

### 11.1 API Gateway Routes

| Method | Endpoint | Description | Auth Required | Role Scope |
|--------|----------|-------------|---------------|------------|
| **Cases** | | | | |
| GET | `/api/cases` | List cases (paginated, filterable) | Yes | Station/District/State |
| GET | `/api/cases/:id` | Get case detail with all relations | Yes | Station/District/State |
| POST | `/api/cases` | Create new case | Yes | SHO, Investigator |
| PUT | `/api/cases/:id` | Update case | Yes | SHO, Investigator |
| DELETE | `/api/cases/:id` | Delete case (soft) | Yes | SCRB Admin |
| GET | `/api/cases/search` | Full-text search across cases | Yes | All |
| **Victims** | | | | |
| GET | `/api/cases/:id/victims` | List victims for a case | Yes | Station/District/State |
| POST | `/api/cases/:id/victims` | Add victim | Yes | SHO, Investigator |
| **Accused** | | | | |
| GET | `/api/cases/:id/accused` | List accused for a case | Yes | Station/District/State |
| POST | `/api/cases/:id/accused` | Add accused | Yes | SHO, Investigator |
| **Network** | | | | |
| GET | `/api/network/connections/:entityId` | Get all connections for entity | Yes | All |
| GET | `/api/network/repeat-offenders` | List repeat offenders with stats | Yes | All |
| GET | `/api/network/associations` | Hidden association detection | Yes | SCRB Admin, Analyst |
| **Analytics** | | | | |
| GET | `/api/analytics/dashboard` | Dashboard KPIs | Yes | All (scoped) |
| GET | `/api/analytics/trends` | Trend data (monthly/quarterly) | Yes | All (scoped) |
| GET | `/api/analytics/hotspots` | Spatiotemporal hotspot data | Yes | All |
| GET | `/api/analytics/district/:id` | District-level stats | Yes | All (scoped) |
| **ML** | | | | |
| GET | `/api/ml/risk-score/:districtId` | Risk score for district | Yes | All |
| GET | `/api/ml/anomalies` | Recent anomaly flags | Yes | All |
| GET | `/api/ml/correlate` | Socio-economic correlation data | Yes | SCRB Admin, Analyst |
| **Reports** | | | | |
| POST | `/api/reports/generate` | Trigger report generation | Yes | SCRB Admin, District SP |
| GET | `/api/reports/:id/download` | Download generated PDF | Yes | SCRB Admin, District SP |

### 11.2 Response Format

All API responses follow a consistent envelope:

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 50,
    "total": 1247,
    "timestamp": "2026-07-12T10:30:00Z"
  }
}
```

Error responses:

```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Insufficient permissions for this resource"
  }
}
```

---

## Appendix A: Database Relationship Matrix

| Parent Table | Child Table | Cardinality | Key |
|-------------|------------|-------------|-----|
| CaseMaster | Victim | 1:N | CaseMasterID |
| CaseMaster | Accused | 1:N | CaseMasterID |
| CaseMaster | ArrestSurrender | 1:N | CaseMasterID |
| CaseMaster | ComplainantDetails | 1:N | CaseMasterID |
| CaseMaster | ActSectionAssociation | 1:N | CaseMasterID |
| CaseMaster | ChargesheetDetails | 1:1 | CaseMasterID |
| CaseCategory | CaseMaster | 1:N | CaseCategoryID |
| GravityOffence | CaseMaster | 1:N | GravityOffenceID |
| CrimeHead | CaseMaster | 1:N | CrimeMajorHeadID |
| CrimeSubHead | CaseMaster | 1:N | CrimeMinorHeadID |
| CaseStatusMaster | CaseMaster | 1:N | CaseStatusID |
| Court | CaseMaster | 1:N | CourtID |
| Employee | CaseMaster | 1:N | PolicePersonID |
| Employee | ArrestSurrender | 1:N | IOID |
| State | ArrestSurrender | 1:N | ArrestSurrenderStateId |
| District | ArrestSurrender | 1:N | ArrestSurrenderDistrictId |
| Accused | ArrestSurrender | 1:N | AccusedMasterID |
| OccupationMaster | ComplainantDetails | 1:N | OccupationID |
| ReligionMaster | ComplainantDetails | 1:N | ReligionID |
| CasteMaster | ComplainantDetails | 1:N | caste_master_id |
| Act | ActSectionAssociation | 1:N | ActCode |
| Section | ActSectionAssociation | 1:N | SectionCode |
| Act | Section | 1:N | ActCode |
| CrimeHead | CrimeSubHead | 1:N | CrimeHeadID |
| CrimeHead | CrimeHeadActSection | 1:N | CrimeHeadID |
| Act | CrimeHeadActSection | 1:N | ActCode |
| UnitType | Unit | 1:N | UnitTypeID |
| State | Unit | 1:N | StateID |
| District | Unit | 1:N | DistrictID |
| State | District | 1:N | StateID |
| District | Court | 1:N | DistrictID |
| District | Employee | 1:N | DistrictID |
| Unit | Employee | 1:N | UnitID |
| Rank | Employee | 1:N | RankID |
| Designation | Employee | 1:N | DesignationID |

## Appendix B: Dependencies & Prerequisites

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Node.js | ≥ 18 | Catalyst Functions (Node.js), Next.js build |
| Python | ≥ 3.11 | FastAPI ML service |
| Catalyst CLI | Latest | Local development, deploy |
| Zoho Catalyst Account | — | Project console access |
| Git | ≥ 2.30 | Version control |
| Docker | ≥ 24 | AppSail container build (optional local test) |
| Census Data | District-level | Socio-economic correlation (Karnataka state profile) |

## Appendix C: Key Metrics & Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | < 3s | Lighthouse / browser timing |
| Map render time (10K points) | < 2s | MapLibre performance |
| API response time (p95) | < 500ms | Catalyst APM |
| Network graph (500 nodes) | < 3s render | D3-force simulation time |
| ML prediction latency | < 1s | FastAPI metrics |
| Data freshness (analytics) | < 24h | OLAP sync interval |
| Search response time | < 200ms | Catalyst Search metrics |
| Uptime | 99.9% | Catalyst SLA |
