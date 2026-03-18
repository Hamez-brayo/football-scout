import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCurrentUserQuery } from '@/src/hooks/queries/useCurrentUserQuery';
import { Container, Typography, Button } from '@/src/components/ui';

// Human-readable label for each user role
const ROLE_LABELS: Record<string, string> = {
  TALENT: '⚽ Talent / Player',
  AGENT: '🤝 Agent',
  CLUB: '🏟️ Club',
  SCOUT: '🔍 Scout',
};

const HomeScreen = () => {
  const { logout } = useAuth();
  const { data: backendUser, isLoading, isError, error } = useCurrentUserQuery();

  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Container centered>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Typography variant="bodySmall" color="#64748b" style={styles.loadingText}>
          Loading your profile...
        </Typography>
      </Container>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Container centered>
        <Typography variant="h2" color="#ef4444">
          Could not load profile
        </Typography>
        <Typography variant="body" color="#64748b" style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </Typography>
        <View style={styles.actions}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleLogout}
            loading={loggingOut}
          />
        </View>
      </Container>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  const fullName =
    [backendUser?.firstName, backendUser?.lastName].filter(Boolean).join(' ') || null;
  const roleLabel = backendUser?.userType
    ? (ROLE_LABELS[backendUser.userType] ?? backendUser.userType)
    : null;

  return (
    <Container centered>
      {/* Greeting */}
      <Typography variant="h1">
        {fullName ? `Welcome, ${fullName}` : 'Welcome'}
      </Typography>

      {/* Email */}
      <Typography variant="body" color="#64748b" style={styles.meta}>
        {backendUser?.email ?? '—'}
      </Typography>

      {/* Role badge */}
      {roleLabel && (
        <View style={styles.roleBadge}>
          <Typography variant="label" color="#1d4ed8">
            {roleLabel}
          </Typography>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          loading={loggingOut}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 12,
  },
  errorMessage: {
    marginTop: 8,
    textAlign: 'center',
  },
  meta: {
    marginTop: 6,
  },
  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  actions: {
    marginTop: 40,
    gap: 12,
    width: '100%',
  },
});

export default HomeScreen;
