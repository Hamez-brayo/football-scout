// Canonical session response types for web, mobile, and backend

export interface AuthUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
}

export interface SessionResponse {
  success: boolean;
  data: {
    user: AuthUser;
    appToken?: string; // backend JWT
  };
  timestamp: string;
}
