# Ghost Claw OS - Mobile App Modules Structure

**Version:** 1.0  
**Status:** Complete  
**Last Updated:** April 18, 2026

---

## 📱 11 Core Modules

### **1. Dashboard Module** ✅
**File:** `app/modules/dashboard/DashboardScreen.tsx`

**Features:**
- Overview of all projects
- Recent activities
- Quick stats (total stories, renders, published)
- Quick actions (create project, generate story)
- Recent jobs status

**Data:**
- Projects list
- Recent jobs
- Analytics summary
- User profile

---

### **2. Projects Module** ✅
**File:** `app/modules/projects/ProjectsScreen.tsx`

**Features:**
- List all projects
- Create new project
- Edit project details
- Delete project
- Project settings
- Team members

**Data:**
- Project ID
- Project name
- Description
- Created date
- Status
- Team members

---

### **3. Story Engine Module** ✅
**File:** `app/modules/story-engine/StoryEngineScreen.tsx`

**Features:**
- Generate stories from topic
- Select platforms (YouTube, TikTok, Instagram, Facebook)
- Choose style (educational, entertainment, motivational, news)
- View generated stories
- Edit stories
- Preview stories

**Data:**
- Topic
- Platforms
- Style
- Target audience
- CTA
- Generated stories

---

### **4. Autocut Studio Module** 🔄
**File:** `app/modules/autocut-studio/AutocutStudioScreen.tsx`

**Features:**
- Upload long-form video (2h+)
- Automatic scene detection
- Selective transcription
- Key moment extraction
- Generate short-form pack
- Preview clips
- Adjust cuts manually

**Data:**
- Video file
- Scenes
- Transcription
- Key moments
- Generated clips

---

### **5. Asset Library Module** 🔄
**File:** `app/modules/asset-library/AssetLibraryScreen.tsx`

**Features:**
- Search assets by tags
- Filter by usage role
- Filter by campaign
- View asset preview
- Download asset
- Sync from Google Drive
- Manage asset metadata

**Data:**
- Asset ID
- Asset name
- Asset type (image, video, audio)
- URL
- Tags
- Usage role
- Campaign
- Drive URL

---

### **6. Prompt Lab Module** 🔄
**File:** `app/modules/prompt-lab/PromptLabScreen.tsx`

**Features:**
- Create custom prompts
- Optimize prompts with Gemma 4
- Test prompts
- Save prompt templates
- Share prompts
- View prompt history
- Generate prompts for different tasks

**Data:**
- Prompt text
- Task type
- Platform
- Optimized prompt
- Quality score
- History

---

### **7. Render Queue Module** 🔄
**File:** `app/modules/render-queue/RenderQueueScreen.tsx`

**Features:**
- Submit render jobs
- Select output formats (MP4, WebM, MOV)
- Monitor render progress
- View render queue
- Cancel render job
- Download rendered video
- Render history

**Data:**
- Job ID
- Story ID
- Formats
- Status
- Progress
- Output URLs

---

### **8. Review Gate Module** 🔄
**File:** `app/modules/review-gate/ReviewGateScreen.tsx`

**Features:**
- AI compliance check
- Review content
- Flag issues
- Approve/reject
- Add comments
- Request changes
- View review history

**Data:**
- Content to review
- Compliance score
- Issues found
- Comments
- Approval status
- Reviewer notes

---

### **9. Release Center Module** 🔄
**File:** `app/modules/release-center/ReleaseCenterScreen.tsx`

**Features:**
- Publish to multiple platforms
- Schedule publication
- Add platform-specific metadata
- Preview on each platform
- Track publication status
- View published links
- Analytics per platform

**Data:**
- Story ID
- Platforms
- Publication date
- Metadata per platform
- Status per platform
- Published URLs

---

### **10. Watch Center Module** 🔄
**File:** `app/modules/watch-center/WatchCenterScreen.tsx`

**Features:**
- Monitor all published content
- View analytics (views, likes, comments)
- Track performance metrics
- Compare platform performance
- Trending content
- Engagement rate
- Real-time notifications

**Data:**
- Published content
- Views
- Likes
- Comments
- Shares
- Engagement rate
- Trending status

