/**
 * API Constants
 */
export declare const API_ENDPOINTS: {
    AUTH: {
        SIGN_UP: string;
        SIGN_IN: string;
        SESSION: string;
        ME: string;
        SIGN_OUT: string;
        VERIFY_TOKEN: string;
    };
    USERS: {
        ME: string;
        UPDATE: string;
        GET_BY_ID: (id: string) => string;
        PHYSICAL_ATTRIBUTES: string;
        FOOTBALL_PROFILE: string;
    };
    PLAYERS: {
        CREATE: string;
        GET_BY_ID: (id: string) => string;
        SEARCH: string;
        UPDATE: (id: string) => string;
    };
    MEDIA: {
        UPLOAD: string;
        GET_BY_ID: (id: string) => string;
        DELETE: (id: string) => string;
        LIST: string;
    };
    TRAINING: {
        PROGRAMS: string;
        DRILLS: string;
        SUBMISSIONS: string;
    };
    STATS: {
        BASE: string;
        PLAYER: (playerId: string) => string;
    };
    SCOUT: {
        SEARCH: string;
        SHORTLIST: string;
    };
    VERIFICATION: {
        INITIATE: string;
        UPLOAD: string;
        SUBMIT: string;
        STATUS: (id: string) => string;
    };
    MESSAGES: {
        SEND: string;
        GET_CONVERSATION: (id: string) => string;
        LIST_CONVERSATIONS: string;
        MARK_READ: (id: string) => string;
    };
};
/**
 * Storage Keys (for AsyncStorage in mobile)
 */
export declare const STORAGE_KEYS: {
    AUTH_TOKEN: string;
    USER_DATA: string;
    USER_TYPE: string;
    ONBOARDING_COMPLETED: string;
    THEME: string;
    LANGUAGE: string;
};
/**
 * File Upload Constants
 */
export declare const MEDIA_CONSTRAINTS: {
    IMAGE: {
        MAX_SIZE_MB: number;
        MAX_SIZE_BYTES: number;
        ALLOWED_TYPES: string[];
        ALLOWED_EXTENSIONS: string[];
    };
    VIDEO: {
        MAX_SIZE_MB: number;
        MAX_SIZE_BYTES: number;
        ALLOWED_TYPES: string[];
        ALLOWED_EXTENSIONS: string[];
        MAX_DURATION_SECONDS: number;
    };
};
/**
 * Pagination Constants
 */
export declare const PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
};
/**
 * Validation Rules
 */
export declare const VALIDATION_RULES: {
    PASSWORD_MIN_LENGTH: number;
    NAME_MIN_LENGTH: number;
    NAME_MAX_LENGTH: number;
    BIO_MAX_LENGTH: number;
    MESSAGE_MAX_LENGTH: number;
};
/**
 * Error Codes
 */
export declare const ERROR_CODES: {
    UNAUTHORIZED: string;
    INVALID_TOKEN: string;
    TOKEN_EXPIRED: string;
    VALIDATION_ERROR: string;
    INVALID_INPUT: string;
    NOT_FOUND: string;
    ALREADY_EXISTS: string;
    FORBIDDEN: string;
    INSUFFICIENT_PERMISSIONS: string;
    INTERNAL_ERROR: string;
    SERVICE_UNAVAILABLE: string;
    FILE_TOO_LARGE: string;
    INVALID_FILE_TYPE: string;
    UPLOAD_FAILED: string;
};
/**
 * Success Messages
 */
export declare const SUCCESS_MESSAGES: {
    PROFILE_CREATED: string;
    PROFILE_UPDATED: string;
    MEDIA_UPLOADED: string;
    VERIFICATION_SUBMITTED: string;
    MESSAGE_SENT: string;
};
/**
 * HTTP Status Codes
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
/**
 * App Configuration
 */
export declare const APP_CONFIG: {
    APP_NAME: string;
    APP_VERSION: string;
    API_VERSION: string;
    DEFAULT_LANGUAGE: string;
    SUPPORTED_LANGUAGES: string[];
};
