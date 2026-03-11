import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signup = useAuthStore((state) => state.signup);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      await signup({
        email,
        password,
        firstName,
        lastName,
        userType: 'TALENT', // Default to talent, can add selection later
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 px-8 pt-16 pb-8">
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-primary-600 text-lg">← Back</Text>
          </TouchableOpacity>

          <Text className="text-4xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-lg text-gray-600 mb-8">
            Start your football journey today
          </Text>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
                autoComplete="name-given"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
                autoComplete="name-family"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Minimum 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <TouchableOpacity
              className="bg-primary-600 rounded-lg py-4 mt-6"
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text className="text-xs text-gray-500 text-center mt-6">
            By creating an account, you agree to our{' '}
            <Text className="text-primary-600">Terms of Service</Text> and{' '}
            <Text className="text-primary-600">Privacy Policy</Text>
          </Text>

          {/* Footer */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
              <Text className="text-primary-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
