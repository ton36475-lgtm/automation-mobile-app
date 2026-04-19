/**
 * Ghost Claw OS - Prompt Lab Module
 * Create, optimize, and test prompts for story generation
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

interface Prompt {
  id: string;
  name: string;
  content: string;
  model: 'grok' | 'flow' | 'gemma4';
  temperature: number;
  maxTokens: number;
  createdAt: string;
  testResults?: {
    score: number;
    feedback: string;
  };
}

export default function PromptLabScreen() {
  const colors = useColors();
  const backend = getBackendIntegration();

  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 'prompt-1',
      name: 'Story Hook Generator',
      content: 'Generate a compelling hook for a story about {{topic}}. The hook should be 1-2 sentences and grab attention immediately.',
      model: 'grok',
      temperature: 0.8,
      maxTokens: 100,
      createdAt: '2026-04-18',
      testResults: {
        score: 8.5,
        feedback: 'Great engagement potential',
      },
    },
    {
      id: 'prompt-2',
      name: 'Scene Description',
      content: 'Describe a scene for a {{topic}} story. Include visual details, emotions, and dialogue.',
      model: 'flow',
      temperature: 0.7,
      maxTokens: 200,
      createdAt: '2026-04-17',
      testResults: {
        score: 7.8,
        feedback: 'Good descriptive quality',
      },
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [promptName, setPromptName] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [selectedModel, setSelectedModel] = useState<'grok' | 'flow' | 'gemma4'>('grok');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(200);
  const [testing, setTesting] = useState(false);
  const [testPromptId, setTestPromptId] = useState<string | null>(null);

  // Create new prompt
  const handleCreatePrompt = useCallback(async () => {
    if (!promptName.trim() || !promptContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newPrompt: Prompt = {
      id: `prompt-${Date.now()}`,
      name: promptName,
      content: promptContent,
      model: selectedModel,
      temperature,
      maxTokens,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPrompts([...prompts, newPrompt]);
    setPromptName('');
    setPromptContent('');
    setSelectedModel('grok');
    setTemperature(0.7);
    setMaxTokens(200);

    Alert.alert('Success', 'Prompt created successfully');
  }, [promptName, promptContent, selectedModel, temperature, maxTokens]);

  // Test prompt
  const handleTestPrompt = useCallback(
    async (prompt: Prompt) => {
      try {
        setTesting(true);
        setTestPromptId(prompt.id);

        // Simulate testing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update prompt with test results
        const updatedPrompts = prompts.map((p) =>
          p.id === prompt.id
            ? {
                ...p,
                testResults: {
                  score: Math.random() * 10,
                  feedback: 'Prompt tested successfully',
                },
              }
            : p
        );

        setPrompts(updatedPrompts);
        Alert.alert('Success', 'Prompt tested successfully');
      } catch (error) {
        console.error('Test error:', error);
        Alert.alert('Error', 'Failed to test prompt');
      } finally {
        setTesting(false);
        setTestPromptId(null);
      }
    },
    [prompts]
  );

  // Delete prompt
  const handleDeletePrompt = useCallback((id: string) => {
    Alert.alert('Delete Prompt', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          setPrompts(prompts.filter((p) => p.id !== id));
        },
      },
    ]);
  }, [prompts]);

  // Prompt card
  const renderPromptCard = ({ item }: { item: Prompt }) => (
    <View className="mb-3 bg-surface rounded-lg p-4 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{item.name}</Text>
          <Text className="text-xs text-muted mt-1">
            {item.model.toUpperCase()} • {item.temperature} temp • {item.maxTokens} tokens
          </Text>
        </View>
        <Text className="text-2xl">📝</Text>
      </View>

      <Text className="text-sm text-muted mb-3 line-clamp-2">{item.content}</Text>

      {item.testResults && (
        <View className="bg-primary/10 rounded-lg p-2 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-primary">
              Score: {item.testResults.score.toFixed(1)}/10
            </Text>
            <Text className="text-xs text-muted">{item.testResults.feedback}</Text>
          </View>
        </View>
      )}

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-primary rounded-lg py-2"
          onPress={() => handleTestPrompt(item)}
          disabled={testing && testPromptId === item.id}
        >
          {testing && testPromptId === item.id ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-semibold text-sm">
              Test
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 bg-primary/50 rounded-lg py-2">
          <Text className="text-center text-white font-semibold text-sm">
            Use
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-error/20 rounded-lg py-2"
          onPress={() => handleDeletePrompt(item.id)}
        >
          <Text className="text-center text-error font-semibold text-sm">
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Prompt Lab
          </Text>
          <Text className="text-base text-muted">
            Create and optimize prompts for story generation
          </Text>
        </View>

        {/* Create Prompt Section */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            Create New Prompt
          </Text>

          <TextInput
            className="bg-background rounded-lg p-3 mb-3 text-foreground border border-border"
            placeholder="Prompt name"
            placeholderTextColor={colors.muted}
            value={promptName}
            onChangeText={setPromptName}
          />

          <TextInput
            className="bg-background rounded-lg p-3 mb-3 text-foreground border border-border"
            placeholder="Prompt content (use {{topic}} for variables)"
            placeholderTextColor={colors.muted}
            value={promptContent}
            onChangeText={setPromptContent}
            multiline
            numberOfLines={4}
          />

          {/* Model Selection */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Model
            </Text>
            <View className="flex-row gap-2">
              {(['grok', 'flow', 'gemma4'] as const).map((model) => (
                <TouchableOpacity
                  key={model}
                  onPress={() => setSelectedModel(model)}
                  className={cn(
                    'flex-1 rounded-lg py-2',
                    selectedModel === model
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-center text-sm font-semibold',
                      selectedModel === model ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {model.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperature */}
          <View className="mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-foreground">
                Temperature
              </Text>
              <Text className="text-sm text-primary font-bold">
                {temperature.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[0.3, 0.5, 0.7, 0.9].map((temp) => (
                <TouchableOpacity
                  key={temp}
                  onPress={() => setTemperature(temp)}
                  className={cn(
                    'flex-1 rounded-lg py-2',
                    temperature === temp
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-center text-xs font-semibold',
                      temperature === temp ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {temp}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Max Tokens */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-semibold text-foreground">
                Max Tokens
              </Text>
              <Text className="text-sm text-primary font-bold">
                {maxTokens}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[100, 200, 500, 1000].map((tokens) => (
                <TouchableOpacity
                  key={tokens}
                  onPress={() => setMaxTokens(tokens)}
                  className={cn(
                    'flex-1 rounded-lg py-2',
                    maxTokens === tokens
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-center text-xs font-semibold',
                      maxTokens === tokens ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {tokens}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-3"
            onPress={handleCreatePrompt}
          >
            <Text className="text-center text-white font-bold">
              Create Prompt
            </Text>
          </TouchableOpacity>
        </View>

        {/* Prompts List */}
        <View>
          <Text className="text-lg font-bold text-foreground mb-3">
            Saved Prompts ({prompts.length})
          </Text>
          <FlatList
            data={prompts}
            renderItem={renderPromptCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
