import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from '@/src/navigation/AppNavigator';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Text, View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sensible defaults for mobile
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {Constants.expoConfig?.extra?.localPilot && (
          <Text
            style={{
              backgroundColor: '#fff4df',
              color: '#553c00',
              padding: 8,
              textAlign: 'center',
            }}
          >
            LOCAL PILOT · Use test accounts only
          </Text>
        )}
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </View>
    </SafeAreaProvider>
  );
}
