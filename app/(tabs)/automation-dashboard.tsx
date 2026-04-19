/**
 * Automation System - Dashboard Screen
 * Real-time overview of automation system status
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface MetricData {
  activeWorkflows: number;
  successRate: number;
  pendingTasks: number;
  systemStatus: 'online' | 'offline';
  lastUpdate: string;
}

interface RecentExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  duration: string;
}

export default function AutomationDashboard() {
  const colors = useColors();
  const [metrics, setMetrics] = useState<MetricData>({
    activeWorkflows: 12,
    successRate: 94.5,
    pendingTasks: 3,
    systemStatus: 'online',
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([
    {
      id: '1',
      workflowName: 'Data Processing Pipeline',
      status: 'success',
      timestamp: '2 minutes ago',
      duration: '45s',
    },
    {
      id: '2',
      workflowName: 'Report Generation',
      status: 'running',
      timestamp: '5 minutes ago',
      duration: '2m 15s',
    },
    {
      id: '3',
      workflowName: 'API Integration',
      status: 'success',
      timestamp: '10 minutes ago',
      duration: '1m 30s',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(prev => ({
      ...prev,
      lastUpdate: new Date().toLocaleTimeString(),
    }));
    setLoading(false);
  };

  useEffect(() => {
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return colors.success;
      case 'failed':
        return colors.error;
      case 'running':
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getStatusBadgeStyle = (status: string) => ({
    backgroundColor: getStatusColor(status),
    opacity: 0.2,
  });

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
          <Text className="text-sm text-muted mt-1">
            Last updated: {metrics.lastUpdate}
          </Text>
        </View>

        {/* System Status */}
        <View className="px-4 pb-4">
          <View
            className="flex-row items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-1">
              <Text className="text-sm text-muted">System Status</Text>
              <Text className="text-lg font-semibold text-foreground mt-1">
                {metrics.systemStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </View>
            <View
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  metrics.systemStatus === 'online'
                    ? colors.success
                    : colors.error,
              }}
            />
          </View>
        </View>

        {/* Metric Cards */}
        <View className="px-4 pb-4">
          <View className="flex-row gap-3">
            {/* Active Workflows Card */}
            <View
              className="flex-1 p-4 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs text-muted font-medium">ACTIVE</Text>
              <Text className="text-2xl font-bold text-foreground mt-2">
                {metrics.activeWorkflows}
              </Text>
              <Text className="text-xs text-muted mt-1">Workflows</Text>
            </View>

            {/* Success Rate Card */}
            <View
              className="flex-1 p-4 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs text-muted font-medium">SUCCESS</Text>
              <Text className="text-2xl font-bold text-foreground mt-2">
                {metrics.successRate}%
              </Text>
              <Text className="text-xs text-muted mt-1">Success Rate</Text>
            </View>

            {/* Pending Tasks Card */}
            <View
              className="flex-1 p-4 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs text-muted font-medium">PENDING</Text>
              <Text className="text-2xl font-bold text-foreground mt-2">
                {metrics.pendingTasks}
              </Text>
              <Text className="text-xs text-muted mt-1">Tasks</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 pb-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 p-3 rounded-xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold text-center">
                New Workflow
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-3 rounded-xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold text-center">
                Analytics
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Executions */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Recent Executions
          </Text>

          {recentExecutions.map((execution) => (
            <TouchableOpacity
              key={execution.id}
              className="flex-row items-center p-4 rounded-xl mb-2"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  {execution.workflowName}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {execution.timestamp} • {execution.duration}
                </Text>
              </View>

              <View
                className="px-3 py-1 rounded-full"
                style={getStatusBadgeStyle(execution.status)}
              >
                <Text
                  className="text-xs font-semibold capitalize"
                  style={{ color: getStatusColor(execution.status) }}
                >
                  {execution.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
