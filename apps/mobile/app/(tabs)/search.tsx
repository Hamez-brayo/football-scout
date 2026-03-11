import { View, Text } from 'react-native';

export default function SearchScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold text-gray-900 mb-4">🔍</Text>
      <Text className="text-xl font-semibold text-gray-900">Search Players</Text>
      <Text className="text-gray-600 mt-2">Coming soon...</Text>
    </View>
  );
}
