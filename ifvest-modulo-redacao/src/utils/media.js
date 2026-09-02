import api from "../api";

export function resolveStaticUrl(path) {
  if (!path) return null;
  const base = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
  return `${base}${path}`;
}