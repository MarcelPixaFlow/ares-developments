const STORAGE_KEY = "ares.dashboard.key";

function readConfiguredPassword(): string {
  const value = import.meta.env["VITE_DASHBOARD_PASSWORD"];
  return typeof value === "string" && value.length > 0 ? value : "ares-admin";
}

export const DASHBOARD_PASSWORD = readConfiguredPassword();

export function readDashboardKey(): string | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value && value === DASHBOARD_PASSWORD ? value : null;
  } catch {
    return null;
  }
}

export function saveDashboardKey(password: string): boolean {
  if (password !== DASHBOARD_PASSWORD) return false;
  try {
    sessionStorage.setItem(STORAGE_KEY, password);
  } catch {
    return true;
  }
  return true;
}

export function clearDashboardKey(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

export function authHeaders(key: string): HeadersInit {
  return { "X-Ares-Key": key };
}
