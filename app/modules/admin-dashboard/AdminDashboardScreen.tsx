/**
 * Ghost Claw OS - Admin Dashboard
 * Monitoring, Analytics, System Health
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface SystemMetrics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  activeUsers: number;
  totalStories: number;
  totalAssets: number;
  storageUsed: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

interface JobStats {
  date: string;
  completed: number;
  failed: number;
  processing: number;
}

interface UserActivity {
  userId: string;
  username: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export default function AdminDashboardScreen() {
  const colors = useColors();

  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalJobs: 1250,
    completedJobs: 1180,
    failedJobs: 45,
    activeUsers: 234,
    totalStories: 567,
    totalAssets: 2345,
    storageUsed: 125.5,
    cpuUsage: 45,
    memoryUsage: 62,
    uptime: '45 days 12 hours',
  });

  const [jobStats, setJobStats] = useState<JobStats[]>([
    { date: '2026-04-18', completed: 45, failed: 2, processing: 5 },
    { date: '2026-04-17', completed: 52, failed: 3, processing: 0 },
    { date: '2026-04-16', completed: 48, failed: 1, processing: 0 },
    { date: '2026-04-15', completed: 55, failed: 4, processing: 0 },
    { date: '2026-04-14', completed: 50, failed: 2, processing: 0 },
  ]);

  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([
    {
      userId: 'user-001',
      username: 'John Doe',
      action: 'Generated story',
      timestamp: '2 minutes ago',
      status: 'success',
    },
    {
      userId: 'user-002',
      username: 'Jane Smith',
      action: 'Published to YouTube',
      timestamp: '5 minutes ago',
      status: 'success',
    },
    {
      userId: 'user-003',
      username: 'Bob Johnson',
      action: 'Autocut processing',
      timestamp: '8 minutes ago',
      status: 'success',
    },
    {
      userId: 'user-001',
      username: 'John Doe',
      action: 'Asset search',
      timestamp: '12 minutes ago',
      status: 'success',
    },
    {
      userId: 'user-004',
      username: 'Alice Brown',
      action: 'Render job failed',
      timestamp: '15 minutes ago',
      status: 'failed',
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Refresh metrics
  const handleRefreshMetrics = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  // Metric card
  const MetricCard = ({
    title,
    value,
    unit,
    icon,
    trend,
  }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: string;
    trend?: 'up' | 'down';
  }) => (
    <View className="bg-surface rounded-lg p-4 border border-border mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-sm text-muted">{title}</Text>
          <View className="flex-row items-baseline gap-1 mt-2">
            <Text className="text-2xl font-bold text-foreground">{value}</Text>
            {unit && <Text className="text-sm text-muted">{unit}</Text>}
          </View>
        </View>
        <Text className="text-3xl">{icon}</Text>
      </View>

      {trend && (
        <View className="flex-row items-center gap-1">
          <Text className={trend === 'up' ? 'text-success' : 'text-error'}>
            {trend === 'up' ? '📈' : '📉'}
          </Text>
          <Text
            className={cn(
              'text-xs font-semibold',
              trend === 'up' ? 'text-success' : 'text-error'
            )}
          >
            {trend === 'up' ? '+12%' : '-5%'} from yesterday
          </Text>
        </View>
      )}
    </View>
  );

  // Activity item
  const renderActivityItem = ({ item }: { item: UserActivity }) => (
    <View className="bg-surface rounded-lg p-3 mb-2 border border-border flex-row items-center gap-3">
      <View
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center',
          item.status === 'success' ? 'bg-success/20' : 'bg-error/20'
        )}
      >
        <Text className="text-lg">
          {item.status === 'success' ? '✅' : '❌'}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">
          {item.username}
        </Text>
        <Text className="text-xs text-muted">{item.action}</Text>
      </View>

      <Text className="text-xs text-muted">{item.timestamp}</Text>
    </View>
  );

  // Job stats item
  const renderJobStatItem = ({ item }: { item: JobStats }) => (
    <View className="bg-surface rounded-lg p-3 mb-2 border border-border">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold text-foreground">{item.date}</Text>
        <Text className="text-xs text-muted">
          {item.completed + item.failed + item.processing} total
        </Text>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <View className="bg-success/20 rounded-lg p-2 mb-1">
            <Text className="text-xs text-success font-semibold">
              ✅ {item.completed}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <View className="bg-error/20 rounded-lg p-2 mb-1">
            <Text className="text-xs text-error font-semibold">
              ❌ {item.failed}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <View className="bg-warning/20 rounded-lg p-2 mb-1">
            <Text className="text-xs text-warning font-semibold">
              ⏳ {item.processing}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </Text>
            <Text className="text-base text-muted mt-1">
              System monitoring & analytics
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg p-3"
            onPress={handleRefreshMetrics}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-xl">🔄</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            Key Metrics
          </Text>

          <MetricCard
            title="Total Jobs"
            value={metrics.totalJobs}
            icon="📊"
            trend="up"
          />
          <MetricCard
            title="Completed Jobs"
            value={metrics.completedJobs}
            icon="✅"
            trend="up"
          />
          <MetricCard
            title="Failed Jobs"
            value={metrics.failedJobs}
            icon="❌"
            trend="down"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers}
            icon="👥"
            trend="up"
          />
        </View>

        {/* System Health */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            System Health
          </Text>

          <View className="bg-surface rounded-lg p-4 border border-border mb-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-semibold text-foreground">
                CPU Usage
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {metrics.cpuUsage}%
              </Text>
            </View>
            <View className="w-full h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </View>
          </View>

          <View className="bg-surface rounded-lg p-4 border border-border mb-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-semibold text-foreground">
                Memory Usage
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {metrics.memoryUsage}%
              </Text>
            </View>
            <View className="w-full h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-warning"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </View>
          </View>

          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm text-muted">Uptime</Text>
            <Text className="text-2xl font-bold text-foreground mt-2">
              {metrics.uptime}
            </Text>
          </View>
        </View>

        {/* Job Statistics */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            Job Statistics (Last 5 Days)
          </Text>
          <FlatList
            data={jobStats}
            renderItem={renderJobStatItem}
            keyExtractor={(item) => item.date}
            scrollEnabled={false}
          />
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            Recent Activity
          </Text>
          <FlatList
            data={recentActivity}
            renderItem={renderActivityItem}
            keyExtractor={(item, index) => `${item.userId}-${index}`}
            scrollEnabled={false}
          />
        </View>

        {/* Content Stats */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            Content Statistics
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted mb-2">Total Stories</Text>
              <Text className="text-2xl font-bold text-foreground">
                {metrics.totalStories}
              </Text>
            </View>

            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted mb-2">Total Assets</Text>
              <Text className="text-2xl font-bold text-foreground">
                {metrics.totalAssets}
              </Text>
            </View>
          </View>

          <View className="mt-3 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm text-muted mb-2">Storage Used</Text>
            <Text className="text-2xl font-bold text-foreground mb-3">
              {metrics.storageUsed} GB
            </Text>
            <View className="w-full h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: '42%' }}
              />
            </View>
            <Text className="text-xs text-muted mt-2">
              42% of 300 GB quota used
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3">
            <Text className="text-center text-white font-semibold">
              View Logs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-primary/50 rounded-lg py-3">
            <Text className="text-center text-white font-semibold">
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
