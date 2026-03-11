import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse } from '@vysion/shared';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadPlayerDetails();
  }, [id]);

  const loadPlayerDetails = async () => {
    try {
      setLoading(true);
      const response = (await apiClient.players.getById(id!)) as ApiResponse;
      if (response.success) {
        setPlayer(response.data);
      }
    } catch (error) {
      console.error('Error loading player details:', error);
      Alert.alert('Error', 'Failed to load player details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!player) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Player not found</Text>
      </View>
    );
  }

  const age = player.dateOfBirth
    ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
    : '?';

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-2 pb-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-primary-600 text-lg font-semibold">← Back</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        {/* Header Card */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          {/* Avatar */}
          <View className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg items-center justify-center mx-auto mb-4">
            <Text className="text-white text-4xl">
              {player.firstName?.[0]}{player.lastName?.[0]}
            </Text>
          </View>

          {/* Name and Status */}
          <View className="items-center mb-3">
            <Text className="text-2xl font-bold text-gray-900">
              {player.fullName || `${player.firstName} ${player.lastName}`}
            </Text>
            <View className="mt-2 bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-700 font-semibold text-sm">
                {player.verificationStatus || 'UNVERIFIED'}
              </Text>
            </View>
          </View>

          {/* Quick Info */}
          <View className="flex-row justify-around border-t border-gray-200 pt-4">
            <InfoItem label="Age" value={`${age} yrs`} />
            <InfoItem label="Position" value={player.position || 'N/A'} />
            <InfoItem
              label="Foot"
              value={player.preferredFoot || player.physicalAttributes?.preferredFoot || 'N/A'}
            />
          </View>
        </View>

        {/* Basic Info */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Basic Info</Text>
          <InfoRow label="Nationality" value={player.nationality || 'Not specified'} />
          <InfoRow label="Current Club" value={player.currentClub || 'No club'} />
          <InfoRow label="Location" value={player.currentLocation || 'Not specified'} />
        </View>

        {/* Physical Attributes */}
        {player.physicalAttributes && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">Physical Attributes</Text>
            <InfoRow
              label="Height"
              value={player.physicalAttributes.height ? `${player.physicalAttributes.height} cm` : 'Not specified'}
            />
            <InfoRow
              label="Weight"
              value={player.physicalAttributes.weight ? `${player.physicalAttributes.weight} kg` : 'Not specified'}
            />
            <InfoRow
              label="Fitness Level"
              value={`${player.physicalAttributes.fitnessLevel}%`}
            />
          </View>
        )}

        {/* Football Profile */}
        {player.footballProfile && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">Football Profile</Text>
            <InfoRow
              label="Position"
              value={player.footballProfile.primaryPosition || 'Not specified'}
            />
            <InfoRow
              label="Experience"
              value={player.footballProfile.experience || 'Not specified'}
            />
            {player.footballProfile.achievements?.length > 0 && (
              <View className="mt-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Achievements ({player.footballProfile.achievements.length})
                </Text>
                {player.footballProfile.achievements.slice(0, 3).map((achievement: any) => (
                  <View key={achievement.id} className="ml-2 py-1">
                    <Text className="text-gray-900 font-medium">{achievement.title}</Text>
                    {achievement.description && (
                      <Text className="text-sm text-gray-600">{achievement.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Media */}
        {player.media?.length > 0 && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Media ({player.media.length})
            </Text>
            {player.media.slice(0, 3).map((media: any) => (
              <View key={media.id} className="py-2 border-b border-gray-100">
                <Text className="text-sm font-semibold text-gray-700">{media.title || media.type}</Text>
                {media.description && (
                  <Text className="text-sm text-gray-600 mt-1">{media.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Contact Info */}
        {user?.userType !== 'TALENT' && (
          <TouchableOpacity className="bg-primary-600 rounded-lg py-3 px-4 mb-4">
            <Text className="text-white text-center font-semibold text-lg">
              Get in Touch
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <Text className="text-lg font-bold text-gray-900">{value}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
      <Text className="text-gray-600">{label}</Text>
      <Text className="text-gray-900 font-medium">{value}</Text>
    </View>
  );
}
