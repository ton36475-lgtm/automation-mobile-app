/**
 * Ghost Claw OS - Render Queue Module
 * Manage and monitor rendering jobs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ProgressBarAndroid,
  Platform,
} from 'react-native';

// Fallback for ProgressViewIOS
const ProgressViewIOS = Platform.OS === 'ios' ? require('react-native').ProgressViewIOS : ProgressBarAndroid;
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface RenderJob {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  estimatedTime: string;
  format: 'mp4' | 'webm' | 'mov';
  resolution: '720p' | '1080p' | '4k';
  size?: string;
  error?: string;
}

export default function RenderQueueScreen() {
  const colors = useColors();

  const [jobs, setJobs] = useState<RenderJob[]>([
    {
      id: 'job-1',
      name: 'Story Pack - Solar SME',
      status: 'processing',
      progress: 65,
      createdAt: '2026-04-18 10:30',
      estimatedTime: '5 minutes',
      format: 'mp4',
      resolution: '1080p',
    },
    {
      id: 'job-2',
      name: 'Autocut - Long Form Video',
      status: 'queued',
      progress: 0,
      createdAt: '2026-04-18 10:25',
      estimatedTime: '12 minutes',
      format: 'mp4',
      resolution: '1080p',
    },
    {
      id: 'job-3',
      name: 'Story Pack - Marketing',
      status: 'completed',
      progress: 100,
      createdAt: '2026-04-18 09:45',
      estimatedTime: '8 minutes',
      format: 'mp4',
      resolution: '1080p',
      size: '245 MB',
    },
    {
      id: 'job-4',
      name: 'Autocut - Tutorial',
      status: 'failed',
      progress: 45,
      createdAt: '2026-04-18 09:30',
      estimatedTime: '10 minutes',
      format: 'mp4',
      resolution: '1080p',
      error: 'Insufficient disk space',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Simulate progress update
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === 'processing' && job.progress < 100) {
            return {
              ...job,
              progress: Math.min(job.progress + Math.random() * 10, 100),
            };
          }
          return job;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-warning';
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'queued':
        return 'text-muted';
      default:
        return 'text-foreground';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'queued':
        return '📋';
      default:
        return '📹';
    }
  };

  // Render job card
  const renderJobCard = ({ item }: { item: RenderJob }) => (
    <TouchableOpacity
      onPress={() => setSelectedJob(selectedJob === item.id ? null : item.id)}
      className={cn(
        'mb-3 bg-surface rounded-lg p-4 border',
        selectedJob === item.id ? 'border-primary' : 'border-border'
      )}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-2xl">{getStatusIcon(item.status)}</Text>
            <Text className="text-base font-bold text-foreground flex-1">
              {item.name}
            </Text>
          </View>
          <Text className="text-xs text-muted">
            {item.format.toUpperCase()} • {item.resolution} • {item.createdAt}
          </Text>
        </View>
        <Text className={cn('text-sm font-semibold', getStatusColor(item.status))}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      {/* Progress Bar */}
      {(item.status === 'processing' || item.status === 'queued') && (
        <View className="mb-3">
          {Platform.OS === 'ios' ? (
            <ProgressViewIOS
              value={item.progress / 100}
              progressTintColor={colors.primary}
              style={{ height: 8, borderRadius: 4 }}
            />
          ) : (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={item.progress / 100}
              color={colors.primary}
            />
          )}
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-muted">{item.progress.toFixed(0)}%</Text>
            <Text className="text-xs text-muted">ETA: {item.estimatedTime}</Text>
          </View>
        </View>
      )}

      {/* Completed Info */}
      {item.status === 'completed' && item.size && (
        <View className="mb-3 bg-success/10 rounded-lg p-2">
          <Text className="text-xs text-success font-semibold">
            ✅ Completed • Size: {item.size}
          </Text>
        </View>
      )}

      {/* Error Info */}
      {item.status === 'failed' && item.error && (
        <View className="mb-3 bg-error/10 rounded-lg p-2">
          <Text className="text-xs text-error font-semibold">
            ❌ Error: {item.error}
          </Text>
        </View>
      )}

      {/* Expanded Details */}
      {selectedJob === item.id && (
        <View className="mt-3 pt-3 border-t border-border">
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-muted">Job ID</Text>
            <Text className="text-xs font-mono text-foreground">{item.id}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-muted">Format</Text>
            <Text className="text-xs font-semibold text-foreground">
              {item.format.toUpperCase()}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-muted">Resolution</Text>
            <Text className="text-xs font-semibold text-foreground">
              {item.resolution}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">Created</Text>
            <Text className="text-xs font-semibold text-foreground">
              {item.createdAt}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mt-3">
            {item.status === 'completed' && (
              <>
                <TouchableOpacity className="flex-1 bg-primary rounded-lg py-2">
                  <Text className="text-center text-white text-xs font-semibold">
                    Download
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-primary/50 rounded-lg py-2">
                  <Text className="text-center text-white text-xs font-semibold">
                    Share
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {item.status === 'failed' && (
              <TouchableOpacity className="flex-1 bg-primary rounded-lg py-2">
                <Text className="text-center text-white text-xs font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            )}
            {(item.status === 'processing' || item.status === 'queued') && (
              <TouchableOpacity className="flex-1 bg-error/20 rounded-lg py-2">
                <Text className="text-center text-error text-xs font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  // Stats
  const stats = {
    total: jobs.length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Render Queue
          </Text>
          <Text className="text-base text-muted">
            Monitor and manage rendering jobs
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
            <Text className="text-2xl font-bold text-foreground">{stats.total}</Text>
            <Text className="text-xs text-muted">Total Jobs</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
            <Text className="text-2xl font-bold text-warning">{stats.processing}</Text>
            <Text className="text-xs text-muted">Processing</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
            <Text className="text-2xl font-bold text-success">{stats.completed}</Text>
            <Text className="text-xs text-muted">Completed</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-3 border border-border">
            <Text className="text-2xl font-bold text-error">{stats.failed}</Text>
            <Text className="text-xs text-muted">Failed</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row gap-2 mb-6">
          {(['all', 'processing', 'completed', 'failed'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full',
                filter === f ? 'bg-primary' : 'bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold capitalize',
                  filter === f ? 'text-white' : 'text-foreground'
                )}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <FlatList
            data={filteredJobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-3xl mb-2">📭</Text>
            <Text className="text-base font-semibold text-foreground">
              No {filter} jobs
            </Text>
            <Text className="text-sm text-muted">
              Create a new rendering job to get started
            </Text>
          </View>
        )}

        {/* Create Job Button */}
        <TouchableOpacity className="w-full bg-primary rounded-lg py-3 mt-6 mb-6">
          <Text className="text-center text-white font-bold">
            Create Render Job
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
