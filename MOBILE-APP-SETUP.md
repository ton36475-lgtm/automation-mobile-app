# Ghost Claw OS - Mobile App Setup Guide

**Version:** 1.0  
**Platform:** iOS, Android, Web  
**Status:** Production-Ready  
**Last Updated:** April 18, 2026

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+
- pnpm or npm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Gemma 4 backend running (see backend setup)

### **Installation**

```bash
# 1. Navigate to project
cd /home/ubuntu/advanced-ai-multi-tool

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local

# 4. Configure Gemma 4 backend URL
# Edit .env.local and set:
# NEXT_PUBLIC_GEMMA4_API_URL=http://localhost:8000

# 5. Start development server
pnpm dev

# 6. Open in browser or scan QR code with Expo Go
```

---

## 📱 Platform-Specific Setup

### **iOS (Mac)**

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# Run on iOS Simulator
pnpm ios

# Or open in Xcode
open ios/AdvancedAIMultiTool.xcworkspace
```

### **Android**

```bash
# Ensure Android SDK is installed
# Set ANDROID_HOME environment variable

# Run on Android Emulator
pnpm android

# Or build APK
pnpm build:android
```

### **Web**

```bash
# Run web version
pnpm web

# Build for production
pnpm build:web
```

---

## 🧠 Gemma 4 Backend Setup

### **Option 1: Local Backend (Recommended)**

```bash
# 1. Navigate to backend
cd /home/ubuntu/ghost-claw-os/packages/ml-workers

# 2. Install dependencies
pip install -r requirements.txt

# 3. Download Gemma 4 model
huggingface-cli download google/gemma-7b --local-dir ./models/gemma-7b

# 4. Start backend
python app/main.py

# Backend will be available at http://localhost:8000
```

### **Option 2: Docker Backend**

```bash
# Start all services with Docker Compose
cd /home/ubuntu/ghost-claw-os
docker-compose up -d

# Backend will be available at http://localhost:8000
```

### **Option 3: Cloud Backend**

```bash
# Configure cloud API endpoint
export NEXT_PUBLIC_GEMMA4_API_URL=https://your-cloud-api.com
```

---

## 📁 Project Structure

```
advanced-ai-multi-tool/
├── app/                          # Expo Router app
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   └── index.tsx            # Home screen
│   ├── modules/
│   │   ├── story-engine/        # Story generation
│   │   ├── autocut-studio/      # Video processing
│   │   ├── asset-library/       # Asset management
│   │   ├── prompt-lab/          # Prompt optimization
│   │   ├── render-queue/        # Rendering
│   │   ├── review-gate/         # Compliance
│   │   ├── release-center/      # Publishing
│   │   └── watch-center/        # Monitoring
│   └── oauth/
├── components/
│   ├── ui/                      # UI components
│   ├── layout/                  # Layout components
│   └── modules/                 # Module-specific components
├── lib/
│   ├── gemma4-client.ts        # Gemma 4 API client
│   ├── api.ts                  # API utilities
│   └── utils.ts                # Helper functions
├── hooks/
│   ├── use-colors.ts           # Theme colors
│   ├── use-auth.ts             # Authentication
│   └── use-gemma4.ts           # Gemma 4 hook
├── styles/
│   └── globals.css             # Global styles
├── app.config.ts               # Expo configuration
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🎯 11 Modules Overview

### **1. Dashboard**
- Overview of all projects
- Recent activities
- Quick stats

### **2. Projects**
- Create new projects
- Manage existing projects
- View project details

### **3. Intake Studio**
- Parse briefs and topics
- Define project parameters
- Set target audience

### **4. Story Engine** ✅
- Generate 8 stories from topic
- PAS framework structure
- Voiceover generation
- Visual concept design

### **5. Autocut Studio**
- Upload long-form videos
- Scene detection
- Transcription
- Key moment extraction

### **6. Asset Library**
- Browse assets from Google Drive
- Search by tags/campaign
- Preview and metadata

### **7. Prompt Lab**
- Optimize prompts
- Generate content flows
- Test different angles

### **8. Render Queue**
- Submit render jobs
- Monitor progress
- Download outputs

### **9. Review Gate**
- Compliance checking
- Brand guidelines verification
- Platform policies validation

### **10. Release Center**
- Publish to platforms
- Schedule posts
- Track performance

### **11. Watch Center**
- Monitor analytics
- Track engagement
- Incident response

---

## 🔌 API Integration

### **Gemma 4 Client Usage**

