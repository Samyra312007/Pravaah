# User Acceptance Testing (UAT) Plan

## Overview
- **Platform:** KSP Crime Intelligence & Analytical Platform
- **Duration:** 5 working days
- **Participants:** SCRB Team, District SPs (representatives), Station SHOs, Investigators, Analysts
- **Environment:** Staging (`https://staging.ksp-crime.karnataka.gov.in`)

## Day 1: Core Case Management

### Test Cases
| ID | Feature | Steps | Expected Result |
|----|---------|-------|-----------------|
| CM-01 | Case List View | Navigate to /cases | Paginated list with filters, search working |
| CM-02 | Case Search | Search by CrimeNo, name, date | Relevant results returned < 2s |
| CM-03 | Case Detail | Click any case | All entities displayed: complainants, victims, accused, sections |
| CM-04 | Create Case | Complete multi-step form | Case created, appears in list |
| CM-05 | Edit Case | Modify case fields | Changes saved and visible |
| CM-06 | Add Victim | Add victim to existing case | Victim appears in list |
| CM-07 | Add Accused | Add accused to existing case | Accused appears in list |
| CM-08 | Act-Section | Add/remove IPC sections | Sections linked/unlinked correctly |

## Day 2: Dashboards & Maps

### Test Cases
| ID | Feature | Steps | Expected Result |
|----|---------|-------|-----------------|
| DB-01 | KPI Cards | Load dashboard | All 7 KPI cards show correct values |
| DB-02 | Trend Chart | Toggle monthly/quarterly | Chart updates correctly |
| DB-03 | Category Breakdown | View pie chart | Crime categories display with percentages |
| DB-04 | District Comparison | View bar chart | All 15 districts displayed |
| DB-05 | Crime Heatmap | Load maps page | Heatmap overlay visible on Karnataka map |
| DB-06 | District Drill-Down | Click district on map | Station-level data shown |
| DB-07 | Spatiotemporal | Switch to spatiotemporal tab | Time-block heatmap renders |

## Day 3: Network Analysis & Reports

### Test Cases
| ID | Feature | Steps | Expected Result |
|----|---------|-------|-----------------|
| NA-01 | Network Graph | Load network page | D3-force graph renders with nodes/edges |
| NA-02 | Node Search | Type suspect name | Node highlighted with connections |
| NA-03 | Node Click | Click a node | Details panel opens |
| NA-04 | Repeat Offenders | Switch to offenders tab | List of repeat offenders with case counts |
| NA-05 | Hidden Associations | Switch to associations tab | Table of cross-case connections |
| RP-01 | Generate Report | Select district, click generate | PDF generated and downloadable |
| RP-02 | Export CSV | Click export CSV | CSV file downloaded |
| RP-03 | Drill-Down Nav | Navigate State→District→Station→Case | Breadcrumb navigation works |

## Day 4: ML Intelligence & Alerts

### Test Cases
| ID | Feature | Steps | Expected Result |
|----|---------|-------|-----------------|
| ML-01 | Risk Scores | View dashboard ML section | District risk choropleth displayed |
| ML-02 | Anomaly Flags | View anomaly cards | Recent anomalies listed with details |
| ML-03 | Socio-Economic | View correlation charts | Scatter plots with regression lines |
| ML-04 | Trend Alerts | Check alert bar | Alerts shown for significant deviations |

## Day 5: RBAC & Edge Cases

### Test Cases
| ID | Feature | Steps | Expected Result |
|----|---------|-------|-----------------|
| RB-01 | SCRB Admin | Full access | All modules, all districts accessible |
| RB-02 | District SP | District scope | Only own district data visible |
| RB-03 | Station SHO | Station scope | Only own station cases visible |
| RB-04 | Analyst | Read-only | No edit/create/delete options |
| RB-05 | Large Dataset | Load 10K records | Pages load < 3s |

## Sign-off Criteria
- [ ] All critical (P0) test cases pass
- [ ] All high (P1) test cases pass (or documented workaround)
- [ ] Performance targets met (API < 500ms, ML < 1s, Pages < 3s)
- [ ] Security audit completed
- [ ] SCRB team approves production deployment
