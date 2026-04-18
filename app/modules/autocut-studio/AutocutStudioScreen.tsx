/**
 * Ghost Claw OS - Autocut Studio Module
 * Long-form Video Processing (2h+ → 12 short-form clips)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { getBackendIntegration } from '@/lib/backend-integration';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  title: string;
  description: string;
  keyMoments: number;
  transcription: string;
}

interface Clip {
  id: string;
  title: string;
  duration: number;
  scenes: number;
  status: 'draft' | 'processing' | 'ready';
  thumbnail?: string;
}

export default function AutocutStudioScreen() {
  const colors = useColors();
  const backend = getBackendIntegration();

  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [videoName, setVideoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState('');

  const processingSteps = [
    'Uploading video...',
    'Detecting scenes...',
    'Transcribing audio...',
    'Ranking key moments...',
    'Generating clips...',
    'Optimizing for platforms...',
  ];

  // Simulate video upload
  const handleUploadVideo = useCallback(async () => {
    Alert.alert('Upload Video', 'Select a video file from your device');
    // In real app, use DocumentPicker or ImagePicker
    setVideoFile('video-sample.mp4');
    setVideoName('Long-form Video');
  }, []);

  // Process video
  const handleProcessVideo = useCallback(async () => {
    if (!videoFile) {
      Alert.alert('Error', 'Please upload a video first');
      return;
    }

    try {
      setProcessing(true);
      setProgress(0);

      // Submit processing job
      const jobId = await backend.generateStories({
        topic: `Process video: ${videoName}`,
        platforms: ['youtube', 'tiktok', 'instagram'],
        style: 'educational',
        targetAudience: 'general',
        cta: 'Subscribe',
      });

      setActiveJob(jobId);

      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(processingSteps[i]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProgress(Math.round(((i + 1) / processingSteps.length) * 100));
      }

      // Mock scenes data
      const mockScenes: Scene[] = [
        {
          id: 'scene-1',
          startTime: 0,
          endTime: 300,
          duration: 300,
          title: 'Introduction',
          description: 'Video introduction and topic overview',
          keyMoments: 2,
          transcription: 'Welcome to this video about...',
        },
        {
          id: 'scene-2',
          startTime: 300,
          endTime: 900,
          duration: 600,
          title: 'Main Content',
          description: 'Core information and key points',
          keyMoments: 5,
          transcription: 'The main points are...',
        },
        {
          id: 'scene-3',
          startTime: 900,
          endTime: 1200,
          duration: 300,
          title: 'Conclusion',
          description: 'Summary and call to action',
          keyMoments: 1,
          transcription: 'Thank you for watching...',
        },
      ];

      setScenes(mockScenes);

      // Mock clips data
      const mockClips: Clip[] = [
        {
          id: 'clip-1',
          title: 'Hook - First 8 seconds',
          duration: 8,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-2',
          title: 'Key Moment 1',
          duration: 15,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-3',
          title: 'Key Moment 2',
          duration: 12,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-4',
          title: 'Key Moment 3',
          duration: 10,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-5',
          title: 'Key Moment 4',
          duration: 18,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-6',
          title: 'Key Moment 5',
          duration: 14,
          scenes: 1,
          status: 'ready',
        },
        {
          id: 'clip-7',
          title: 'Outro - Call to Action',
          duration: 8,
          scenes: 1,
          status: 'ready',
        },
      ];

      setClips(mockClips);

      Alert.alert('Success', 'Video processed successfully!');
      setActiveJob(null);
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process video');
    } finally {
      setProcessing(false);
    }
  }, [videoFile, videoName, backend]);

  // Scene card
  const renderSceneCard = ({ item }: { item: Scene }) => (
    <View className="mb-3 bg-surface rounded-lg p-4 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{item.title}</Text>
          <Text className="text-xs text-muted mt-1">{item.description}</Text>
        </View>
        <Text className="text-2xl">🎬</Text>
      </View>

      <View className="flex-row justify-between items-center mt-2 text-xs text-muted">
        <Text>Duration: {item.duration}s</Text>
        <Text>Key moments: {item.keyMoments}</Text>
      </View>

      <Text className="text-xs text-muted mt-2 line-clamp-2">
        {item.transcription}
      </Text>
    </View>
  );

  // Clip card
  const renderClipCard = ({ item }: { item: Clip }) => (
    <View className="mb-3 bg-primary/10 rounded-lg p-4 border border-primary">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{item.title}</Text>
          <Text className="text-xs text-muted mt-1">
            {item.duration}s • {item.scenes} scene
          </Text>
        </View>
        <Text className="text-2xl">✂️</Text>
      </View>

      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity className="flex-1 bg-primary rounded-lg py-2">
          <Text className="text-center text-white font-semibold text-sm">
            Preview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-primary/50 rounded-lg py-2">
          <Text className="text-center text-white font-semibold text-sm">
            Edit
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
            Autocut Studio
          </Text>
          <Text className="text-base text-muted">
            Transform 2h+ videos into 12 short-form clips automatically
          </Text>
        </View>

        {/* Upload Section */}
        {!videoFile ? (
          <View className="mb-6 bg-surface rounded-lg p-6 border-2 border-dashed border-border items-center">
            <Text className="text-4xl mb-3">📹</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">
              Upload Video
            </Text>
            <Text className="text-sm text-muted text-center mb-4">
              Select a long-form video (2 hours or more)
            </Text>
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-lg"
              onPress={handleUploadVideo}
              disabled={processing}
            >
              <Text className="text-white font-semibold">Choose Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row items-center gap-3">
              <Text className="text-3xl">✅</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {videoName}
                </Text>
                <Text className="text-xs text-muted">120 minutes</Text>
              </View>
              <TouchableOpacity onPress={() => setVideoFile(null)}>
                <Text className="text-lg">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Process Button */}
        <TouchableOpacity
          className={cn(
            'w-full rounded-lg py-4 mb-6',
            processing || !videoFile ? 'bg-primary/50' : 'bg-primary'
          )}
          onPress={handleProcessVideo}
          disabled={processing || !videoFile}
        >
          {processing ? (
            <View className="flex-row justify-center items-center gap-2">
              <ActivityIndicator color="white" />
              <View className="flex-1">
                <Text className="text-white font-bold">
                  {processingStep}
                </Text>
                <Text className="text-xs text-white/70">{progress}%</Text>
              </View>
            </View>
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Process Video
            </Text>
          )}
        </TouchableOpacity>

        {/* Progress Bar */}
        {processing && (
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

        {/* Scenes Section */}
        {scenes.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">
              Detected Scenes ({scenes.length})
            </Text>
            <FlatList
              data={scenes}
              renderItem={renderSceneCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Clips Section */}
        {clips.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-foreground">
                Generated Clips ({clips.length})
              </Text>
              <Text className="text-sm text-primary font-semibold">
                Ready to render
              </Text>
            </View>
            <FlatList
              data={clips}
              renderItem={renderClipCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State */}
        {!processing && scenes.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-4xl mb-4">🎞️</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">
              No clips yet
            </Text>
            <Text className="text-sm text-muted text-center">
              Upload a video and click "Process Video" to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
