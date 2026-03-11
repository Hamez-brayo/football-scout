import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Player'}! 👋
          </Text>
          <Text className="text-gray-600 mt-2">
            Let's continue building your football career
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </Text>
          <View className="space-y-3">
            <QuickAction
              icon="📸"
              title="Upload Media"
              description="Add photos and videos to your profile"
            />
            <QuickAction
              icon="✏️"
              title="Update Profile"
              description="Keep your information current"
            />
            <QuickAction
              icon="✓"
              title="Get Verified"
              description="Complete verification process"
            />
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Profile Stats
          </Text>
          <View className="flex-row justify-around">
            <StatItem label="Profile" value="60%" />
            <StatItem label="Media" value="3" />
            <StatItem label="Views" value="12" />
          </View>
        </View>

        {/* Recent Activity */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Recent Activity
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center">
              No recent activity yet
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 flex-row items-center shadow-sm">
      <Text className="text-3xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
      <Text className="text-gray-400">›</Text>
    </TouchableOpacity>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="text-2xl font-bold text-primary-600">{value}</Text>
      <Text className="text-sm text-gray-600 mt-1">{label}</Text>
    </View>
  );
}
