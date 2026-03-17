import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '@vysion/shared';
import { z } from 'zod';

import { useAuth } from '@/src/contexts/AuthContext';
import { Container, Typography, Input, Button } from '@/src/components/ui';
import type { RootStackParamList } from '@/src/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
type SignUpForm = z.infer<typeof SignUpSchema>;

const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuth();
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userType: 'TALENT', // Default to talent for now
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      await register({
        ...data,
        email: data.email.trim(),
        userType: data.userType || 'TALENT',
      });
    } catch (err: any) {
      setError('root.serverError', {
        type: 'server',
        message: err?.message || 'Failed to register account.',
      });
    }
  };

  return (
    <Container centered keyboardAware scrollable>
      <Typography variant="h1" accessibilityRole="header">
        Create Account
      </Typography>
      <Typography variant="body" color="#64748b" style={styles.subtitle}>
        Join Vysion Analytics
      </Typography>

      <View style={styles.form}>
        <View style={styles.nameRow}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First name"
                placeholder="John"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.firstName?.message}
                containerStyle={styles.nameField}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last name"
                placeholder="Doe"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.lastName?.message}
                containerStyle={styles.nameField}
              />
            )}
          />
        </View>

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
              placeholder="Min. 8 characters"
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
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        />
        <Button
          title="Already have an account? Sign in"
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
});

export default RegisterScreen;
