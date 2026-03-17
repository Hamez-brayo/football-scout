/**
 * Navigation Types
 *
 * Central definition of all navigation stack param lists.
 * Import from here instead of defining inline in navigators.
 */

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

/**
 * Extend as the app grows:
 *
 * export type TabParamList = {
 *   Discover: undefined;
 *   Profile: undefined;
 *   Messages: undefined;
 * };
 *
 * export type ProfileStackParamList = {
 *   ProfileView: { userId: string };
 *   ProfileEdit: undefined;
 * };
 */
