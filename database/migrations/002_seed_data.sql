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
(10, 'Udupi Town Police Station', 1, NULL, 10, 1, TRUE),
(11, 'Whitefield Police Station', 1, NULL, 1, 1, TRUE),
(12, 'Vijayanagar Police Station', 1, NULL, 1, 1, TRUE);

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

-- Acts
INSERT INTO Act (ActCode, ActDescription, ShortName, Active) VALUES
(1, 'Indian Penal Code', 'IPC', TRUE),
(2, 'Code of Criminal Procedure', 'CrPC', TRUE),
(3, 'Narcotic Drugs and Psychotropic Substances Act', 'NDPS Act', TRUE),
(4, 'Information Technology Act', 'IT Act', TRUE),
(5, 'Arms Act', 'Arms Act', TRUE),
(6, 'Protection of Children from Sexual Offences Act', 'POCSO Act', TRUE);

-- Sections
INSERT INTO Section (ActCode, SectionCode, SectionDescription, Active) VALUES
(1, '302', 'Punishment for murder', TRUE),
(1, '304', 'Punishment for culpable homicide not amounting to murder', TRUE),
(1, '307', 'Attempt to murder', TRUE),
(1, '323', 'Punishment for voluntarily causing hurt', TRUE),
(1, '325', 'Punishment for voluntarily causing grievous hurt', TRUE),
(1, '354', 'Assault or criminal force to woman with intent to outrage her modesty', TRUE),
(1, '363', 'Punishment for kidnapping', TRUE),
(1, '376', 'Punishment for rape', TRUE),
(1, '379', 'Punishment for theft', TRUE),
(1, '392', 'Punishment for robbery', TRUE),
(1, '420', 'Cheating and dishonestly inducing delivery of property', TRUE),
(1, '457', 'Lurking house-trespass or house-breaking by night', TRUE),
(1, '498A', 'Cruelty by husband or relatives', TRUE),
(1, '500', 'Punishment for defamation', TRUE),
(1, '34', 'Acts done by several persons in furtherance of common intention', TRUE),
(2, '125', 'Security for keeping peace in other cases', TRUE),
(2, '144', 'Power to issue order in urgent cases of nuisance', TRUE),
(3, '20', 'Punishment for contravention in relation to cannabis', TRUE),
(3, '21', 'Punishment for contravention in relation to manufactured drugs', TRUE),
(4, '66', 'Computer related offences', TRUE),
(4, '67', 'Publishing obscene material in electronic form', TRUE),
(5, '25', 'License for acquisition and possession of firearms', TRUE),
(5, '27', 'Punishment for using arms', TRUE),
(6, '4', 'Punishment for penetrative sexual assault', TRUE),
(6, '6', 'Punishment for aggravated penetrative sexual assault', TRUE);

-- Employees
INSERT INTO Employee (EmployeeID, DistrictID, UnitID, RankID, DesignationID, KGID, FirstName, GenderID) VALUES
(1, 1, 1, 5, 1, 'KSP/BLR/001', 'Ravi Kumar', 1),
(2, 1, 2, 5, 1, 'KSP/BLR/002', 'Suresh Gowda', 1),
(3, 3, 3, 5, 1, 'KSP/MYS/001', 'Mohan Raj', 1),
(4, 4, 4, 5, 1, 'KSP/HBL/001', 'Basavaraj Patil', 1),
(5, 5, 5, 5, 1, 'KSP/BLG/001', 'Anil Kumar', 1),
(6, 6, 6, 5, 1, 'KSP/BLR-B/001', 'Venkatesh Rao', 1);

-- Courts
INSERT INTO Court (CourtID, CourtName, DistrictID, StateID, Active) VALUES
(1, 'Bengaluru City Civil Court', 1, 1, TRUE),
(2, 'Mysuru District Court', 3, 1, TRUE),
(3, 'Hubballi Sessions Court', 4, 1, TRUE),
(4, 'Belagavi District Court', 5, 1, TRUE),
(5, 'Ballari Sessions Court', 6, 1, TRUE);

-- Phase 2: 200+ sample cases across 5 districts
RUN SCRIPT '../seeds/seed_200_cases.sql';
