import api from "../api";

export function resolveStaticUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  const base = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
  return `${base}${path}`;
}