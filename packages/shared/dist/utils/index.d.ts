/**
 * Utility Functions
 */
/**
 * Format date to readable string
 */
export declare function formatDate(date: Date | string): string;
/**
 * Calculate age from date of birth
 */
export declare function calculateAge(dateOfBirth: string | Date): number;
/**
 * Format file size to human readable
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Truncate text with ellipsis
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Generate initials from name
 */
export declare function getInitials(firstName: string, lastName?: string): string;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Deep clone object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Check if string is valid email
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Capitalize first letter
 */
export declare function capitalize(text: string): string;
/**
 * Convert enum to array of options
 */
export declare function enumToOptions<T extends Record<string, string>>(enumObj: T): Array<{
    label: string;
    value: string;
}>;
/**
 * Sleep/delay function
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Generate random ID
 */
export declare function generateId(): string;
/**
 * Check if value is defined and not null
 */
export declare function isDefined<T>(value: T | null | undefined): value is T;
/**
 * Format position name for display
 */
export declare function formatPosition(position: string): string;
/**
 * Convert meters to feet
 */
export declare function metersToFeet(meters: number): number;
/**
 * Convert kilograms to pounds
 */
export declare function kgToLbs(kg: number): number;
/**
 * Get file extension from filename
 */
export declare function getFileExtension(filename: string): string;
/**
 * Validate file type
 */
export declare function isValidFileType(filename: string, allowedExtensions: string[]): boolean;
/**
 * Create full name from first and last name
 */
export declare function createFullName(firstName?: string, lastName?: string): string;
/**
 * Parse query string to object
 */
export declare function parseQueryString(queryString: string): Record<string, string>;
/**
 * Retry async function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
}): Promise<T>;
