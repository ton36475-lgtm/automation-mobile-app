/**
 * Story Engine Module - One-Click Story Generation
 * Generates 8 complete story packs from a single topic
 */

'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { cn } from '@/lib/utils';
import { getGemma4Client } from '@/lib/gemma4-client';

interface Story {
  id: string;
  title: string;
  angle: string;
  hook: string;
  problem: string;
  solve: string;
  duration: number;
  voiceoverScript: string;
}

interface GenerationState {
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  stories: Story[];
  error?: string;
  jobId?: string;
}

export default function StoryEngineScreen() {
  const [topic, setTopic] = useState('ค่าไฟธุรกิจ SME ที่คาดเดาไม่ได้');
  const [platforms, setPlatforms] = useState(['youtube', 'tiktok', 'instagram']);
  const [style, setStyle] = useState('educational');
  const [targetAudience, setTargetAudience] = useState('SME business owners');
  const [cta, setCta] = useState('Subscribe for more tips');
  
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    stories: [],
  });

  const gemma4 = getGemma4Client();

  // Platform options
  const platformOptions = [
    { label: 'YouTube', value: 'youtube' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'LinkedIn', value: 'linkedin' },
  ];

  // Style options
  const styleOptions = [
    { label: 'Educational', value: 'educational' },
    { label: 'Entertaining', value: 'entertaining' },
    { label: 'Inspirational', value: 'inspirational' },
    { label: 'Data-driven', value: 'data-driven' },
  ];

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Generate stories
  const handleGenerateStories = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    if (platforms.length === 0) {
      Alert.alert('Error', 'Please select at least one platform');
      return;
    }

    try {
      setState({ status: 'generating', progress: 0, stories: [] });

      // Submit generation request
      const response = await gemma4.generateStories({
        topic,
        platforms,
        style,
        targetAudience,
        cta,
      });

      setState((prev) => ({
        ...prev,
        jobId: response.jobId,
        progress: 20,
      }));

      // Poll for completion
      const result = await gemma4.waitForCompletion(response.jobId);

      if (result.status === 'completed' && result.stories) {
        setState({
          status: 'completed',
          progress: 100,
          stories: result.stories,
        });
      } else if (result.status === 'failed') {
        setState({
          status: 'error',
          progress: 0,
          stories: [],
          error: result.error || 'Generation failed',
        });
      }
    } catch (error) {
      setState({
        status: 'error',
        progress: 0,
        stories: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Render story card
  const renderStoryCard = (story: Story, index: number) => (
    <View
      key={story.id}
      className="bg-surface rounded-lg p-4 mb-4 border border-border"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">
            Story {index + 1}
          </Text>
          <Text className="text-sm text-muted">{story.angle}</Text>
        </View>
        <View className="bg-primary px-2 py-1 rounded">
          <Text className="text-xs font-semibold text-background">
            {story.duration}s
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-semibold text-foreground mb-1">
          Hook
        </Text>
        <Text className="text-sm text-muted">{story.hook}</Text>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-semibold text-foreground mb-1">
          Problem
        </Text>
        <Text className="text-sm text-muted">{story.problem}</Text>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-semibold text-foreground mb-1">
          Solution
        </Text>
        <Text className="text-sm text-muted">{story.solve}</Text>
      </View>

      <Pressable
        className="bg-primary py-2 px-4 rounded-lg flex-row items-center justify-center"
        onPress={() => Alert.alert('Story Details', story.voiceoverScript)}
      >
        <Text className="text-white font-semibold">View Voiceover</Text>
      </Pressable>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              Story Engine
            </Text>
            <Text className="text-base text-muted">
              Generate 8 complete story packs from a single topic
            </Text>
          </View>

          {/* Topic Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Topic
            </Text>
            <View className="bg-surface border border-border rounded-lg px-4 py-3">
              <Text
                className="text-base text-foreground"
                onPress={() => setTopic('')}
              >
                {topic || 'Enter topic...'}
              </Text>
            </View>
          </View>

          {/* Platforms */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Platforms
            </Text>
            <View className="gap-2">
              {platformOptions.map((platform) => (
                <Pressable
                  key={platform.value}
                  onPress={() => togglePlatform(platform.value)}
                  className={cn(
                    'flex-row items-center p-3 rounded-lg border',
                    platforms.includes(platform.value)
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <View
                    className={cn(
                      'w-5 h-5 rounded border-2 mr-3',
                      platforms.includes(platform.value)
                        ? 'bg-primary border-primary'
                        : 'border-muted'
                    )}
                  />
                  <Text
                    className={cn(
                      'text-base font-medium',
                      platforms.includes(platform.value)
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    {platform.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Style */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Style
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {styleOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setStyle(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-full border',
                    style === option.value
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      style === option.value
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Target Audience */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Target Audience
            </Text>
            <View className="bg-surface border border-border rounded-lg px-4 py-3">
              <Text className="text-base text-foreground">{targetAudience}</Text>
            </View>
          </View>

          {/* CTA */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Call to Action
            </Text>
            <View className="bg-surface border border-border rounded-lg px-4 py-3">
              <Text className="text-base text-foreground">{cta}</Text>
            </View>
          </View>

          {/* Generate Button */}
          <Pressable
            disabled={state.status === 'generating'}
            onPress={handleGenerateStories}
            className={cn(
              'py-4 px-6 rounded-lg flex-row items-center justify-center',
              state.status === 'generating'
                ? 'bg-muted'
                : 'bg-primary active:opacity-80'
            )}
          >
            {state.status === 'generating' ? (
              <>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text className="text-white font-bold ml-2">
                  Generating... {state.progress}%
                </Text>
              </>
            ) : (
              <Text className="text-white font-bold text-lg">
                Generate Stories
              </Text>
            )}
          </Pressable>

          {/* Error Message */}
          {state.status === 'error' && (
            <View className="bg-error bg-opacity-10 border border-error rounded-lg p-4">
              <Text className="text-error font-semibold">Error</Text>
              <Text className="text-error text-sm mt-1">{state.error}</Text>
            </View>
          )}

          {/* Stories */}
          {state.stories.length > 0 && (
            <View>
              <Text className="text-xl font-bold text-foreground mb-4">
                Generated Stories ({state.stories.length})
              </Text>
              {state.stories.map((story, index) =>
                renderStoryCard(story, index)
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
