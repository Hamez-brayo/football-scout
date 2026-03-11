/**
 * API Constants
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_UP: '/api/auth/signup',
    SIGN_IN: '/api/auth/signin',
    SIGN_OUT: '/api/auth/signout',
    VERIFY_TOKEN: '/api/auth/verify',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  
  // Users
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/profile',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    PHYSICAL_ATTRIBUTES: '/api/users/physical-attributes',
    FOOTBALL_PROFILE: '/api/users/football-profile',
  },
  
  // Players
  PLAYERS: {
    CREATE: '/api/players',
    GET_BY_ID: (id: string) => `/api/players/${id}`,
    SEARCH: '/api/players/search',
    UPDATE: (id: string) => `/api/players/${id}`,
  },
  
  // Media
  MEDIA: {
    UPLOAD: '/api/media/upload',
    GET_BY_ID: (id: string) => `/api/media/${id}`,
    DELETE: (id: string) => `/api/media/${id}`,
    LIST: '/api/media',
  },
  
  // Verification
  VERIFICATION: {
    INITIATE: '/api/verification/initiate',
    UPLOAD: '/api/verification/upload',
    SUBMIT: '/api/verification/submit',
    STATUS: (id: string) => `/api/verification/${id}`,
  },
  
  // Messaging
  MESSAGES: {
    SEND: '/api/messages',
    GET_CONVERSATION: (id: string) => `/api/messages/conversation/${id}`,
    LIST_CONVERSATIONS: '/api/messages/conversations',
    MARK_READ: (id: string) => `/api/messages/${id}/read`,
  },
  
  // Scouts
  SCOUTS: {
    DASHBOARD: '/api/scouts/dashboard',
    SEARCH_PLAYERS: '/api/scouts/search',
  },
};

/**
 * Storage Keys (for AsyncStorage in mobile)
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@vysion/auth_token',
  USER_DATA: '@vysion/user_data',
  USER_TYPE: '@vysion/user_type',
  ONBOARDING_COMPLETED: '@vysion/onboarding_completed',
  THEME: '@vysion/theme',
  LANGUAGE: '@vysion/language',
};

/**
 * File Upload Constants
 */

export const MEDIA_CONSTRAINTS = {
  IMAGE: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  VIDEO: {
    MAX_SIZE_MB: 500,
    MAX_SIZE_BYTES: 500 * 1024 * 1024,
    ALLOWED_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    ALLOWED_EXTENSIONS: ['.mp4', '.mov', '.avi'],
    MAX_DURATION_SECONDS: 600, // 10 minutes
  },
};

/**
 * Pagination Constants
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * Validation Rules
 */

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 1000,
  MESSAGE_MAX_LENGTH: 5000,
};

/**
 * Error Codes
 */

export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Permissions
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Media
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
};

/**
 * Success Messages
 */

export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MEDIA_UPLOADED: 'Media uploaded successfully',
  VERIFICATION_SUBMITTED: 'Verification submitted successfully',
  MESSAGE_SENT: 'Message sent successfully',
};

/**
 * HTTP Status Codes
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * App Configuration
 */

export const APP_CONFIG = {
  APP_NAME: 'Vysion Analytics',
  APP_VERSION: '2.0.0',
  API_VERSION: 'v1',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'pt'],
};
