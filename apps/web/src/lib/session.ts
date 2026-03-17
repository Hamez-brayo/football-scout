// Session exchange logic for hybrid auth model
import { auth } from '@/config/firebase';

export async function exchangeSession(registrationData?: { firstName?: string; lastName?: string; userType?: string }) {
  const user = auth.currentUser;
  if (!user) throw new Error('No Firebase user');
  const idToken = await user.getIdToken();
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, ...registrationData }),
  });
  if (!res.ok) throw new Error('Session exchange failed');
  const { data } = await res.json();
  return data.appToken as string;
}

// Token management moved to token.ts
