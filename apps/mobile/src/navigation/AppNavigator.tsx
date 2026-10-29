import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet, Text, Pressable } from 'react-native';
import LoginScreen from '@/src/screens/LoginScreen';
import RegisterScreen from '@/src/screens/RegisterScreen';
import HomeScreen from '@/src/screens/HomeScreen';
import { useAuth } from '@/src/contexts/AuthContext';
import type { RootStackParamList } from '@/src/types/navigation';
import { useMutation } from '@/src/screens/network/NetworkUI';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, sessionError, retrySession, logout } = useAuth();

  const recoveryAction = useMutation();

  // Anti-flicker: show loading screen until auth state resolves
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  const recovery = sessionError ? (
    <View style={styles.recovery}>
      <Text accessibilityRole="alert" style={styles.error}>
        {sessionError}
      </Text>
      {recoveryAction.status}
      <Text>Your session could not sync. Check your connection and try again.</Text>
      <Pressable
        accessibilityRole="button"
        disabled={recoveryAction.busy}
        accessibilityState={{ disabled: recoveryAction.busy }}
        onPress={() => {
          void recoveryAction.run(retrySession);
        }}
        style={styles.retry}
      >
        <Text style={styles.retryText}>Retry session</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={recoveryAction.busy}
        accessibilityState={{ disabled: recoveryAction.busy }}
        onPress={() => {
          void recoveryAction.run(logout);
        }}
        style={styles.retry}
      >
        <Text style={styles.retryText}>Return to sign in</Text>
      </Pressable>
    </View>
  ) : null;

  if (sessionError && !isAuthenticated) return <View style={styles.loading}>{recovery}</View>;

  return (
    <View style={{ flex: 1 }}>
      {recovery}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  recovery: { padding: 16, gap: 10, backgroundColor: '#fff4df', maxWidth: 640 },
  error: { color: '#8b341b', fontWeight: '600' },
  retry: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#153f34',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});

export default AppNavigator;
