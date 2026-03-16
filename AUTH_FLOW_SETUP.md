# Auth Flow Stabilization - End-of-Day Notes

Date: 2026-03-17
Project: Football Scout Mobile (Expo Go)

## Summary
This document captures the approach used to stabilize mobile app startup and enforce a clear auth-first entry flow. The app now starts cleanly in Expo Go and routes users to Login/Register first (inside AuthProvider), while authenticated users are routed to Home.

This is an implementation handoff for continuation next session.

## Objectives
- Ensure clean startup on iOS and Android in Expo Go.
- Define an explicit first screen for unauthenticated users.
- Prevent hook-related runtime crashes.
- Keep navigation structure extensible for future screens.
- Verify LAN backend auth connectivity at:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

## Issues Encountered
1. Invalid hook call / useContext null runtime crash
- Symptom: `Invalid hook call. Hooks can only be called inside of a function component` and `Cannot read property 'useContext' of null`.
- Root risk: Hook usage in unstable startup wrappers / inconsistent app entry path.

2. Multiple React tree risk from dependency mismatch
- Symptom: `npm ls react` previously showed conflicting trees while dependency graph was unstable.
- Root risk: Mixed package versions and transitive dependency drift.

3. Missing explicit startup auth flow
- Symptom: No single, clear initial navigation contract for logged-out users.
- Root risk: Ambiguous first-screen behavior.

## Fix Approach Implemented

### 1) Stable app root with AuthProvider
- App root was standardized so AuthProvider always wraps app navigation.
- Hooks are used only inside valid function components.

```tsx
import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from '@/src/navigation/AppNavigator';
import { AuthProvider } from '@/src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
```

### 2) Conditional initial stack in navigator
- In `AppNavigator`, auth state determines initial route group:
  - Authenticated -> `Home`
  - Unauthenticated -> `Login` + `Register`
- `useAuth()` is called only inside `AppNavigator` function component.
- Loading state shows a simple full-screen activity indicator.

```tsx
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### 3) Dependency and startup hardening
- Removed unstable/unused Babel plugin setup for this phase.
- Removed config-plugin friction in Expo Go startup path.
- Reinstalled dependencies and revalidated React resolution.

## LAN Backend Testing Steps

### Prerequisites
- API server listening on LAN-accessible host/port (`0.0.0.0:3002`).
- Device and dev machine on same Wi-Fi.
- Expo running in LAN mode.

### Run Mobile App
```powershell
cd d:\football-scout\apps\mobile
npx expo start -c --lan
```

### Verify Backend Endpoints from Dev Machine
```powershell
$base='http://192.168.1.67:3002/api'
$email = "mobile.authflow.$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())@vysion.dev"
$password='SafePass123!'

$registerBody = @{email=$email; password=$password; firstName='Mobile'; lastName='AuthFlow'; userType='TALENT'} | ConvertTo-Json
$reg = Invoke-WebRequest -Uri "$base/auth/register" -Method POST -ContentType 'application/json' -Body $registerBody -UseBasicParsing
"REGISTER_HTTP=$($reg.StatusCode)"

$loginBody = @{email=$email; password=$password} | ConvertTo-Json
$login = Invoke-WebRequest -Uri "$base/auth/login" -Method POST -ContentType 'application/json' -Body $loginBody -UseBasicParsing
"LOGIN_HTTP=$($login.StatusCode)"
```

### Expected Results
- Register: `201`
- Login: `200`
- Token present in login response

## Verified Outcome (This Session)
- Startup flow is stable with AuthProvider + navigator split.
- First screen for logged-out users is Login/Register.
- Auth endpoints on LAN are reachable and return successful status codes.

## Next Steps / Cleanup Recommendations
1. Review and prune leftover navigation artifacts
- Remove or archive unused legacy routing placeholders to reduce confusion.

2. Finalize HomeScreen
- Replace placeholder with role-aware dashboard shell and guarded data loading.

3. Add auth UX refinements
- Input validation, loading feedback, and error normalization across Login/Register.

4. Add regression checks
- Introduce lightweight startup/auth smoke tests (manual checklist or E2E later).

5. Document environment assumptions
- Keep LAN IP / backend host strategy documented for local testing consistency.

## Suggested Next-Session Starting Point
- Continue from this stabilized auth flow baseline.
- Prioritize HomeScreen productionization and navigation cleanup.
- Keep AuthProvider + conditional stack as the source of truth for startup routing.
