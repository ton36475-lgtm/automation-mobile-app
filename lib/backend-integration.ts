/**
 * Ghost Claw OS - Mobile App Backend Integration
 * Connects mobile app to Ghost Claw OS backend services
 */

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface BackendConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  offlineMode: boolean;
}

export interface StoryGenerationRequest {
  topic: string;
  platforms: string[];
  style: string;
  targetAudience: string;
  cta: string;
  projectId?: string;
}

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  stories?: any[];
  error?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  tags: string[];
  usageRole: string;
  campaign: string;
  driveUrl: string;
}

// Default configuration
const DEFAULT_CONFIG: BackendConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retries: 3,
  offlineMode: false,
};

/**
 * Backend Integration Service
 * Handles all communication with Ghost Claw OS backend
 */
export class BackendIntegration {
  private api: AxiosInstance;
  private config: BackendConfig;
  private jobCache: Map<string, JobStatus> = new Map();
  private assetCache: Asset[] = [];
  private lastSyncTime: number = 0;

  constructor(config: Partial<BackendConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.api = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Ghost-Claw-Mobile/1.0',
      },
    });

    // Add retry logic
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config || !config.retry) {
          config.retry = 0;
        }

        config.retry += 1;

        if (config.retry <= this.config.retries) {
          await this.delay(1000 * config.retry);
          return this.api(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Generate stories from topic
   */
  async generateStories(request: StoryGenerationRequest): Promise<string> {
    try {
      const response = await this.api.post('/api/stories/generate', request);
      const jobId = response.data.job_id;

      // Cache job
      this.jobCache.set(jobId, {
        jobId,
        status: 'pending',
        progress: 0,
      });

      // Save to local storage
      await this.saveJobToStorage(jobId);

      return jobId;
    } catch (error) {
      console.error('Story generation failed:', error);
      throw error;
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    try {
      // Check cache first
      if (this.jobCache.has(jobId)) {
        return this.jobCache.get(jobId)!;
      }

      // Fetch from backend
      const response = await this.api.get(`/api/stories/jobs/${jobId}/status`);
      const status = response.data as JobStatus;

      // Update cache
      this.jobCache.set(jobId, status);

      return status;
    } catch (error) {
      console.error('Failed to get job status:', error);
      throw error;
    }
  }

  /**
   * Poll job until completion
   */
  async pollJob(
    jobId: string,
    interval: number = 2000,
    maxWait: number = 3600000 // 1 hour
  ): Promise<JobStatus> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await this.delay(interval);
    }

    throw new Error(`Job ${jobId} timeout after ${maxWait}ms`);
  }

  /**
   * List all jobs
   */
  async listJobs(
    status?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<any> {
    try {
      const params: any = { limit, offset };
      if (status) {
        params.status = status;
      }

      const response = await this.api.get('/api/stories/jobs', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to list jobs:', error);
      throw error;
    }
  }

  /**
   * Search assets
   */
  async searchAssets(
    tags: string[],
    usageRole: string,
    campaign: string
  ): Promise<Asset[]> {
    try {
      const response = await this.api.get('/api/assets/search', {
        params: {
          tags: tags.join(','),
          usage_role: usageRole,
          campaign,
        },
      });

      const assets = response.data.assets as Asset[];

      // Update cache
      this.assetCache = assets;
      this.lastSyncTime = Date.now();

      // Save to storage
      await AsyncStorage.setItem(
        'assetCache',
        JSON.stringify({
          assets,
          timestamp: this.lastSyncTime,
        })
      );

      return assets;
    } catch (error) {
      console.error('Asset search failed:', error);
      // Return cached assets on error
      return this.assetCache;
    }
  }

  /**
   * Sync assets from Google Drive
   */
  async syncAssets(): Promise<{ synced: number; failed: number }> {
    try {
      const response = await this.api.post('/api/assets/sync');
      return response.data;
    } catch (error) {
      console.error('Asset sync failed:', error);
      throw error;
    }
  }

  /**
   * Generate prompt with Gemma 4
   */
  async generatePrompt(
    context: string,
    task: string,
    platform: string
  ): Promise<string> {
    try {
      const response = await this.api.post('/api/prompts/generate', {
        context,
        task,
        platform,
      });

      return response.data.prompt;
    } catch (error) {
      console.error('Prompt generation failed:', error);
      throw error;
    }
  }

  /**
   * Optimize prompt
   */
  async optimizePrompt(prompt: string, task: string): Promise<string> {
    try {
      const response = await this.api.post('/api/prompts/optimize', {
        prompt,
        task,
      });

      return response.data.optimized_prompt;
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      throw error;
    }
  }

  /**
   * Submit render job
   */
  async submitRenderJob(
    storyId: string,
    formats: string[]
  ): Promise<string> {
    try {
      const response = await this.api.post('/api/render/submit', {
        story_id: storyId,
        formats,
      });

      return response.data.job_id;
    } catch (error) {
      console.error('Render submission failed:', error);
      throw error;
    }
  }

  /**
   * Get render status
   */
  async getRenderStatus(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/render/jobs/${jobId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get render status:', error);
      throw error;
    }
  }

  /**
   * Get render output
   */
  async getRenderOutput(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/render/jobs/${jobId}/output`);
      return response.data;
    } catch (error) {
      console.error('Failed to get render output:', error);
      throw error;
    }
  }

  /**
   * Publish story
   */
  async publishStory(
    storyId: string,
    platforms: string[]
  ): Promise<any> {
    try {
      const response = await this.api.post('/api/publish/story', {
        story_id: storyId,
        platforms,
      });

      return response.data;
    } catch (error) {
      console.error('Story publishing failed:', error);
      throw error;
    }
  }

  /**
   * Check compliance
   */
  async checkCompliance(
    content: string,
    guidelines: any
  ): Promise<any> {
    try {
      const response = await this.api.post('/api/review/compliance', {
        content,
        guidelines,
      });

      return response.data;
    } catch (error) {
      console.error('Compliance check failed:', error);
      throw error;
    }
  }

  /**
   * Get project details
   */
  async getProject(projectId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get project:', error);
      throw error;
    }
  }

  /**
   * Create project
   */
  async createProject(data: any): Promise<string> {
    try {
      const response = await this.api.post('/api/projects', data);
      return response.data.project_id;
    } catch (error) {
      console.error('Project creation failed:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, data: any): Promise<void> {
    try {
      await this.api.put(`/api/projects/${projectId}`, data);
    } catch (error) {
      console.error('Project update failed:', error);
      throw error;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      await this.api.delete(`/api/projects/${projectId}`);
    } catch (error) {
      console.error('Project deletion failed:', error);
      throw error;
    }
  }

  /**
   * Get analytics
   */
  async getAnalytics(projectId: string, period: string = '7d'): Promise<any> {
    try {
      const response = await this.api.get(
        `/api/analytics/projects/${projectId}`,
        {
          params: { period },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  /**
   * Save job to local storage
   */
  private async saveJobToStorage(jobId: string): Promise<void> {
    try {
      const jobs = await AsyncStorage.getItem('jobs');
      const jobsList = jobs ? JSON.parse(jobs) : [];

      if (!jobsList.includes(jobId)) {
        jobsList.push(jobId);
        await AsyncStorage.setItem('jobs', JSON.stringify(jobsList));
      }
    } catch (error) {
      console.error('Failed to save job to storage:', error);
    }
  }

  /**
   * Load jobs from local storage
   */
  async loadJobsFromStorage(): Promise<string[]> {
    try {
      const jobs = await AsyncStorage.getItem('jobs');
      return jobs ? JSON.parse(jobs) : [];
    } catch (error) {
      console.error('Failed to load jobs from storage:', error);
      return [];
    }
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Set offline mode
   */
  setOfflineMode(offline: boolean): void {
    this.config.offlineMode = offline;
  }

  /**
   * Get offline mode status
   */
  isOfflineMode(): boolean {
    return this.config.offlineMode;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.jobCache.clear();
    this.assetCache = [];
    this.lastSyncTime = 0;
  }
}

// Singleton instance
let instance: BackendIntegration | null = null;

export function getBackendIntegration(
  config?: Partial<BackendConfig>
): BackendIntegration {
  if (!instance) {
    instance = new BackendIntegration(config);
  }
  return instance;
}

export function resetBackendIntegration(): void {
  instance = null;
}
