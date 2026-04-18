/**
 * Ghost Claw OS - Asset Library Module
 * Search and manage assets from Google Drive
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { getBackendIntegration } from '@/lib/backend-integration';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  tags: string[];
  usageRole: string;
  campaign: string;
  driveUrl: string;
  thumbnail?: string;
}

export default function AssetLibraryScreen() {
  const colors = useColors();
  const backend = getBackendIntegration();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const availableTags = [
    'electricity',
    'business',
    'energy',
    'solar',
    'money',
    'cost',
    'savings',
    'renewable',
  ];

  const availableRoles = [
    'thumbnail',
    'cover',
    'background',
    'overlay',
    'transition',
  ];

  const availableCampaigns = [
    'SME-Energy',
    'Solar-Campaign',
    'Business-Tips',
    'General',
  ];

  // Toggle tag
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Search assets
  const handleSearchAssets = useCallback(async () => {
    if (selectedTags.length === 0) {
      Alert.alert('Error', 'Please select at least one tag');
      return;
    }

    try {
      setLoading(true);

      const foundAssets = await backend.searchAssets(
        selectedTags,
        selectedRole || 'thumbnail',
        selectedCampaign || 'General'
      );

      setAssets(foundAssets);

      if (foundAssets.length === 0) {
        Alert.alert('No Results', 'No assets found matching your criteria');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search assets');
    } finally {
      setLoading(false);
    }
  }, [selectedTags, selectedRole, selectedCampaign, backend]);

  // Sync from Google Drive
  const handleSyncAssets = useCallback(async () => {
    try {
      setSyncing(true);

      const result = await backend.syncAssets();

      Alert.alert(
        'Sync Complete',
        `Synced ${result.synced} assets (${result.failed} failed)`
      );

      // Refresh search
      if (selectedTags.length > 0) {
        handleSearchAssets();
      }
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync assets');
    } finally {
      setSyncing(false);
    }
  }, [backend, selectedTags, handleSearchAssets]);

  // Asset card
  const renderAssetCard = ({ item }: { item: Asset }) => (
    <View className="mb-3 bg-surface rounded-lg overflow-hidden border border-border">
      {/* Thumbnail */}
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: '100%', height: 150 }}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View className="p-3">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">
              {item.name}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {item.type.toUpperCase()} • {item.usageRole}
            </Text>
          </View>
          <Text className="text-2xl">
            {item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : '🔊'}
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <View key={tag} className="bg-primary/20 px-2 py-1 rounded">
              <Text className="text-xs text-primary font-semibold">
                #{tag}
              </Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <View className="bg-primary/20 px-2 py-1 rounded">
              <Text className="text-xs text-primary font-semibold">
                +{item.tags.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-primary rounded-lg py-2">
            <Text className="text-center text-white font-semibold text-sm">
              Preview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-primary/50 rounded-lg py-2">
            <Text className="text-center text-white font-semibold text-sm">
              Use
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Asset Library
          </Text>
          <Text className="text-base text-muted">
            Search and manage your media assets from Google Drive
          </Text>
        </View>

        {/* Sync Button */}
        <TouchableOpacity
          className={cn(
            'w-full rounded-lg py-3 mb-6 flex-row justify-center items-center gap-2',
            syncing ? 'bg-primary/50' : 'bg-primary/20'
          )}
          onPress={handleSyncAssets}
          disabled={syncing}
        >
          {syncing ? (
            <>
              <ActivityIndicator color={colors.primary} />
              <Text className="text-primary font-semibold">Syncing...</Text>
            </>
          ) : (
            <>
              <Text className="text-lg">🔄</Text>
              <Text className="text-primary font-semibold">Sync from Google Drive</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tags Section */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Tags
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                className={cn(
                  'px-3 py-2 rounded-full border',
                  selectedTags.includes(tag)
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
                disabled={loading}
              >
                <Text
                  className={cn(
                    'text-sm font-semibold',
                    selectedTags.includes(tag)
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Role Section */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Usage Role
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {availableRoles.map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => setSelectedRole(selectedRole === role ? '' : role)}
                className={cn(
                  'px-3 py-2 rounded-full border',
                  selectedRole === role
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
                disabled={loading}
              >
                <Text
                  className={cn(
                    'text-sm font-semibold',
                    selectedRole === role ? 'text-white' : 'text-foreground'
                  )}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campaign Section */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Campaign
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {availableCampaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign}
                onPress={() =>
                  setSelectedCampaign(
                    selectedCampaign === campaign ? '' : campaign
                  )
                }
                className={cn(
                  'px-3 py-2 rounded-full border',
                  selectedCampaign === campaign
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
                disabled={loading}
              >
                <Text
                  className={cn(
                    'text-sm font-semibold',
                    selectedCampaign === campaign
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  {campaign}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className={cn(
            'w-full rounded-lg py-4 mb-6',
            loading || selectedTags.length === 0
              ? 'bg-primary/50'
              : 'bg-primary'
          )}
          onPress={handleSearchAssets}
          disabled={loading || selectedTags.length === 0}
        >
          {loading ? (
            <View className="flex-row justify-center items-center gap-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold">Searching...</Text>
            </View>
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Search Assets
            </Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {assets.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Found {assets.length} assets
            </Text>
            <FlatList
              data={assets}
              renderItem={renderAssetCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State */}
        {assets.length === 0 && !loading && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">
              No assets found
            </Text>
            <Text className="text-sm text-muted text-center">
              Select tags and click "Search Assets" to find media
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
