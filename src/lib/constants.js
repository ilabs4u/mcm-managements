// App-wide constants — no hardcoded strings anywhere else in the codebase.

export const ROLES = {
  OWNER: 'owner',
  FRANCHISE_MANAGER: 'franchise_manager',
};

export const FRANCHISE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PENDING: '/pending',
  OWNER: {
    DASHBOARD: '/owner',
    FRANCHISES: '/owner/franchises',
    APPROVALS: '/owner/approvals',
    RECIPES: '/owner/recipes',
    REPORTS: '/owner/reports',
  },
  FRANCHISE: {
    TODAY: '/franchise',
    HISTORY: '/franchise/history',
  },
};

// API route prefixes
export const API = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  FRANCHISE: {
    TODAY: '/api/franchise/today',
    ENTRIES: '/api/franchise/entries',
    TOGGLE_OPEN: '/api/franchise/toggle-open',
    HISTORY: '/api/franchise/history',
  },
  OWNER: {
    DASHBOARD: '/api/owner/dashboard',
    FRANCHISES: '/api/owner/franchises',
    REPORTS: '/api/owner/reports',
  },
  PRODUCTS: '/api/products',
  INGREDIENTS: '/api/ingredients',
};
