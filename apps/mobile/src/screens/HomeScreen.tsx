import React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Main app placeholder after authentication</Text>
      <Text style={styles.subtitle}>Signed in as: {user?.email || 'Unknown user'}</Text>
      <View style={styles.actions}>
        {loggingOut ? (
          <ActivityIndicator />
        ) : (
          <Button title="Sign out to Login" onPress={handleLogout} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
});

export default HomeScreen;
