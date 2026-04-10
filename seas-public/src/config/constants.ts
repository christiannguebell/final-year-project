export const STORAGE_KEYS = {
  TOKEN: 'seas_token',
  REFRESH_TOKEN: 'seas_refresh_token',
  USER: 'seas_user',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const API_TIMEOUT = 30000;

export default { STORAGE_KEYS, PAGINATION, API_TIMEOUT };