-- ============================================================
-- KSP Crime Intelligence Platform — ZCQL DDL Schema
-- Catalyst Data Store (Relational)
-- 26 tables organized by domain
-- ============================================================

-- ------------------------------------------------------------
-- 1. LOOKUP & REFERENCE TABLES
-- ------------------------------------------------------------

CREATE TABLE State (
    StateID INT PRIMARY KEY AUTO_INCREMENT,
    StateName VARCHAR(100) NOT NULL,
    NationalityID INT,
    Active BOOLEAN DEFAULT TRUE
);

CREATE TABLE District (
    DistrictID INT PRIMARY KEY AUTO_INCREMENT,
    DistrictName VARCHAR(100) NOT NULL,
    StateID INT NOT NULL,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

CREATE TABLE UnitType (
    UnitTypeID INT PRIMARY KEY AUTO_INCREMENT,
    UnitTypeName VARCHAR(100) NOT NULL,
    CityDistState VARCHAR(50),
    Hierarchy INT,
    Active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Unit (
    UnitID INT PRIMARY KEY AUTO_INCREMENT,
    UnitName VARCHAR(200) NOT NULL,
    TypeID INT,
    ParentUnit INT,
    DistrictID INT NOT NULL,
    StateID INT NOT NULL,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (TypeID) REFERENCES UnitType(UnitTypeID),
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

CREATE TABLE Rank (
    RankID INT PRIMARY KEY AUTO_INCREMENT,
    RankName VARCHAR(100) NOT NULL,
    Hierarchy INT,
    Active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY AUTO_INCREMENT,
    DesignationName VARCHAR(100) NOT NULL,
    Active BOOLEAN DEFAULT TRUE,
    SortOrder INT
);

CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    DistrictID INT,
    UnitID INT,
    RankID INT,
    DesignationID INT,
    KGID VARCHAR(50),
    FirstName VARCHAR(100) NOT NULL,
    EmployeeDOB DATE,
    GenderID INT,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (RankID) REFERENCES Rank(RankID),
    FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID)
);

CREATE TABLE CaseCategory (
    CaseCategoryID INT PRIMARY KEY AUTO_INCREMENT,
    LookupValue VARCHAR(100) NOT NULL
);

CREATE TABLE GravityOffence (
    GravityOffenceID INT PRIMARY KEY AUTO_INCREMENT,
    LookupValue VARCHAR(100) NOT NULL
);

CREATE TABLE CaseStatusMaster (
    CaseStatusID INT PRIMARY KEY AUTO_INCREMENT,
    CaseStatusName VARCHAR(100) NOT NULL
);

CREATE TABLE Court (
    CourtID INT PRIMARY KEY AUTO_INCREMENT,
    CourtName VARCHAR(200) NOT NULL,
    DistrictID INT,
    StateID INT,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

CREATE TABLE CrimeHead (
    CrimeHeadID INT PRIMARY KEY AUTO_INCREMENT,
    CrimeGroupName VARCHAR(200) NOT NULL,
    Active BOOLEAN DEFAULT TRUE
);

CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INT PRIMARY KEY AUTO_INCREMENT,
    CrimeHeadID INT NOT NULL,
    CrimeHeadName VARCHAR(200) NOT NULL,
    SeqID INT,
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID)
);

CREATE TABLE Act (
    ActCode INT PRIMARY KEY,
    ActDescription VARCHAR(500) NOT NULL,
    ShortName VARCHAR(100),
    Active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Section (
    ActCode INT NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    SectionDescription VARCHAR(500),
    Active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (ActCode, SectionCode),
    FOREIGN KEY (ActCode) REFERENCES Act(ActCode)
);

CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INT NOT NULL,
    ActCode INT NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode),
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

CREATE TABLE CasteMaster (
    caste_master_id INT PRIMARY KEY AUTO_INCREMENT,
    caste_master_name VARCHAR(100) NOT NULL
);

CREATE TABLE ReligionMaster (
    ReligionID INT PRIMARY KEY AUTO_INCREMENT,
    ReligionName VARCHAR(100) NOT NULL
);

CREATE TABLE OccupationMaster (
    OccupationID INT PRIMARY KEY AUTO_INCREMENT,
    OccupationName VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- 2. CORE CASE TABLES
-- ------------------------------------------------------------

CREATE TABLE CaseMaster (
    CaseMasterID INT PRIMARY KEY AUTO_INCREMENT,
    CrimeNo VARCHAR(50),
    CaseNo VARCHAR(50),
    CrimeRegisteredDate DATE,
    IncidentFromDate DATE,
    IncidentToDate DATE,
    InfoReceivedPSDate DATE,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    BriefFacts TEXT,
    PolicePersonID INT,
    UnitID INT,
    CaseCategoryID INT,
    GravityOffenceID INT,
    CrimeMajorHeadID INT,
    CrimeMinorHeadID INT,
    CaseStatusID INT,
    CourtID INT,
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (CaseCategoryID) REFERENCES CaseCategory(CaseCategoryID),
    FOREIGN KEY (GravityOffenceID) REFERENCES GravityOffence(GravityOffenceID),
    FOREIGN KEY (CrimeMajorHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (CrimeMinorHeadID) REFERENCES CrimeSubHead(CrimeSubHeadID),
    FOREIGN KEY (CaseStatusID) REFERENCES CaseStatusMaster(CaseStatusID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID)
);

CREATE TABLE ComplainantDetails (
    ComplainantID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT NOT NULL,
    ComplainantName VARCHAR(200) NOT NULL,
    AgeYear INT,
    OccupationID INT,
    ReligionID INT,
    caste_master_id INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (OccupationID) REFERENCES OccupationMaster(OccupationID),
    FOREIGN KEY (ReligionID) REFERENCES ReligionMaster(ReligionID),
    FOREIGN KEY (caste_master_id) REFERENCES CasteMaster(caste_master_id)
);

CREATE TABLE Victim (
    VictimMasterID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT NOT NULL,
    VictimName VARCHAR(200) NOT NULL,
    AgeYear INT,
    GenderID INT,
    VictimPolice VARCHAR(100),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE Accused (
    AccusedMasterID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT NOT NULL,
    AccusedName VARCHAR(200) NOT NULL,
    AgeYear INT,
    GenderID INT,
    PersonID INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE ActSectionAssociation (
    CaseMasterID INT NOT NULL,
    ActID INT NOT NULL,
    SectionID VARCHAR(50) NOT NULL,
    ActOrderID INT,
    SectionOrderID INT,
    PRIMARY KEY (CaseMasterID, ActID, SectionID),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ActID) REFERENCES Act(ActCode),
    FOREIGN KEY (ActID, SectionID) REFERENCES Section(ActCode, SectionCode)
);

CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT NOT NULL,
    ArrestSurrenderTypeID INT,
    ArrestSurrenderDate DATE,
    ArrestSurrenderStateId INT,
    ArrestSurrenderDistrictId INT,
    UnitID INT,
    IOID INT,
    CourtID INT,
    AccusedMasterID INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ArrestSurrenderStateId) REFERENCES State(StateID),
    FOREIGN KEY (ArrestSurrenderDistrictId) REFERENCES District(DistrictID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

CREATE TABLE ChargesheetDetails (
    CSID INT PRIMARY KEY AUTO_INCREMENT,
    CaseMasterID INT NOT NULL UNIQUE,
    csdate DATE,
    cstype VARCHAR(100),
    IOID INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID)
);