---

### **11. Settings Module** 🔄
**File:** `app/modules/settings/SettingsScreen.tsx`

**Features:**
- User profile
- Account settings
- Notification preferences
- API configuration
- Theme settings (light/dark)
- Language selection
- Privacy settings
- About app

**Data:**
- User profile
- Preferences
- API keys
- Theme
- Language
- Privacy settings

---

## 🗂️ File Structure

```
app/
├── modules/
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx
│   │   └── components/
│   │       ├── ProjectCard.tsx
│   │       ├── StatsCard.tsx
│   │       └── ActivityFeed.tsx
│   │
│   ├── projects/
│   │   ├── ProjectsScreen.tsx
│   │   ├── ProjectDetailScreen.tsx
│   │   └── components/
│   │       ├── ProjectCard.tsx
│   │       ├── ProjectForm.tsx
│   │       └── TeamMemberList.tsx
│   │
│   ├── story-engine/
│   │   ├── StoryEngineScreen.tsx
│   │   ├── StoryDetailScreen.tsx
│   │   └── components/
│   │       ├── TopicInput.tsx
│   │       ├── PlatformSelector.tsx
│   │       ├── StyleSelector.tsx
│   │       └── StoryCard.tsx
│   │
│   ├── autocut-studio/
│   │   ├── AutocutStudioScreen.tsx
│   │   ├── VideoUploadScreen.tsx
│   │   ├── SceneDetectionScreen.tsx
│   │   └── components/
│   │       ├── VideoPlayer.tsx
│   │       ├── SceneList.tsx
│   │       └── ClipEditor.tsx
│   │
│   ├── asset-library/
│   │   ├── AssetLibraryScreen.tsx
│   │   ├── AssetDetailScreen.tsx
│   │   └── components/
│   │       ├── AssetGrid.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       └── AssetCard.tsx
│   │
│   ├── prompt-lab/
│   │   ├── PromptLabScreen.tsx
│   │   ├── PromptEditorScreen.tsx
│   │   └── components/
│   │       ├── PromptInput.tsx
│   │       ├── PromptOptimizer.tsx
│   │       ├── PromptHistory.tsx
│   │       └── PromptCard.tsx
│   │
│   ├── render-queue/
│   │   ├── RenderQueueScreen.tsx
│   │   ├── RenderJobDetailScreen.tsx
│   │   └── components/
│   │       ├── JobList.tsx
│   │       ├── JobCard.tsx
│   │       ├── ProgressBar.tsx
│   │       └── FormatSelector.tsx
│   │
│   ├── review-gate/
│   │   ├── ReviewGateScreen.tsx
│   │   ├── ReviewDetailScreen.tsx
│   │   └── components/
│   │       ├── ContentViewer.tsx
│   │       ├── ComplianceScore.tsx
│   │       ├── IssueList.tsx
│   │       └── ApprovalButtons.tsx
│   │
│   ├── release-center/
│   │   ├── ReleaseCenterScreen.tsx
│   │   ├── PublishScreen.tsx
│   │   └── components/
│   │       ├── PlatformSelector.tsx
│   │       ├── MetadataForm.tsx
│   │       ├── PreviewPanel.tsx
│   │       └── PublishButton.tsx
│   │
│   ├── watch-center/
│   │   ├── WatchCenterScreen.tsx
│   │   ├── AnalyticsDetailScreen.tsx
│   │   └── components/
│   │       ├── ContentList.tsx
│   │       ├── AnalyticsCard.tsx
│   │       ├── PerformanceChart.tsx
│   │       └── TrendingBadge.tsx
│   │
│   └── settings/
│       ├── SettingsScreen.tsx
│       ├── ProfileScreen.tsx
│       ├── NotificationSettingsScreen.tsx
│       └── components/
│           ├── SettingItem.tsx
│           ├── ProfileForm.tsx
│           ├── NotificationToggle.tsx
│           └── LanguageSelector.tsx
│
├── (tabs)/
│   ├── _layout.tsx
│   └── index.tsx
│
└── _layout.tsx
```

---