```typescript
import { getGemma4Client } from '@/lib/gemma4-client';

// Get client instance
const gemma4 = getGemma4Client();

// Generate stories
const response = await gemma4.generateStories({
  topic: 'Your topic',
  platforms: ['youtube', 'tiktok'],
  style: 'educational',
  targetAudience: 'SME business owners',
  cta: 'Subscribe for more tips'
});

// Wait for completion
const result = await gemma4.waitForCompletion(response.jobId);

// Get stories
console.log(result.stories);
```

### **Custom Hooks**

```typescript
import { useGemma4 } from '@/hooks/use-gemma4';

export function MyComponent() {
  const { generateStories, isLoading, error } = useGemma4();

  const handleGenerate = async () => {
    const result = await generateStories({
      topic: 'Your topic',
      platforms: ['youtube'],
      style: 'educational',
      targetAudience: 'General',
      cta: 'Subscribe'
    });
    
    console.log(result);
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? 'Generating...' : 'Generate'}
    </button>
  );
}
```

---

## 🧪 Testing

### **Run Tests**

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### **Test Sample Project**

```bash
# Run sample project test
pnpm test:sample

# This tests the "ค่าไฟธุรกิจ SME" project
```

---

## 📊 Performance Optimization

### **Bundle Size**

```bash
# Analyze bundle
pnpm build:analyze

# Optimize imports
pnpm optimize
```

### **Runtime Performance**

- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Cache API responses
- Lazy load modules

---

## 🔐 Security

### **Environment Variables**

```bash
# Never commit .env.local
# Use .env.example as template
# Store secrets in secure environment
```

### **API Security**

- HTTPS only in production
- API key rotation
- Rate limiting
- Input validation

### **Data Protection**

- Local storage encryption
- Secure authentication
- Privacy-first design

---

## 🚀 Deployment

### **Build for Production**

```bash
# Build web
pnpm build:web

# Build iOS
pnpm build:ios

# Build Android
pnpm build:android
```

### **Deploy to App Stores**

```bash
# iOS App Store
eas build --platform ios --auto-submit

# Google Play Store
eas build --platform android --auto-submit
```

### **Deploy Web**

```bash
# Deploy to Vercel
vercel deploy

# Or deploy to your server
# Build: pnpm build:web
# Output: .next/
```

---

## 📝 Environment Variables

```bash
# .env.local

# Gemma 4 Backend
NEXT_PUBLIC_GEMMA4_API_URL=http://localhost:8000

# Google Drive (optional)
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
GOOGLE_SHEETS_ID=your-sheet-id

# LLM APIs (optional)
OPENAI_API_KEY=sk-...
GROK_API_KEY=...

# Platform APIs (optional)
YOUTUBE_API_KEY=...
TIKTOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...

# Analytics (optional)
POSTHOG_API_KEY=...
```

---

## 🐛 Troubleshooting

### **Issue: Metro bundler error**

```bash
# Solution
rm -rf node_modules
rm -rf .next
pnpm install
pnpm dev
```

### **Issue: Gemma 4 connection error**

```bash
# Check backend is running
curl http://localhost:8000/health

# Check API URL in .env.local
# Ensure backend is accessible from mobile device
```

### **Issue: Slow performance**

```bash
# Check bundle size
pnpm build:analyze

# Profile performance
# Use React DevTools Profiler
```

---

## 📚 Documentation

- [Gemma 4 Integration Guide](../ghost-claw-os/docs/GEMMA4-INTEGRATION-GUIDE.md)
- [API Routes](../ghost-claw-os/docs/06-API-ROUTES.md)
- [Database Schema](../ghost-claw-os/docs/07-DATABASE-SCHEMA.md)
- [System Architecture](../ghost-claw-os/docs/03-SYSTEM-ARCHITECTURE.md)

---

## 🆘 Support

### **Common Issues**

1. **Port already in use**
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **Module not found**
   ```bash
   # Clear cache
   pnpm store prune
   pnpm install
   ```

3. **Build error**
   ```bash
   # Clean build
   pnpm clean
   pnpm install
   pnpm build
   ```

---

## ✅ Checklist

- [ ] Backend running (Gemma 4)
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Development server started
- [ ] App running on device/simulator
- [ ] Story Engine module working
- [ ] API integration tested
- [ ] Sample project generated
- [ ] All 11 modules accessible
- [ ] Ready for production

---

**Status:** ✅ Production-Ready  
**Version:** 1.0.0  
**Last Updated:** April 18, 2026  
**Maintained By:** Ghost Claw Studio
