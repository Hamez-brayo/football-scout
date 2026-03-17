// Centralized backend JWT token management utility
// Stores token in memory and localStorage

let memoryToken: string | null = null;

export function setToken(token: string) {
  memoryToken = token;
  localStorage.setItem('backend_jwt', token);
}

export function getToken(): string | null {
  if (memoryToken) return memoryToken;
  const token = localStorage.getItem('backend_jwt');
  memoryToken = token;
  return token;
}

export function clearToken() {
  memoryToken = null;
  localStorage.removeItem('backend_jwt');
}