## 🔌 API Integration Points

### **Dashboard Module**
- `GET /api/projects` - List projects
- `GET /api/jobs?limit=5` - Recent jobs
- `GET /api/analytics/summary` - Summary stats

### **Projects Module**
- `GET /api/projects` - List all
- `POST /api/projects` - Create
- `PUT /api/projects/{id}` - Update
- `DELETE /api/projects/{id}` - Delete
- `GET /api/projects/{id}/team` - Team members

### **Story Engine Module**
- `POST /api/stories/generate` - Generate stories
- `GET /api/stories/jobs/{id}/status` - Job status
- `GET /api/stories/{id}` - Get story details
- `PUT /api/stories/{id}` - Update story
- `DELETE /api/stories/{id}` - Delete story

### **Autocut Studio Module**
- `POST /api/videos/upload` - Upload video
- `POST /api/videos/process` - Process video
- `GET /api/videos/jobs/{id}/status` - Job status
- `GET /api/videos/{id}/scenes` - Get scenes
- `GET /api/videos/{id}/clips` - Get clips

### **Asset Library Module**
- `GET /api/assets/search` - Search assets
- `POST /api/assets/sync` - Sync from Google Drive
- `GET /api/assets/{id}` - Get asset details
- `GET /api/assets/{id}/preview` - Get preview

### **Prompt Lab Module**
- `POST /api/prompts/generate` - Generate prompt
- `POST /api/prompts/optimize` - Optimize prompt
- `POST /api/prompts/test` - Test prompt
- `GET /api/prompts/history` - Prompt history
- `POST /api/prompts/save` - Save template

### **Render Queue Module**
- `POST /api/render/submit` - Submit render job
- `GET /api/render/jobs/{id}/status` - Job status
- `GET /api/render/jobs/{id}/output` - Get output
- `DELETE /api/render/jobs/{id}` - Cancel job
- `GET /api/render/queue` - View queue

### **Review Gate Module**
- `POST /api/review/check-compliance` - Check compliance
- `POST /api/review/approve` - Approve content
- `POST /api/review/reject` - Reject content
- `POST /api/review/comment` - Add comment
- `GET /api/review/history` - Review history

### **Release Center Module**
- `POST /api/publish/story` - Publish story
- `GET /api/publish/jobs/{id}/status` - Publication status
- `GET /api/publish/{id}/urls` - Published URLs
- `GET /api/publish/platforms` - Available platforms

### **Watch Center Module**
- `GET /api/analytics/content/{id}` - Content analytics
- `GET /api/analytics/trending` - Trending content
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/engagement` - Engagement stats

### **Settings Module**
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/preferences` - Update preferences
- `POST /api/users/change-password` - Change password

---

## 🧪 Testing Strategy

### **Unit Tests**
- Component rendering
- User interactions
- Data validation
- Error handling

### **Integration Tests**
- API communication
- Data flow
- State management
- Navigation

### **E2E Tests**
- Complete workflows
- Multi-step processes
- Cross-module interactions
- Real backend integration

---

## 📊 State Management

### **Global State (Context API)**
- User authentication
- App settings
- Theme preferences
- Notification preferences

### **Local State (useState)**
- Form inputs
- Loading states
- UI toggles
- Temporary data

### **Persistent State (AsyncStorage)**
- User preferences
- Draft stories
- Cached data
- Job history

---

## 🔐 Security Considerations

- ✅ Input validation
- ✅ Output sanitization
- ✅ Secure API communication
- ✅ Token management
- ✅ Permission checking
- ✅ Audit logging

---

## 📈 Performance Optimization

- ✅ Lazy loading
- ✅ Code splitting
- ✅ Image optimization
- ✅ Caching strategy
- ✅ Memoization
- ✅ FlatList for large lists

---

## 🎨 UI/UX Guidelines

- ✅ Consistent design system
- ✅ Accessible components
- ✅ Responsive layouts
- ✅ Clear navigation
- ✅ Loading states
- ✅ Error messages
- ✅ Success feedback

---

**Status:** ✅ Complete Structure  
**Version:** 1.0.0  
**Ready for:** Implementation
