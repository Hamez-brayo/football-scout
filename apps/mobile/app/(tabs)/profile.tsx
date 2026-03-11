import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Profile Header */}
        <View className="bg-white rounded-lg p-6 items-center shadow-sm mb-6">
          <View className="w-24 h-24 bg-primary-600 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl text-white font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.fullName || `${user?.firstName} ${user?.lastName}`}
          </Text>
          <Text className="text-gray-600 mt-1">{user?.email}</Text>
          <View className="mt-2 bg-primary-100 px-3 py-1 rounded-full">
            <Text className="text-primary-800 font-medium">
              {user?.userType || 'Talent'}
            </Text>
          </View>
        </View>

        {/* Profile Options */}
        <View className="bg-white rounded-lg shadow-sm mb-6">
          <ProfileOption 
            title="Edit Profile" 
            icon="✏️" 
            onPress={() => router.push('/(tabs)/edit-profile')}
          />
          <ProfileOption title="Physical Attributes" icon="💪" />
          <ProfileOption title="Football Profile" icon="⚽" />
          <ProfileOption title="Media Gallery" icon="📸" />
        </View>

        {/* Settings */}
        <View className="bg-white rounded-lg shadow-sm mb-6">
          <ProfileOption title="Settings" icon="⚙️" />
          <ProfileOption title="Privacy" icon="🔒" />
          <ProfileOption title="Help & Support" icon="❓" />
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-red-50 rounded-lg p-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-red-600 font-semibold text-lg">Logout</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 text-sm mt-6">
          Version 2.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

function ProfileOption({ 
  title, 
  icon, 
  onPress 
}: { 
  title: string; 
  icon: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100"
      onPress={onPress}
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <Text className="flex-1 text-gray-900 font-medium">{title}</Text>
      <Text className="text-gray-400">›</Text>
    </TouchableOpacity>
  );
}
