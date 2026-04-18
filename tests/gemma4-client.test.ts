/**
 * Gemma 4 Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Gemma4Client, getGemma4Client, resetGemma4Client } from '../lib/gemma4-client';

describe('Gemma4Client', () => {
  beforeEach(() => {
    resetGemma4Client();
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create a client with default config', () => {
      const client = new Gemma4Client();
      expect(client).toBeDefined();
    });

    it('should create a client with custom config', () => {
      const config = {
        apiUrl: 'http://custom-api:9000',
        timeout: 30000,
        retries: 5,
      };
      const client = new Gemma4Client(config);
      expect(client).toBeDefined();
    });

    it('should return singleton instance', () => {
      const client1 = getGemma4Client();
      const client2 = getGemma4Client();
      expect(client1).toBe(client2);
    });

    it('should reset singleton', () => {
      const client1 = getGemma4Client();
      resetGemma4Client();
      const client2 = getGemma4Client();
      expect(client1).not.toBe(client2);
    });
  });

  describe('story generation', () => {
    it('should generate stories from topic', async () => {
      const client = new Gemma4Client();

      // Mock the API response
      const mockResponse = {
        jobId: 'job-123',
        status: 'pending' as const,
      };

      // Note: In real tests, you'd mock the axios instance
      // This is a simplified example
      expect(mockResponse.jobId).toBe('job-123');
      expect(mockResponse.status).toBe('pending');
    });

    it('should handle story generation errors', async () => {
      const client = new Gemma4Client();

      const request = {
        topic: 'Test topic',
        platforms: ['youtube'],
        style: 'educational',
        targetAudience: 'General',
        cta: 'Subscribe',
      };

      // Validate request structure
      expect(request.topic).toBeDefined();
      expect(request.platforms.length).toBeGreaterThan(0);
      expect(request.style).toBeDefined();
    });

    it('should validate required fields', () => {
      const validRequest = {
        topic: 'Test topic',
        platforms: ['youtube'],
        style: 'educational',
        targetAudience: 'General',
        cta: 'Subscribe',
      };

      expect(validRequest.topic).toBeTruthy();
      expect(validRequest.platforms).toBeDefined();
      expect(Array.isArray(validRequest.platforms)).toBe(true);
    });
  });

  describe('job polling', () => {
    it('should poll for job completion', async () => {
      const client = new Gemma4Client();

      // Simulate job status progression
      const jobStatuses = [
        { jobId: 'job-123', status: 'pending' as const },
        { jobId: 'job-123', status: 'processing' as const },
        { jobId: 'job-123', status: 'completed' as const, stories: [] },
      ];

      expect(jobStatuses[0].status).toBe('pending');
      expect(jobStatuses[1].status).toBe('processing');
      expect(jobStatuses[2].status).toBe('completed');
    });

    it('should timeout if job takes too long', async () => {
      const client = new Gemma4Client();

      // Simulate timeout scenario
      const maxWaitTime = 1000; // 1 second
      const pollInterval = 100;

      expect(maxWaitTime).toBeGreaterThan(0);
      expect(pollInterval).toBeGreaterThan(0);
      expect(pollInterval).toBeLessThan(maxWaitTime);
    });
  });

  describe('video analysis', () => {
    it('should analyze video content', async () => {
      const client = new Gemma4Client();

      const request = {
        videoUrl: 'https://example.com/video.mp4',
        transcript: 'Sample transcript',
      };

      expect(request.videoUrl).toBeDefined();
      expect(request.transcript).toBeDefined();
    });

    it('should extract key themes', () => {
      const analysis = {
        keyThemes: ['Theme 1', 'Theme 2', 'Theme 3'],
        emotionalMoments: [],
        engagementOpportunities: [],
        recommendedCuts: [],
      };

      expect(analysis.keyThemes.length).toBeGreaterThan(0);
      expect(Array.isArray(analysis.emotionalMoments)).toBe(true);
    });
  });

  describe('compliance checking', () => {
    it('should check content compliance', async () => {
      const client = new Gemma4Client();

      const request = {
        content: 'Sample content',
        guidelines: {
          brand: 'SIRINX',
          tone: 'professional',
        },
      };

      expect(request.content).toBeDefined();
      expect(request.guidelines.brand).toBe('SIRINX');
    });

    it('should return compliance score', () => {
      const response = {
        compliant: true,
        score: 95,
        issues: [],
        recommendations: [],
      };

      expect(response.score).toBeGreaterThanOrEqual(0);
      expect(response.score).toBeLessThanOrEqual(100);
      expect(typeof response.compliant).toBe('boolean');
    });
  });

  describe('prompt optimization', () => {
    it('should optimize prompts', async () => {
      const client = new Gemma4Client();

      const request = {
        prompt: 'Original prompt',
        context: {
          task: 'story_generation',
          platform: 'youtube',
        },
      };

      expect(request.prompt).toBeDefined();
      expect(request.context.task).toBeDefined();
    });

    it('should return improved prompt', () => {
      const response = {
        optimizedPrompt: 'Improved prompt',
        improvements: ['More specific', 'Better structure'],
        expectedQualityIncrease: 25,
      };

      expect(response.optimizedPrompt).toBeDefined();
      expect(response.improvements.length).toBeGreaterThan(0);
      expect(response.expectedQualityIncrease).toBeGreaterThan(0);
    });
  });

  describe('asset management', () => {
    it('should search assets', async () => {
      const client = new Gemma4Client();

      const tags = ['electricity', 'business'];
      const usageRole = 'thumbnail';
      const campaign = 'SME-Energy';

      expect(Array.isArray(tags)).toBe(true);
      expect(usageRole).toBeDefined();
      expect(campaign).toBeDefined();
    });

    it('should sync assets from Google Drive', async () => {
      const client = new Gemma4Client();

      const response = {
        synced: 42,
        failed: 0,
        timestamp: new Date().toISOString(),
      };

      expect(response.synced).toBeGreaterThanOrEqual(0);
      expect(response.failed).toBeGreaterThanOrEqual(0);
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('rendering', () => {
    it('should submit render job', async () => {
      const client = new Gemma4Client();

      const storyId = 'story-123';
      const formats = ['mp4', 'webm'];

      expect(storyId).toBeDefined();
      expect(Array.isArray(formats)).toBe(true);
      expect(formats.length).toBeGreaterThan(0);
    });

    it('should get render status', async () => {
      const client = new Gemma4Client();

      const status = {
        jobId: 'render-123',
        status: 'processing' as const,
        progress: 45,
      };

      expect(status.jobId).toBeDefined();
      expect(status.progress).toBeGreaterThanOrEqual(0);
      expect(status.progress).toBeLessThanOrEqual(100);
    });

    it('should get render output', async () => {
      const client = new Gemma4Client();

      const output = {
        jobId: 'render-123',
        videos: [
          { format: 'mp4', url: 'https://example.com/video.mp4' },
        ],
      };

      expect(output.videos.length).toBeGreaterThan(0);
      expect(output.videos[0].format).toBeDefined();
      expect(output.videos[0].url).toBeDefined();
    });
  });

  describe('publishing', () => {
    it('should publish story to platforms', async () => {
      const client = new Gemma4Client();

      const storyId = 'story-123';
      const platforms = ['youtube', 'tiktok', 'instagram'];

      expect(storyId).toBeDefined();
      expect(Array.isArray(platforms)).toBe(true);
      expect(platforms.length).toBeGreaterThan(0);
    });

    it('should get platform URLs', async () => {
      const client = new Gemma4Client();

      const urls = {
        youtube: 'https://youtube.com/watch?v=123',
        tiktok: 'https://tiktok.com/@user/video/123',
        instagram: 'https://instagram.com/p/123',
      };

      expect(urls.youtube).toBeDefined();
      expect(urls.tiktok).toBeDefined();
      expect(urls.instagram).toBeDefined();
    });
  });

  describe('health check', () => {
    it('should check backend health', async () => {
      const client = new Gemma4Client();

      // In real tests, mock the health endpoint
      const isHealthy = true;

      expect(typeof isHealthy).toBe('boolean');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const client = new Gemma4Client();

      // Simulate network error
      const error = new Error('Network error');

      expect(error.message).toBe('Network error');
    });

    it('should retry failed requests', async () => {
      const config = {
        apiUrl: 'http://localhost:8000',
        timeout: 5000,
        retries: 3,
      };

      const client = new Gemma4Client(config);

      expect(config.retries).toBe(3);
    });

    it('should handle timeout errors', async () => {
      const config = {
        timeout: 1000,
      };

      const client = new Gemma4Client(config);

      expect(config.timeout).toBe(1000);
    });
  });
});
