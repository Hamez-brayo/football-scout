import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Stack, useSegments } from 'expo-router';
import { Text, View } from 'react-native';
import { UserRole } from '@vysion/shared';
import { useAuthStore } from '@/src/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function RootNavigator() {
  const segments = useSegments();
  const { bootstrap, isHydrated, isAuthenticated, role } = useAuthStore((state) => ({
    bootstrap: state.bootstrap,
    isHydrated: state.isHydrated,
    isAuthenticated: state.isAuthenticated,
    role: state.role,
  }));

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Bootstrapping session...</Text>
      </View>
    );
  }

  const activeGroup = segments[0];

  if (!isAuthenticated && activeGroup !== '(auth)') {
    return <Redirect href='/(auth)/login' />;
  }

  if (isAuthenticated && role === UserRole.PLAYER && activeGroup !== '(player)') {
    return <Redirect href='/(player)/home' />;
  }

  if (isAuthenticated && role === UserRole.SCOUT && activeGroup !== '(scout)') {
    return <Redirect href='/(scout)/discover' />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
