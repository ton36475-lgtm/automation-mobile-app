/**
 * Automation System API Client
 * Handles all API communication with the backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  code: string;
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  createdAt: string;
  updatedAt: string;
  owner_id: string;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  started_at: string;
  completed_at: string;
  duration: number;
  error_message?: string;
}

interface Metrics {
  activeWorkflows: number;
  successRate: number;
  pendingTasks: number;
  totalExecutions: number;
  failedExecutions: number;
}

interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

class AutomationApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async login(email: string, password: string): Promise<AuthToken> {
    try {
      const response = await this.client.post<ApiResponse<AuthToken>>(
        '/api/v1/auth/login',
        { email, password }
      );

      const { data: token } = response.data;
      this.token = token.access_token;

      // Store tokens
      await AsyncStorage.setItem('auth_token', token.access_token);
      await AsyncStorage.setItem('refresh_token', token.refresh_token);

      return token;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/v1/auth/logout');
      this.token = null;
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<AuthToken> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post<ApiResponse<AuthToken>>(
        '/api/v1/auth/refresh',
        { refresh_token: refreshToken }
      );

      const { data: token } = response.data;
      this.token = token.access_token;

      await AsyncStorage.setItem('auth_token', token.access_token);
      await AsyncStorage.setItem('refresh_token', token.refresh_token);

      return token;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // WORKFLOWS
  // ============================================================================

  async getWorkflows(): Promise<Workflow[]> {
    try {
      const response = await this.client.get<ApiResponse<Workflow[]>>(
        '/api/v1/workflows'
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await this.client.get<ApiResponse<Workflow>>(
        `/api/v1/workflows/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const response = await this.client.post<ApiResponse<Workflow>>(
        '/api/v1/workflows',
        workflow
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const response = await this.client.put<ApiResponse<Workflow>>(
        `/api/v1/workflows/${id}`,
        workflow
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/workflows/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async executeWorkflow(id: string): Promise<WorkflowExecution> {
    try {
      const response = await this.client.post<ApiResponse<WorkflowExecution>>(
        `/api/v1/workflows/${id}/execute`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // EXECUTIONS
  // ============================================================================

  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    try {
      const params = workflowId ? { workflow_id: workflowId } : {};
      const response = await this.client.get<ApiResponse<WorkflowExecution[]>>(
        '/api/v1/executions',
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getExecution(id: string): Promise<WorkflowExecution> {
    try {
      const response = await this.client.get<ApiResponse<WorkflowExecution>>(
        `/api/v1/executions/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  async getMetrics(): Promise<Metrics> {
    try {
      const response = await this.client.get<ApiResponse<Metrics>>(
        '/api/v1/analytics/metrics'
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTrends(timeRange: '24h' | '7d' | '30d' = '24h'): Promise<any[]> {
    try {
      const response = await this.client.get<ApiResponse<any[]>>(
        '/api/v1/analytics/trends',
        { params: { time_range: timeRange } }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getEvents(limit: number = 50): Promise<any[]> {
    try {
      const response = await this.client.get<ApiResponse<any[]>>(
        '/api/v1/analytics/events',
        { params: { limit } }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // GITHUB INTEGRATION
  // ============================================================================

  async authorizeGitHub(code: string): Promise<any> {
    try {
      const response = await this.client.post<ApiResponse<any>>(
        '/api/v1/github/authorize',
        { code }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGitHubRepositories(): Promise<any[]> {
    try {
      const response = await this.client.get<ApiResponse<any[]>>(
        '/api/v1/github/repositories'
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGitHubUser(): Promise<any> {
    try {
      const response = await this.client.get<ApiResponse<any>>(
        '/api/v1/github/user'
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await this.client.get<{ status: string }>(
        '/health'
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      if (apiError?.error?.message) {
        return new Error(apiError.error.message);
      }
      return new Error(error.message || 'API request failed');
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

// Export singleton instance
export const automationApi = new AutomationApiClient();

// Export types
export type { Workflow, WorkflowExecution, Metrics, AuthToken, ApiResponse, ApiError };
