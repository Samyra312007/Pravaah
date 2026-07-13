export interface CaseMaster {
  CaseMasterID: number;
  CrimeNo?: string;
  CaseNo?: string;
  CrimeRegisteredDate?: string;
  IncidentFromDate?: string;
  IncidentToDate?: string;
  InfoReceivedPSDate?: string;
  latitude?: number;
  longitude?: number;
  BriefFacts?: string;
  PolicePersonID?: number;
  UnitID?: number;
  CaseCategoryID?: number;
  GravityOffenceID?: number;
  CrimeMajorHeadID?: number;
  CrimeMinorHeadID?: number;
  CaseStatusID?: number;
  CourtID?: number;
}

export interface Complainant {
  ComplainantID: number;
  CaseMasterID: number;
  ComplainantName: string;
  AgeYear?: number;
  OccupationID?: number;
  ReligionID?: number;
  caste_master_id?: number;
}

export interface Victim {
  VictimMasterID: number;
  CaseMasterID: number;
  VictimName: string;
  AgeYear?: number;
  GenderID?: number;
  VictimPolice?: string;
}

export interface Accused {
  AccusedMasterID: number;
  CaseMasterID: number;
  AccusedName: string;
  AgeYear?: number;
  GenderID?: number;
  PersonID?: number;
}

export interface ActSectionAssociation {
  CaseMasterID: number;
  ActID: number;
  SectionID: string;
  ActOrderID?: number;
  SectionOrderID?: number;
}

export interface ArrestSurrender {
  ArrestSurrenderID: number;
  CaseMasterID: number;
  ArrestSurrenderTypeID?: number;
  ArrestSurrenderDate?: string;
  ArrestSurrenderStateId?: number;
  ArrestSurrenderDistrictId?: number;
  UnitID?: number;
  IOID?: number;
  CourtID?: number;
  AccusedMasterID?: number;
}

export interface Chargesheet {
  CSID: number;
  CaseMasterID: number;
  csdate?: string;
  cstype?: string;
  IOID?: number;
}

export interface ReferenceInfo {
  district?: { DistrictID: number; DistrictName: string };
  unit?: { UnitID: number; UnitName: string };
  status?: { CaseStatusID: number; CaseStatusName: string };
  crimeHead?: { CrimeHeadID: number; CrimeGroupName: string };
  gravity?: { GravityOffenceID: number; LookupValue: string };
  category?: { CaseCategoryID: number; LookupValue: string };
}

export interface CaseDetail {
  master: CaseMaster;
  complainants: Complainant[];
  victims: Victim[];
  accused: Accused[];
  actSections: ActSectionAssociation[];
  arrests: ArrestSurrender[];
  chargesheet?: Chargesheet;
  references?: ReferenceInfo;
}

export interface CaseListItem {
  CaseMasterID: number;
  CrimeNo: string;
  CaseNo: string;
  CrimeRegisteredDate: string;
  CrimeGroupName: string;
  DistrictName: string;
  UnitName: string;
  CaseStatusName: string;
  GravityOffence: string;
}
