-- Search-Enabled Indexes for Catalyst Search
-- These columns are indexed for full-text search across the platform

CREATE INDEX idx_casemaster_crimeno ON CaseMaster (CrimeNo);
CREATE INDEX idx_casemaster_caseno ON CaseMaster (CaseNo);
CREATE INDEX idx_casemaster_brieffacts ON CaseMaster (BriefFacts);
CREATE INDEX idx_accused_name ON Accused (AccusedName);
CREATE INDEX idx_victim_name ON Victim (VictimName);
CREATE INDEX idx_complainant_name ON ComplainantDetails (ComplainantName);
CREATE INDEX idx_unit_name ON Unit (UnitName);
CREATE INDEX idx_employee_name ON Employee (FirstName);
CREATE INDEX idx_employee_kgid ON Employee (KGID);
