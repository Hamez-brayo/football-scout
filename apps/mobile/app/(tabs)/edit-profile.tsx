import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse } from '@vysion/shared';

export default function ProfileSetupScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    preferredFoot: 'RIGHT' as 'LEFT' | 'RIGHT' | 'BOTH',
    height: '',
    weight: '',
    speed: '',
    stamina: '',
    currentClub: '',
    nationality: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.players.getProfile();
      if (response.success) {
        const playerProfile = response.data;
        setProfile(playerProfile);
        setFormData({
          fullName: playerProfile.fullName || `${playerProfile.firstName} ${playerProfile.lastName}` || '',
          position: playerProfile.position || '',
          preferredFoot: playerProfile.preferredFoot || playerProfile.physicalAttributes?.preferredFoot || 'RIGHT',
          height: playerProfile.physicalAttributes?.height?.toString() || '',
          weight: playerProfile.physicalAttributes?.weight?.toString() || '',
          speed: playerProfile.speed?.toString() || '50',
          stamina: playerProfile.stamina?.toString() || '50',
          currentClub: playerProfile.currentClub || playerProfile.footballProfile?.currentClub || '',
          nationality: playerProfile.nationality || '',
        });
      }
    } catch (error: any) {
      // Profile doesn't exist yet, which is fine for new users
      console.log('Profile not found, ready to create');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.position) {
      Alert.alert('Error', 'Please fill in full name and position');
      return;
    }

    try {
      setSaving(true);
      const profileData = {
        fullName: formData.fullName,
        position: formData.position,
        preferredFoot: formData.preferredFoot,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        speed: formData.speed ? parseFloat(formData.speed) : undefined,
        stamina: formData.stamina ? parseFloat(formData.stamina) : undefined,
        currentClub: formData.currentClub,
        nationality: formData.nationality,
      };

      const response = (profile
        ? await apiClient.players.updateProfile(profileData)
        : await apiClient.players.createProfile(profileData)) as ApiResponse;

      if (response.success) {
        Alert.alert('Success', 'Profile saved successfully!');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.error?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 px-6 pt-6 pb-8">
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-primary-600 text-lg font-semibold">← Back</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Edit Your Profile
            </Text>
            <Text className="text-lg text-gray-600">
              Help scouts discover you
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Full Name */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Your full name"
                value={formData.fullName}
                onChangeText={(val) => setFormData({ ...formData, fullName: val })}
              />
            </View>

            {/* Position */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Position</Text>
              <View className="flex-row flex-wrap gap-2">
                {['GK', 'CB', 'LB', 'RB', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    onPress={() => setFormData({ ...formData, position: pos })}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      formData.position === pos
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <Text
                      className={
                        formData.position === pos
                          ? 'text-white font-semibold'
                          : 'text-gray-700 font-medium'
                      }
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preferred Foot */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Preferred Foot</Text>
              <View className="flex-row gap-2">
                {(['LEFT', 'RIGHT', 'BOTH'] as const).map((foot) => (
                  <TouchableOpacity
                    key={foot}
                    onPress={() => setFormData({ ...formData, preferredFoot: foot })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.preferredFoot === foot
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <Text
                      className={
                        formData.preferredFoot === foot
                          ? 'text-white font-semibold text-center'
                          : 'text-gray-700 font-medium text-center'
                      }
                    >
                      {foot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Physical Attributes */}
            <View className="pt-4 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-900 mb-3">Physical Attributes</Text>

              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Height (cm)</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="170"
                    value={formData.height}
                    onChangeText={(val) => setFormData({ ...formData, height: val })}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Weight (kg)</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="70"
                    value={formData.weight}
                    onChangeText={(val) => setFormData({ ...formData, weight: val })}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Speed & Stamina Sliders (placeholders) */}
              <View className="mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-gray-700">Speed Rating</Text>
                  <Text className="text-sm font-bold text-primary-600">
                    {formData.speed}
                  </Text>
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="0-100"
                  value={formData.speed}
                  onChangeText={(val) => setFormData({ ...formData, speed: val })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-gray-700">Stamina Rating</Text>
                  <Text className="text-sm font-bold text-primary-600">
                    {formData.stamina}
                  </Text>
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="0-100"
                  value={formData.stamina}
                  onChangeText={(val) => setFormData({ ...formData, stamina: val })}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Football Info */}
            <View className="pt-4 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-900 mb-3">Football Info</Text>

              <View className="mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Current Club</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Your club name"
                  value={formData.currentClub}
                  onChangeText={(val) => setFormData({ ...formData, currentClub: val })}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Nationality</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Your nationality"
                  value={formData.nationality}
                  onChangeText={(val) => setFormData({ ...formData, nationality: val })}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className={`mt-8 rounded-lg py-4 ${
                saving ? 'bg-gray-300' : 'bg-primary-600'
              }`}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-bold">
                  Save Profile
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
