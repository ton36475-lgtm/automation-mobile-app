/**
 * Ghost Claw OS - Story Engine Module
 * One-Click Story Generation from Topic
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
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { getBackendIntegration } from '@/lib/backend-integration';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  title: string;
  description: string;
  scenes: number;
  duration: string;
  platforms: string[];
  status: 'draft' | 'rendering' | 'published';
}

export default function StoryEngineScreen() {
  const colors = useColors();
  const backend = getBackendIntegration();

  // State
  const [topic, setTopic] = useState('');
  const [platforms, setPlatforms] = useState(['youtube', 'tiktok', 'instagram']);
  const [style, setStyle] = useState('educational');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Platform options
  const platformOptions = [
    { id: 'youtube', label: 'YouTube', icon: '▶️' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'facebook', label: 'Facebook', icon: '👥' },
  ];

  // Style options
  const styleOptions = [
    { id: 'educational', label: 'Educational', emoji: '📚' },
    { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { id: 'motivational', label: 'Motivational', emoji: '💪' },
    { id: 'news', label: 'News', emoji: '📰' },
  ];

  // Toggle platform
  const togglePlatform = useCallback((platformId: string) => {
    setPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  }, []);

  // Generate stories
  const handleGenerateStories = useCallback(async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    if (platforms.length === 0) {
      Alert.alert('Error', 'Please select at least one platform');
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      // Submit job
      const jobId = await backend.generateStories({
        topic,
        platforms,
        style,
        targetAudience: 'general',
        cta: 'Subscribe for more',
      });

      setActiveJob(jobId);
      setProgress(10);

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const status = await backend.getJobStatus(jobId);

          // Update progress
          setProgress(Math.min(status.progress, 95));

          if (status.status === 'completed') {
            clearInterval(pollInterval);
            setProgress(100);

            // Add stories to list
            if (status.stories) {
              const newStories: Story[] = status.stories.map(
                (story: any, index: number) => ({
                  id: `${jobId}-${index}`,
                  title: story.title || `Story ${index + 1}`,
                  description: story.description || story.hook || '',
                  scenes: story.scenes?.length || 8,
                  duration: `${(story.scenes?.length || 8) * 8}s`,
                  platforms,
                  status: 'draft',
                })
              );

              setStories((prev) => [...newStories, ...prev]);
            }

            Alert.alert('Success', 'Stories generated successfully!');
            setActiveJob(null);
            setTopic('');
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            Alert.alert('Error', status.error || 'Story generation failed');
            setActiveJob(null);
          }
        } catch (error) {
          console.error('Poll error:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Error', 'Failed to generate stories');
    } finally {
      setLoading(false);
    }
  }, [topic, platforms, style, backend]);

  // Story card
  const renderStoryCard = ({ item }: { item: Story }) => (
    <View
      className={cn(
        'mb-3 rounded-lg p-4 border',
        item.status === 'published'
          ? 'bg-success/10 border-success'
          : 'bg-surface border-border'
      )}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{item.title}</Text>
          <Text className="text-sm text-muted mt-1">{item.description}</Text>
        </View>
        <Text className="text-2xl">{item.status === 'published' ? '✅' : '📝'}</Text>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <View className="flex-row gap-1">
          {item.platforms.map((platform) => (
            <View
              key={platform}
              className="bg-primary/20 px-2 py-1 rounded"
            >
              <Text className="text-xs text-primary font-semibold">
                {platform.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <Text className="text-xs text-muted">
          {item.scenes} scenes • {item.duration}
        </Text>
      </View>

      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          className="flex-1 bg-primary rounded-lg py-2"
          onPress={() => Alert.alert('Edit', 'Edit story feature coming soon')}
        >
          <Text className="text-center text-white font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-primary/50 rounded-lg py-2"
          onPress={() => Alert.alert('Preview', 'Preview feature coming soon')}
        >
          <Text className="text-center text-white font-semibold">Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Story Engine
          </Text>
          <Text className="text-base text-muted">
            Generate professional stories from any topic in seconds
          </Text>
        </View>

        {/* Topic Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">
            Topic
          </Text>
          <TextInput
            className={cn(
              'w-full rounded-lg px-4 py-3 border',
              'bg-surface border-border text-foreground'
            )}
            placeholder="Enter your topic..."
            placeholderTextColor={colors.muted}
            value={topic}
            onChangeText={setTopic}
            editable={!loading}
            multiline
          />
        </View>

        {/* Platform Selection */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Platforms
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                onPress={() => togglePlatform(platform.id)}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  platforms.includes(platform.id)
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
                disabled={loading}
              >
                <Text
                  className={cn(
                    'font-semibold',
                    platforms.includes(platform.id)
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  {platform.icon} {platform.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Style Selection */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Style
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {styleOptions.map((styleOption) => (
              <TouchableOpacity
                key={styleOption.id}
                onPress={() => setStyle(styleOption.id)}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  style === styleOption.id
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
                disabled={loading}
              >
                <Text
                  className={cn(
                    'font-semibold',
                    style === styleOption.id
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  {styleOption.emoji} {styleOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          className={cn(
            'w-full rounded-lg py-4 mb-6',
            loading ? 'bg-primary/50' : 'bg-primary'
          )}
          onPress={handleGenerateStories}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row justify-center items-center gap-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold text-lg">
                Generating... {progress}%
              </Text>
            </View>
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Generate Stories
            </Text>
          )}
        </TouchableOpacity>

        {/* Progress Bar */}
        {activeJob && (
          <View className="mb-6 bg-surface rounded-lg p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-foreground">
                Processing...
              </Text>
              <Text className="text-sm text-muted">{progress}%</Text>
            </View>
            <View className="w-full h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        )}

        {/* Stories List */}
        {stories.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Generated Stories ({stories.length})
            </Text>
            <FlatList
              data={stories}
              renderItem={renderStoryCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State */}
        {stories.length === 0 && !loading && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-4xl mb-4">✨</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">
              No stories yet
            </Text>
            <Text className="text-sm text-muted text-center">
              Enter a topic and click "Generate Stories" to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
