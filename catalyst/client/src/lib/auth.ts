import type { User, Role } from "@/types/common";

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "current_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasRole(user: User | null, ...roles: Role[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function canAccessResource(
  user: User | null,
  resourceDistrictId?: number,
  resourceUnitId?: number
): boolean {
  if (!user) return false;
  if (user.role === "SCRB_ADMIN" || user.role === "ANALYST") return true;
  if (user.role === "DISTRICT_SP") return user.districtId === resourceDistrictId || !resourceDistrictId;
  if (user.role === "STATION_SHO") return user.unitId === resourceUnitId || !resourceUnitId;
  if (user.role === "INVESTIGATOR") return true;
  return false;
}
