import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { Container, Typography, Button } from '@/src/components/ui';

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
    <Container centered>
      <Typography variant="h1">Home</Typography>
      <Typography variant="body" color="#64748b" style={styles.subtitle}>
        Signed in as {user?.email ?? 'Unknown'}
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
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 8,
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
});

export default HomeScreen;
