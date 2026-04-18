/**
 * Ghost Claw OS - Mobile App Gemma 4 Client
 * Connects to Gemma 4 backend for AI operations
 */

import axios, { AxiosInstance } from 'axios';

interface GemmaConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

interface StoryGenerationRequest {
  topic: string;
  platforms: string[];
  style: string;
  targetAudience: string;
  cta: string;
}

interface StoryGenerationResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stories?: Story[];
  error?: string;
}

interface Story {
  id: string;
  title: string;
  angle: string;
  hook: string;
  problem: string;
  agitate: string;
  solve: string;
  cta: string;
  duration: number;
  voiceoverScript: string;
  visualConcept: VisualConcept;
  onScreenText: string[];
  imagePrompts: string[];
  videoPrompts: string[];
  platformVariants: Record<string, PlatformVariant>;
}

interface VisualConcept {
  style: string;
  colorPalette: string[];
  scenes: Scene[];
  transitions: string[];
  graphics: string[];
}

interface Scene {
  name: string;
  duration: number;
  camera: string;
  elements: string[];
}

interface PlatformVariant {
  aspectRatio: string;
  duration: string;
  hashtags: string[];
  postingTime: string;
  engagementTactics: string[];
}

interface VideoAnalysisRequest {
  videoUrl: string;
  transcript: string;
}

interface VideoAnalysisResponse {
  keyThemes: string[];
  emotionalMoments: EmotionalMoment[];
  engagementOpportunities: string[];
  recommendedCuts: Cut[];
}

interface EmotionalMoment {
  timestamp: number;
  description: string;
  intensity: number;
}

interface Cut {
  startTime: number;
  endTime: number;
  reason: string;
  priority: number;
}

interface ComplianceCheckRequest {
  content: string;
  guidelines: Record<string, any>;
}

interface ComplianceCheckResponse {
  compliant: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}

interface PromptOptimizationRequest {
  prompt: string;
  context: Record<string, any>;
}

interface PromptOptimizationResponse {
  optimizedPrompt: string;
  improvements: string[];
  expectedQualityIncrease: number;
}

/**
 * Gemma 4 Client for Mobile App
 */
export class Gemma4Client {
  private client: AxiosInstance;
  private config: GemmaConfig;

  constructor(config: Partial<GemmaConfig> = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'http://localhost:8000',
      timeout: config.timeout || 60000,
      retries: config.retries || 3,
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add retry interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config || !config.retry) {
          config.retry = 0;
        }

        config.retry += 1;

        if (config.retry <= this.config.retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * config.retry)
          );
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate stories from topic
   */
  async generateStories(
    request: StoryGenerationRequest
  ): Promise<StoryGenerationResponse> {
    try {
      const response = await this.client.post<StoryGenerationResponse>(
        '/api/stories/generate',
        {
          topic: request.topic,
          platforms: request.platforms,
          style: request.style,
          target_audience: request.targetAudience,
          cta: request.cta,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Story generation error:', error);
      throw error;
    }
  }

  /**
   * Get story generation job status
   */
  async getJobStatus(jobId: string): Promise<StoryGenerationResponse> {
    try {
      const response = await this.client.get<StoryGenerationResponse>(
        `/api/jobs/${jobId}/status`
      );

      return response.data;
    } catch (error) {
      console.error('Job status error:', error);
      throw error;
    }
  }

  /**
   * Poll for job completion
   */
  async waitForCompletion(
    jobId: string,
    maxWaitTime: number = 300000,
    pollInterval: number = 2000
  ): Promise<StoryGenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Job ${jobId} did not complete within ${maxWaitTime}ms`);
  }

  /**
   * Analyze video content
   */
  async analyzeVideo(
    request: VideoAnalysisRequest
  ): Promise<VideoAnalysisResponse> {
    try {
      const response = await this.client.post<VideoAnalysisResponse>(
        '/api/videos/analyze',
        {
          video_url: request.videoUrl,
          transcript: request.transcript,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Video analysis error:', error);
      throw error;
    }
  }

  /**
   * Check compliance
   */
  async checkCompliance(
    request: ComplianceCheckRequest
  ): Promise<ComplianceCheckResponse> {
    try {
      const response = await this.client.post<ComplianceCheckResponse>(
        '/api/review/check',
        {
          content: request.content,
          guidelines: request.guidelines,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Compliance check error:', error);
      throw error;
    }
  }

  /**
   * Optimize prompt
   */
  async optimizePrompt(
    request: PromptOptimizationRequest
  ): Promise<PromptOptimizationResponse> {
    try {
      const response = await this.client.post<PromptOptimizationResponse>(
        '/api/prompts/optimize',
        {
          prompt: request.prompt,
          context: request.context,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Prompt optimization error:', error);
      throw error;
    }
  }

  /**
   * Submit render job
   */
  async submitRender(storyId: string, formats: string[]): Promise<any> {
    try {
      const response = await this.client.post('/api/render/submit', {
        story_id: storyId,
        formats,
      });

      return response.data;
    } catch (error) {
      console.error('Render submission error:', error);
      throw error;
    }
  }

  /**
   * Get render status
   */
  async getRenderStatus(jobId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/render/${jobId}/status`);
      return response.data;
    } catch (error) {
      console.error('Render status error:', error);
      throw error;
    }
  }

  /**
   * Get render output
   */
  async getRenderOutput(jobId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/render/${jobId}/output`);
      return response.data;
    } catch (error) {
      console.error('Render output error:', error);
      throw error;
    }
  }

  /**
   * Search assets
   */
  async searchAssets(
    tags?: string[],
    usageRole?: string,
    campaign?: string
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams();

      if (tags && tags.length > 0) {
        params.append('tags', tags.join(','));
      }
      if (usageRole) {
        params.append('usage_role', usageRole);
      }
      if (campaign) {
        params.append('campaign', campaign);
      }

      const response = await this.client.get('/api/assets/search', { params });
      return response.data;
    } catch (error) {
      console.error('Asset search error:', error);
      throw error;
    }
  }

  /**
   * Sync assets from Google Drive
   */
  async syncAssets(): Promise<any> {
    try {
      const response = await this.client.post('/api/assets/sync');
      return response.data;
    } catch (error) {
      console.error('Asset sync error:', error);
      throw error;
    }
  }

  /**
   * Publish story
   */
  async publishStory(storyId: string, platforms: string[]): Promise<any> {
    try {
      const response = await this.client.post('/api/publish/release', {
        story_id: storyId,
        platforms,
      });

      return response.data;
    } catch (error) {
      console.error('Publish error:', error);
      throw error;
    }
  }

  /**
   * Get publish status
   */
  async getPublishStatus(releaseId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/publish/${releaseId}`);
      return response.data;
    } catch (error) {
      console.error('Publish status error:', error);
      throw error;
    }
  }

  /**
   * Get platform URLs
   */
  async getPlatformUrls(releaseId: string): Promise<Record<string, string>> {
    try {
      const response = await this.client.get(`/api/publish/${releaseId}/urls`);
      return response.data;
    } catch (error) {
      console.error('Platform URLs error:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }
}

// Export singleton instance
let gemma4Client: Gemma4Client | null = null;

export function getGemma4Client(config?: Partial<GemmaConfig>): Gemma4Client {
  if (!gemma4Client) {
    gemma4Client = new Gemma4Client(config);
  }
  return gemma4Client;
}

export function resetGemma4Client(): void {
  gemma4Client = null;
}
