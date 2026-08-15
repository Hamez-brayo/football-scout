// Centralized backend JWT token management utility
// Stores token in memory and localStorage

let memoryToken: string | null = null;

export function setToken(token: string) {
  memoryToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('backend_jwt', token);
  }
}

export function getToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const token = localStorage.getItem('backend_jwt');
  memoryToken = token;
  return token;
}

export function clearToken() {
  memoryToken = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('backend_jwt');
  }
}
