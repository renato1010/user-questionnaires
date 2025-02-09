/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * Any route not included in this list will be redirected to the login page.
 * @type {string[]}
 */

export const publicRoutes = [];

/**
 * An Array of protected routes that require authentication.
 * @type {string[]} protectedRoutes
 */
export const protectedRoutes = ['/dashboard', '/user-forms'];

/**
 * The prefix for the API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after login
 * @type {string}
 */
export const DEFAULT_USER_REDIRECT = '/user-forms';
export const DEFAULT_ADMIN_REDIRECT = '/dashboard';
