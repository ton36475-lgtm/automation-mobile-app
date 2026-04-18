# Ghost Claw OS - Mobile App Integration Guide

**Version:** 1.0  
**Status:** Production-Ready  
**Last Updated:** April 18, 2026

---

## 🔗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Mobile App (React Native)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  UI Modules (11 features)                        │  │
│  │  - Story Engine                                  │  │
│  │  - Autocut Studio                               │  │
│  │  - Asset Library                                │  │
│  │  - Prompt Lab                                   │  │
│  │  - Render Queue                                 │  │
│  │  - Review Gate                                  │  │
│  │  - Release Center                               │  │
│  │  - Watch Center                                 │  │
│  │  - Dashboard                                    │  │
│  │  - Projects                                     │  │
│  │  - Settings                                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Backend Integration Layer                       │  │
│  │  - Gemma 4 Client                               │  │
│  │  - Backend Integration Service                  │  │
│  │  - Offline-First Architecture                   │  │
│  │  - Local Storage (AsyncStorage)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         Ghost Claw OS Backend (FastAPI/NestJS)         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Endpoints                                   │  │
│  │  - /api/stories/*                               │  │
│  │  - /api/videos/*                                │  │
│  │  - /api/assets/*                                │  │
│  │  - /api/prompts/*                               │  │
│  │  - /api/render/*                                │  │
│  │  - /api/publish/*                               │  │
│  │  - /api/review/*                                │  │
│  │  - /api/projects/*                              │  │
│  │  - /api/analytics/*                             │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ML Workers (Gemma 4)                            │  │
│  │  - Story Generation                             │  │
│  │  - Video Processing                             │  │
│  │  - Scene Detection                              │  │
│  │  - Rendering                                    │  │
│  │  - Publishing                                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Layer                                      │  │
│  │  - PostgreSQL Database                          │  │
│  │  - Redis Cache                                  │  │
│  │  - MinIO Storage                                │  │
│  │  - Google Drive Integration                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile App Setup

### **1. Environment Configuration**

Create `.env.local` in project root:

```bash
# Backend API
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_API_TIMEOUT=30000

# Gemma 4
EXPO_PUBLIC_GEMMA_MODEL=gemma-7b
EXPO_PUBLIC_GEMMA_MODE=local

# Google Drive
EXPO_PUBLIC_GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Analytics
EXPO_PUBLIC_POSTHOG_KEY=your-posthog-key
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### **2. Initialize Backend Integration**

In your app's root component:

```typescript
import { getBackendIntegration } from '@/lib/backend-integration';

// Initialize on app start
const backend = getBackendIntegration({
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000'),
  retries: 3,
  offlineMode: false,
});

// Check health
const isHealthy = await backend.healthCheck();
```

### **3. Use in Components**

```typescript
import { getBackendIntegration } from '@/lib/backend-integration';

export default function MyComponent() {
  const backend = getBackendIntegration();

  const handleGenerateStories = async () => {
    try {
      const jobId = await backend.generateStories({
        topic: 'My topic',
        platforms: ['youtube', 'tiktok'],
        style: 'educational',
        targetAudience: 'general',
        cta: 'Subscribe',
      });

      // Poll for completion
      const status = await backend.pollJob(jobId);
      console.log('Stories generated:', status.stories);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleGenerateStories}>
      <Text>Generate Stories</Text>
    </TouchableOpacity>
  );
}
```

---

## 🔄 Offline-First Architecture

### **Local Storage Strategy**

```typescript
// Automatically saved to AsyncStorage:
// - Job IDs and status
// - Asset cache
// - User preferences
// - Draft stories

// Sync when online
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      // Sync local data with backend
      syncLocalData();
    }
  });

  return unsubscribe;
}, []);
```

### **Conflict Resolution**

```typescript
// Local version wins if newer
// Backend version syncs when online
// Automatic merge for non-conflicting changes
```

---

## 🧠 Gemma 4 Integration

### **Local Model Execution**

```typescript
import { Gemma4Client } from '@/lib/gemma4-client';

const gemma = new Gemma4Client({
  modelSize: '7b',
  executionMode: 'local',
  device: 'gpu', // or 'cpu'
});

// Generate story structure
const stories = await gemma.generateStoryStructure({
  topic: 'My topic',
  platforms: ['youtube'],
  style: 'educational',
});
```

### **Fallback to Cloud**

```typescript
// If local model unavailable, fallback to cloud
const stories = await backend.generateStories({
  topic: 'My topic',
  platforms: ['youtube'],
  style: 'educational',
  useCloud: true, // Fallback to cloud API
});
```

---

## 📊 Data Flow

### **Story Generation Flow**

```
User Input (Topic, Platforms, Style)
         ↓
Backend Integration Layer
         ↓
Gemma 4 (Local or Cloud)
         ↓
Generate 8 Story Angles
         ↓
Create Story Structures (PAS Framework)
         ↓
Generate Voiceover Scripts
         ↓
Design Visual Concepts
         ↓
Create On-Screen Text
         ↓
Generate Image Prompts
         ↓
Generate Video Prompts
         ↓
Optimize for Platforms
         ↓
Store in Database + Cache
         ↓
Return to Mobile App
         ↓
Display Stories in UI
```

### **Video Processing Flow**

```
Upload Video (2h+)
         ↓
Proxy to Backend
         ↓
Shard into 5-10 min chunks
         ↓
Scene Detection (PySceneDetect)
         ↓
Selective Transcription (Faster-Whisper)
         ↓
Semantic Ranking
         ↓
Extract Key Moments
         ↓
Generate Short-Form Pack
         ↓
Optimize with Flow/Grok
         ↓
FFmpeg Final Assembly
         ↓
Return to Mobile App
```

---

## 🔌 API Endpoints

### **Story Generation**

```bash
# Generate stories
POST /api/stories/generate
{
  "topic": "ค่าไฟธุรกิจ SME",
  "platforms": ["youtube", "tiktok", "instagram"],
  "style": "educational",
  "target_audience": "SME business owners",
  "cta": "Subscribe for more tips"
}

# Response
{
  "job_id": "job-123",
  "status": "pending"
}

# Get status
GET /api/stories/jobs/{job_id}/status

# Response
{
  "job_id": "job-123",
  "status": "completed",
  "progress": 100,
  "stories": [...]
}
```

### **Asset Search**

```bash
# Search assets
GET /api/assets/search?tags=electricity,business&usage_role=thumbnail&campaign=SME-Energy

# Response
{
  "assets": [
    {
      "id": "asset-1",
      "name": "Electricity meter",
      "type": "image",
      "url": "https://...",
      "tags": ["electricity", "business"],
      "usage_role": "thumbnail",
      "campaign": "SME-Energy",
      "drive_url": "https://drive.google.com/..."
    }
  ]
}
```

### **Render Job**

```bash
# Submit render job
POST /api/render/submit
{
  "story_id": "story-123",
  "formats": ["mp4", "webm"]
}

# Response
{
  "job_id": "render-123"
}

# Get output
GET /api/render/jobs/{job_id}/output

# Response
{
  "job_id": "render-123",
  "videos": [
    {
      "format": "mp4",
      "url": "https://..."
    }
  ]
}
```

---

## 🧪 Testing Integration

### **Unit Tests**

```typescript
import { describe, it, expect } from 'vitest';
import { getBackendIntegration } from '@/lib/backend-integration';

describe('Backend Integration', () => {
  it('should generate stories', async () => {
    const backend = getBackendIntegration();

    const jobId = await backend.generateStories({
      topic: 'Test topic',
      platforms: ['youtube'],
      style: 'educational',
      targetAudience: 'general',
      cta: 'Subscribe',
    });

    expect(jobId).toBeDefined();
    expect(jobId).toMatch(/^job-/);
  });

  it('should get job status', async () => {
    const backend = getBackendIntegration();

    const status = await backend.getJobStatus('job-123');

    expect(status).toHaveProperty('jobId');
    expect(status).toHaveProperty('status');
    expect(status).toHaveProperty('progress');
  });
});
```

### **Integration Tests**

```bash
# Run full integration test
pnpm test:integration

# Test with real backend
BACKEND_URL=http://localhost:8000 pnpm test:integration

# Test offline mode
OFFLINE_MODE=true pnpm test:integration
```

---

## 🚀 Deployment

### **Mobile App Deployment**

```bash
# Build APK
./scripts/build-apk.sh

# Build App Bundle for Play Store
./scripts/build-app-bundle.sh

# Deploy to Play Store
eas submit --platform android
```

### **Backend Deployment**

```bash
# Deploy FastAPI
docker-compose up -d api-fastapi

# Deploy NestJS
docker-compose up -d api-nestjs

# Deploy Workers
docker-compose up -d workers

# Deploy Database
docker-compose up -d postgres redis
```

---

## 📈 Performance Optimization

### **Mobile App Optimization**

```typescript
// 1. Lazy load modules
const StoryEngine = lazy(() => import('./modules/story-engine'));

// 2. Memoize expensive computations
const memoizedStories = useMemo(() => stories, [stories]);

// 3. Use FlatList for large lists
<FlatList
  data={stories}
  renderItem={renderStory}
  keyExtractor={(item) => item.id}
/>

// 4. Optimize images
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
/>

// 5. Cache API responses
const cachedResponse = await AsyncStorage.getItem(`api:${url}`);
```

### **Backend Optimization**

```python
# 1. Use connection pooling
DATABASE_POOL_SIZE = 20

# 2. Enable caching
CACHE_TTL = 3600  # 1 hour

# 3. Use async operations
async def generate_stories(request):
    # Non-blocking operations
    pass

# 4. Implement rate limiting
@limiter.limit("100/minute")
async def api_endpoint():
    pass

# 5. Monitor performance
@monitor_performance
async def slow_operation():
    pass
```

---

## 🔐 Security

### **API Security**

```typescript
// 1. Use HTTPS only
const apiUrl = 'https://api.example.com';

// 2. Add authentication
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};

// 3. Validate inputs
if (!topic || topic.length === 0) {
  throw new Error('Invalid topic');
}

// 4. Sanitize outputs
const sanitizedStory = sanitizeHtml(story.content);

// 5. Use secure storage
await SecureStore.setItemAsync('token', token);
```

### **Data Protection**

```typescript
// 1. Encrypt sensitive data
const encrypted = await encrypt(sensitiveData, encryptionKey);

// 2. Use secure communication
const ssl = true;

// 3. Implement access control
if (!user.hasPermission('generate_stories')) {
  throw new Error('Unauthorized');
}

// 4. Audit logging
logger.info('User generated stories', { userId, jobId });

// 5. Data retention
// Delete old jobs after 30 days
```

---

## 📚 Additional Resources

- [Mobile App Setup Guide](./MOBILE-APP-SETUP.md)
- [APK Build Guide](./APK-BUILD-GUIDE.md)
- [Gemma 4 Integration](./ghost-claw-os/docs/GEMMA4-INTEGRATION-GUIDE.md)
- [System Architecture](./ghost-claw-os/docs/03-SYSTEM-ARCHITECTURE.md)
- [API Routes](./ghost-claw-os/docs/06-API-ROUTES.md)

---

## ✅ Integration Checklist

- [ ] Environment variables configured
- [ ] Backend API running
- [ ] Mobile app connects to backend
- [ ] Story generation works
- [ ] Asset search works
- [ ] Offline mode works
- [ ] Sync works when online
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Ready for production

---

**Status:** ✅ Production-Ready  
**Version:** 1.0.0  
**Last Updated:** April 18, 2026  
**Maintained By:** Ghost Claw Studio
