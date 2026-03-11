import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { apiClient } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, PaginatedResponse } from '@vysion/shared';

interface Player {
  id: string;
  userId: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  position?: string;
  currentClub?: string;
  profilePhoto?: string;
  verificationStatus?: string;
  physicalAttributes?: any;
}

export default function SearchScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    position: '',
    nationality: '',
    ageMin: undefined as number | undefined,
    ageMax: undefined as number | undefined,
  });

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadPlayers();
  }, [filters]);

  const loadPlayers = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const response = (await apiClient.players.search({
        ...filters,
        query: searchQuery,
        page: pageNum,
        limit: 20,
      })) as ApiResponse<PaginatedResponse<Player>>;

      if (response.success && response.data) {
        setPlayers(pageNum === 1 ? response.data.items : [...players, ...response.data.items]);
        setHasMore(response.data.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPlayers(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPlayers(page + 1);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadPlayers(1);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-3">🔍 Discover Players</Text>

        {/* Search Input */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
          <TextInput
            className="flex-1 text-gray-900"
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text className="text-gray-600">Search</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="bg-primary-500 rounded-lg py-2 px-4 items-center"
        >
          <Text className="text-white font-semibold">
            {showFilters ? '✕ Close Filters' : '⚙️ Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters Modal */}
      <Modal visible={showFilters && !loading} animationType="slide">
        <ScrollView className="flex-1 bg-white pt-8 px-4">
          <View className="mb-6 mt-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Set Filters</Text>

            {/* Position Filter */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Position</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                placeholder="e.g., Striker"
                value={filters.position}
                onChangeText={(val) => setFilters({ ...filters, position: val })}
              />
            </View>

            {/* Nationality Filter */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Nationality</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                placeholder="e.g., Brazil"
                value={filters.nationality}
                onChangeText={(val) => setFilters({ ...filters, nationality: val })}
              />
            </View>

            {/* Age Range */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Age Range</Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Min"
                  value={filters.ageMin?.toString() || ''}
                  onChangeText={(val) =>
                    setFilters({ ...filters, ageMin: val ? parseInt(val) : undefined })
                  }
                  keyboardType="number-pad"
                />
                <TextInput
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Max"
                  value={filters.ageMax?.toString() || ''}
                  onChangeText={(val) =>
                    setFilters({ ...filters, ageMax: val ? parseInt(val) : undefined })
                  }
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              onPress={() => {
                handleSearch();
                setShowFilters(false);
              }}
              className="bg-primary-600 rounded-lg py-3 mt-6 mb-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Players List */}
      {loading && page === 1 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList<Player>
          data={players}
          keyExtractor={(item: Player) => item.id}
          renderItem={({ item }: { item: Player }) => (
            <PlayerCard
              player={item}
              onPress={() =>
                router.push({
                  pathname: '/player-detail/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Text className="text-gray-600 text-lg">No players found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          className="bg-gray-50"
          contentContainerClassName="p-4"
        />
      )}
    </View>
  );
}

function PlayerCard({
  player,
  onPress,
}: {
  player: Player;
  onPress: () => void;
}) {
  const age = player.dateOfBirth
    ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
    : '?';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-start">
        {/* Profile Photo */}
        <View className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg items-center justify-center mr-4">
          {player.profilePhoto ? (
            <Text className="text-white text-2xl">📸</Text>
          ) : (
            <Text className="text-white text-2xl">👤</Text>
          )}
        </View>

        {/* Player Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-bold text-gray-900">
              {player.fullName || `${player.firstName} ${player.lastName}`}
            </Text>
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-xs font-semibold text-blue-700">
                {player.verificationStatus || 'UNVERIFIED'}
              </Text>
            </View>
          </View>

          {/* Position and Age */}
          <View className="flex-row items-center gap-3 mb-2">
            <Text className="text-sm font-semibold text-gray-700">
              {player.position || 'N/A'} • {age} yrs
            </Text>
          </View>

          {/* Nationality and Club */}
          <Text className="text-sm text-gray-600">
            {player.nationality || 'Unknown'} • {player.currentClub || 'No club'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
