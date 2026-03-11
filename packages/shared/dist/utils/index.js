"use strict";
/**
 * Utility Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.calculateAge = calculateAge;
exports.formatFileSize = formatFileSize;
exports.truncateText = truncateText;
exports.getInitials = getInitials;
exports.debounce = debounce;
exports.deepClone = deepClone;
exports.isValidEmail = isValidEmail;
exports.capitalize = capitalize;
exports.enumToOptions = enumToOptions;
exports.sleep = sleep;
exports.generateId = generateId;
exports.isDefined = isDefined;
exports.formatPosition = formatPosition;
exports.metersToFeet = metersToFeet;
exports.kgToLbs = kgToLbs;
exports.getFileExtension = getFileExtension;
exports.isValidFileType = isValidFileType;
exports.createFullName = createFullName;
exports.parseQueryString = parseQueryString;
exports.retry = retry;
/**
 * Format date to readable string
 */
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
/**
 * Format file size to human readable
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
}
/**
 * Generate initials from name
 */
function getInitials(firstName, lastName) {
    if (!lastName)
        return firstName.charAt(0).toUpperCase();
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}
/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Check if string is valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Capitalize first letter
 */
function capitalize(text) {
    if (!text)
        return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
/**
 * Convert enum to array of options
 */
function enumToOptions(enumObj) {
    return Object.entries(enumObj).map(([key, value]) => ({
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
        value: value,
    }));
}
/**
 * Sleep/delay function
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
/**
 * Check if value is defined and not null
 */
function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Format position name for display
 */
function formatPosition(position) {
    return position
        .split('_')
        .map((word) => capitalize(word))
        .join(' ');
}
/**
 * Convert meters to feet
 */
function metersToFeet(meters) {
    return Math.round(meters * 3.28084 * 100) / 100;
}
/**
 * Convert kilograms to pounds
 */
function kgToLbs(kg) {
    return Math.round(kg * 2.20462 * 100) / 100;
}
/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}
/**
 * Validate file type
 */
function isValidFileType(filename, allowedExtensions) {
    const extension = '.' + getFileExtension(filename);
    return allowedExtensions.includes(extension);
}
/**
 * Create full name from first and last name
 */
function createFullName(firstName, lastName) {
    return [firstName, lastName].filter(Boolean).join(' ');
}
/**
 * Parse query string to object
 */
function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}
/**
 * Retry async function with exponential backoff
 */
async function retry(fn, options = {}) {
    const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxAttempts) {
                const waitTime = delay * Math.pow(backoff, attempt - 1);
                await sleep(waitTime);
            }
        }
    }
    throw lastError;
}
