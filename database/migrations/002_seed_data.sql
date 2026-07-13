-- Migration 002: Seed Data
-- Populates lookup/reference tables with initial values

-- States
INSERT INTO State (StateID, StateName, NationalityID, Active) VALUES (1, 'Karnataka', 1, TRUE);

-- Districts of Karnataka
INSERT INTO District (DistrictID, DistrictName, StateID, Active) VALUES
(1, 'Bengaluru Urban', 1, TRUE),
(2, 'Bengaluru Rural', 1, TRUE),
(3, 'Mysuru', 1, TRUE),
(4, 'Hubballi-Dharwad', 1, TRUE),
(5, 'Belagavi', 1, TRUE),
(6, 'Ballari', 1, TRUE),
(7, 'Mangaluru', 1, TRUE),
(8, 'Shivamogga', 1, TRUE),
(9, 'Kalaburagi', 1, TRUE),
(10, 'Udupi', 1, TRUE);

-- Unit Types
INSERT INTO UnitType (UnitTypeID, UnitTypeName, CityDistState, Hierarchy, Active) VALUES
(1, 'Police Station', 'City', 1, TRUE),
(2, 'Circle Office', 'City', 2, TRUE),
(3, 'District Office', 'District', 3, TRUE),
(4, 'Range Office', 'State', 4, TRUE),
(5, 'SCRB HQ', 'State', 5, TRUE);

-- Police Stations (Units)
INSERT INTO Unit (UnitID, UnitName, TypeID, ParentUnit, DistrictID, StateID, Active) VALUES
(1, 'Cubbon Park Police Station', 1, NULL, 1, 1, TRUE),
(2, 'Wilson Garden Police Station', 1, NULL, 1, 1, TRUE),
(3, 'Mysuru North Police Station', 1, NULL, 3, 1, TRUE),
(4, 'Hubballi City Police Station', 1, NULL, 4, 1, TRUE),
(5, 'Belagavi Fort Police Station', 1, NULL, 5, 1, TRUE),
(6, 'Ballari Town Police Station', 1, NULL, 6, 1, TRUE),
(7, 'Mangaluru East Police Station', 1, NULL, 7, 1, TRUE),
(8, 'Shivamogga City Police Station', 1, NULL, 8, 1, TRUE),
(9, 'Kalaburagi North Police Station', 1, NULL, 9, 1, TRUE),
(10, 'Udupi Town Police Station', 1, NULL, 10, 1, TRUE);

-- Case Categories
INSERT INTO CaseCategory (CaseCategoryID, LookupValue) VALUES
(1, 'FIR'),
(2, 'UDR'),
(3, 'PAR'),
(4, 'Zero FIR');

-- Gravity of Offence
INSERT INTO GravityOffence (GravityOffenceID, LookupValue) VALUES
(1, 'Heinous'),
(2, 'Non-Heinous');

-- Case Statuses
INSERT INTO CaseStatusMaster (CaseStatusID, CaseStatusName) VALUES
(1, 'Under Investigation'),
(2, 'Chargesheet Filed'),
(3, 'Trial in Progress'),
(4, 'Convicted'),
(5, 'Acquitted'),
(6, 'Closed');

-- Ranks
INSERT INTO Rank (RankID, RankName, Hierarchy, Active) VALUES
(1, 'Constable', 1, TRUE),
(2, 'Head Constable', 2, TRUE),
(3, 'Assistant Sub-Inspector', 3, TRUE),
(4, 'Sub-Inspector', 4, TRUE),
(5, 'Inspector', 5, TRUE),
(6, 'Deputy Superintendent', 6, TRUE),
(7, 'Superintendent', 7, TRUE),
(8, 'Deputy Inspector General', 8, TRUE),
(9, 'Inspector General', 9, TRUE),
(10, 'Director General', 10, TRUE);

-- Designations
INSERT INTO Designation (DesignationID, DesignationName, Active, SortOrder) VALUES
(1, 'SHO', TRUE, 1),
(2, 'Circle Inspector', TRUE, 2),
(3, 'DySP', TRUE, 3),
(4, 'SP', TRUE, 4),
(5, 'IGP', TRUE, 5),
(6, 'Constable', TRUE, 6),
(7, 'Head Constable', TRUE, 7),
(8, 'ASI', TRUE, 8),
(9, 'PSI', TRUE, 9);

-- Crime Heads
INSERT INTO CrimeHead (CrimeHeadID, CrimeGroupName, Active) VALUES
(1, 'Murder', TRUE),
(2, 'Robbery', TRUE),
(3, 'Burglary', TRUE),
(4, 'Assault', TRUE),
(5, 'Fraud', TRUE),
(6, 'Kidnapping', TRUE),
(7, 'Cyber Crime', TRUE),
(8, 'Narcotics', TRUE),
(9, 'Property Crime', TRUE),
(10, 'Crime Against Women', TRUE);
