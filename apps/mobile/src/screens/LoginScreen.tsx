import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema } from '@vysion/shared';
import { z } from 'zod';

import { useAuth } from '@/src/contexts/AuthContext';
import { Container, Typography, Input, Button } from '@/src/components/ui';
import type { RootStackParamList } from '@/src/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type SignInForm = z.infer<typeof SignInSchema>;

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      await login(data.email.trim(), data.password);
    } catch (err: any) {
      setError('root.serverError', {
        type: 'server',
        message: err?.message || 'Failed to login. Please check your credentials.',
      });
    }
  };

  return (
    <Container centered keyboardAware scrollable>
      <Typography variant="h1" accessibilityRole="header">
        Welcome Back
      </Typography>
      <Typography variant="body" color="#64748b" style={styles.subtitle}>
        Sign in to Vysion Analytics
      </Typography>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              secureTextEntry
              placeholder="Enter your password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        
        {errors.root?.serverError && (
          <Typography variant="caption" color="#ef4444" accessibilityRole="alert">
            {errors.root.serverError.message}
          </Typography>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        />
        <Button
          title="Create an account"
          variant="ghost"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 8,
  },
  form: {
    marginTop: 32,
    gap: 16,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
});

export default LoginScreen;
