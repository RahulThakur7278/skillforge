/**
 * API Service
 *
 * Centralized API client for all backend calls.
 * Uses the Vite proxy in development (/api → localhost:3001).
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new ApiError(
      data.error?.message || `Request failed (${response.status})`,
      response.status,
      data
    );
  }

  return data;
}

/* ---- Skills ---- */
export const skillsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/skills${qs ? `?${qs}` : ''}`);
  },
  get: (name) => request(`/skills/${encodeURIComponent(name)}`),
  categories: () => request('/skills/categories'),
  path: (from, to) => request(`/skills/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  influence: (limit) => request(`/skills/influence${limit ? `?limit=${limit}` : ''}`),
  bridges: () => request('/skills/bridges'),
  complementary: (name) => request(`/skills/${encodeURIComponent(name)}/complementary`),
};

/* ---- Roles ---- */
export const rolesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/roles${qs ? `?${qs}` : ''}`);
  },
  get: (title) => request(`/roles/${encodeURIComponent(title)}`),
  careerPaths: (role) => request(`/roles/career-paths?role=${encodeURIComponent(role)}`),
  levels: () => request('/roles/levels'),
};

/* ---- Graph ---- */
export const graphApi = {
  network: (limit) => request(`/graph/network${limit ? `?limit=${limit}` : ''}`),
  neighborhood: (type, name, depth = 2) =>
    request(`/graph/neighborhood/${type}/${encodeURIComponent(name)}?depth=${depth}`),
  skillGap: (currentSkills, targetRole) =>
    request('/graph/skill-gap', {
      method: 'POST',
      body: JSON.stringify({ currentSkills, targetRole }),
    }),
  skillPathGraph: (from, to) =>
    request(`/graph/skill-path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  similar: (name, limit) =>
    request(`/graph/similar/${encodeURIComponent(name)}${limit ? `?limit=${limit}` : ''}`),
};

/* ---- Analytics ---- */
export const analyticsApi = {
  dashboard: () => request('/analytics/dashboard'),
  domains: () => request('/analytics/domains'),
};

/* ---- Health ---- */
export const healthApi = {
  check: () => request('/health'),
};
