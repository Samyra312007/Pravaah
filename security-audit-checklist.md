# Security Audit Checklist — KSP Crime Intelligence Platform

## 1. API Gateway Security
- [x] Authentication required on all endpoints (JWT bearer token)
- [x] Role-based access control enforced per endpoint
- [x] Request throttling configured (global: 1000/min, per-endpoint limits)
- [x] CORS restricted to production domains
- [x] Security headers enforced (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- [x] JWT token expiry: 1 hour / refresh: 24 hours
- [x] Max body size: 5MB

## 2. Function Security
- [x] All Functions validate auth token via middleware
- [x] Role hierarchy enforced (SCRB_ADMIN > DISTRICT_SP > STATION_SHO > INVESTIGATOR > ANALYST)
- [x] Data-scope checks: Station SHO restricted to own station
- [x] Input sanitization (strip HTML tags from string inputs)
- [x] SQL injection prevention via parameterized ZCQL queries
- [x] Data validation on all CRUD operations

## 3. Data Security
- [x] Sensitive data access logged
- [x] Row-level filtering based on user role/district
- [x] Cache TTL configured (5 min default, 12h for nightly data)
- [x] Data Store encryption at rest (Catalyst managed)
- [x] Stratus file access controlled via signed URLs

## 4. Frontend Security
- [x] Auth tokens stored in localStorage with HttpOnly-equivalent pattern
- [x] RoleGuard component prevents unauthorized page access
- [x] API client automatically attaches Bearer token
- [x] Content Security Policy restricts resource loading
- [x] No inline secrets or API keys in client code
- [x] Environment variables for API URLs

## 5. ML Service Security
- [x] AppSail container runs with restricted permissions
- [x] ML API endpoints require auth token
- [x] Input validation on prediction endpoints
- [x] Rate limiting on ML inference endpoints

## 6. Infrastructure Security
- [x] HTTPS enforced (Catalyst managed SSL)
- [x] Domain mapped to `ksp-crime.karnataka.gov.in`
- [x] Staging environment isolated from production
- [x] CI/CD pipeline with approval gate for production
- [x] Secrets managed via environment variables (not in code)

## 7. Audit & Monitoring
- [ ] Centralized logging configured
- [ ] API access logs retained for 90 days
- [ ] Failed auth attempts logged
- [ ] Anomaly detection alerts for suspicious access patterns
- [ ] Regular security review schedule established

## 8. Penetration Testing (Post-Deployment)
- [ ] OWASP Top 10 scan
- [ ] JWT token manipulation tests
- [ ] SQL injection attempts
- [ ] XSS injection tests
- [ ] Rate limit bypass attempts
- [ ] Privilege escalation tests

---
*Last updated: 14 Jul 2026*
*Audited by: KSP SCRB Team*
