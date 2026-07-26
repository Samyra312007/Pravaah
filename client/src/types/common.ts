export type Role = "SCRB_ADMIN" | "DISTRICT_SP" | "STATION_SHO" | "INVESTIGATOR" | "ANALYST";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  districtId?: number;
  unitId?: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page: number;
    perPage: number;
    total: number;
    timestamp: string;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  dateFrom?: string;
  dateTo?: string;
  districtId?: number;
  unitId?: number;
  crimeHeadId?: number;
  caseStatusId?: number;
  searchQuery?: string;
}
