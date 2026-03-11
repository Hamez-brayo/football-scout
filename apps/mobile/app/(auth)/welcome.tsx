import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-primary-800">
      <StatusBar style="light" />
      
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo/Icon area */}
        <View className="mb-12">
          <Text className="text-6xl text-white font-bold text-center">⚽</Text>
          <Text className="text-4xl text-white font-bold text-center mt-4">
            Vysion Analytics
          </Text>
          <Text className="text-lg text-white/80 text-center mt-2">
            Discover Your Football Future
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12 space-y-4">
          <FeatureItem text="Create professional player profiles" />
          <FeatureItem text="Upload match highlights & videos" />
          <FeatureItem text="Get verified by clubs & scouts" />
          <FeatureItem text="Connect with opportunities worldwide" />
        </View>

        {/* CTA Buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            className="bg-white rounded-full py-4"
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text className="text-primary-800 text-center font-bold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary-700 rounded-full py-4 border-2 border-white/30"
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text className="text-white text-center font-bold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-white/60 text-sm mt-8 text-center">
          Join thousands of players getting discovered
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-center">
      <Text className="text-secondary-400 text-xl mr-3">✓</Text>
      <Text className="text-white/90 text-base">{text}</Text>
    </View>
  );
}
