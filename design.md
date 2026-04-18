# AI Multi-Tool Master - Mobile App Design

## Overview

A comprehensive mobile application that integrates four powerful AI-driven tools into a single, cohesive experience. The app follows Apple Human Interface Guidelines (HIG) and is optimized for one-handed usage in portrait orientation (9:16).

---

## Screen List

### 1. **Home Screen** (Tab: Home)
- **Purpose**: Central hub and quick access to all four tools
- **Content**: 
  - Welcome header with user greeting
  - Four main tool cards (SimilarWeb, Video Generator, BGM Prompter, Skill Creator)
  - Recent activity/history section
  - Quick action buttons

### 2. **SimilarWeb Analytics Dashboard**
- **Purpose**: Website traffic analysis and competitive intelligence
- **Content**:
  - Domain search input field
  - Key metrics display (Global Rank, Total Visits, Unique Visitors)
  - Traffic trends chart (monthly)
  - Traffic sources breakdown (Desktop/Mobile)
  - Geographic distribution map/list
  - Bounce rate and engagement metrics
  - Export/share functionality

### 3. **Video Generator Workflow**
- **Purpose**: Multi-phase video creation interface
- **Content**:
  - Phase indicator (1-5 progress)
  - Phase 1: Project brief form (purpose, duration, aspect ratio, style)
  - Phase 2: Global definitions (visual style, characters, voices, BGM)
  - Phase 3: Clip planning (segmentation, keyframes, transitions)
  - Phase 4: Reference image preview
  - Phase 5: Generation progress and preview
  - Video player with playback controls

### 4. **BGM Prompter**
- **Purpose**: Music generation with 9-dimension framework
- **Content**:
  - 9-dimension input form (Genre, Tempo, Key, Mood, Instrumentation, etc.)
  - Duration selector (up to 180 seconds)
  - Arrangement/structure text editor with timestamp support
  - Preview audio player
  - Generation history
  - Save/favorite prompts

### 5. **Skill Creator**
- **Purpose**: Create and manage custom skills
- **Content**:
  - Skill template selector
  - SKILL.md editor with syntax highlighting
  - Bundled resources manager (scripts/, references/, templates/)
  - Validation checker
  - Publish/export options
  - Skill library browser

### 6. **Settings Screen** (Tab: Settings)
- **Purpose**: App configuration and preferences
- **Content**:
  - Theme toggle (Light/Dark)
  - API key management (if needed)
  - Data storage preferences
  - About app information
  - Help and documentation links

---

## Primary Content and Functionality

### SimilarWeb Analytics Module
- **Data Input**: Domain name search
- **Processing**: API calls to SimilarWeb for traffic metrics
- **Output**: 
  - Visual charts (visits, bounce rate trends)
  - Traffic source breakdown
  - Geographic distribution
  - Comparison capabilities
- **Actions**: Search, filter by date range, export data, share insights

### Video Generator Module
- **Data Input**: Multi-step form with project details
- **Processing**: 
  - Phase 1-3: Capture user requirements
  - Phase 4: Generate reference images
  - Phase 5: Generate video clips and audio
- **Output**: 
  - Generated video file
  - Keyframe previews
  - Audio tracks (narration, BGM, SFX)
- **Actions**: Save project, preview clips, download video, share

### BGM Prompter Module
- **Data Input**: 9-dimension music framework form
- **Processing**: 
  - Validate prompt structure
  - Generate music based on specifications
  - Handle multi-clip continuity (if > 180s)
- **Output**: 
  - Audio file (MP3/WAV)
  - Waveform visualization
  - Playback controls
- **Actions**: Generate, preview, save, export, refine prompt

### Skill Creator Module
- **Data Input**: Skill template and SKILL.md content
- **Processing**:
  - Validate SKILL.md structure
  - Manage bundled resources
  - Package skill directory
- **Output**: 
  - Packaged .skill file
  - Validation report
- **Actions**: Create, edit, validate, publish, download

---

## Key User Flows

### Flow 1: Analyze Website Traffic (SimilarWeb)
1. User taps "SimilarWeb" card on Home
2. Navigates to Analytics Dashboard
3. Enters domain name in search field
4. Taps "Analyze" button
5. App fetches traffic data
6. Displays metrics, charts, and insights
7. User can filter by date range, export data, or share results
8. User returns to Home or explores other tools

### Flow 2: Create AI Video
1. User taps "Video Generator" card on Home
2. Enters Phase 1: Project brief (purpose, duration, aspect ratio, style)
3. Confirms and proceeds to Phase 2: Global definitions
4. Fills in visual style, characters, voices, BGM preferences
5. Proceeds to Phase 3: Plans clips with keyframes and transitions
6. Reviews Phase 4: Reference images are generated
7. Proceeds to Phase 5: Watches generation progress
8. Previews generated video
9. Downloads or shares video
10. Returns to Home or creates new project

### Flow 3: Generate Background Music
1. User taps "BGM Prompter" card on Home
2. Fills in 9-dimension form (Genre, Tempo, Mood, Instrumentation, etc.)
3. Sets duration (up to 180 seconds)
4. Optionally adds arrangement/structure with timestamps
5. Taps "Generate Music"
6. Listens to preview
7. Saves, exports, or refines prompt
8. Returns to Home

### Flow 4: Create Custom Skill
1. User taps "Skill Creator" card on Home
2. Selects skill template (workflow, tool integration, domain expertise)
3. Edits SKILL.md with frontmatter and body
4. Manages bundled resources (scripts, references, templates)
5. Runs validation checker
6. Publishes or exports skill
7. Returns to Home or browses skill library

---

## Color Choices

### Brand Palette
- **Primary**: #0a7ea4 (Teal/Cyan) - Represents AI and technology
- **Secondary**: #6366f1 (Indigo) - Accent for interactive elements
- **Success**: #22c55e (Green) - Positive actions, completion
- **Warning**: #f59e0b (Amber) - Alerts, caution
- **Error**: #ef4444 (Red) - Errors, destructive actions

### Semantic Colors (Light Mode)
- **Background**: #ffffff (White) - Clean, minimal
- **Surface**: #f5f5f5 (Light Gray) - Cards, elevated surfaces
- **Foreground**: #11181c (Dark Gray) - Primary text
- **Muted**: #687076 (Medium Gray) - Secondary text
- **Border**: #e5e7eb (Light Border) - Dividers, outlines

### Semantic Colors (Dark Mode)
- **Background**: #151718 (Very Dark Gray)
- **Surface**: #1e2022 (Dark Gray)
- **Foreground**: #ecedee (Light Gray)
- **Muted**: #9ba1a6 (Medium Gray)
- **Border**: #334155 (Dark Border)

---

## Design Principles

1. **One-Handed Usage**: All interactive elements within thumb reach
2. **Clear Hierarchy**: Primary actions prominent, secondary actions accessible
3. **Consistent Spacing**: 4px, 8px, 12px, 16px, 24px, 32px grid
4. **Readable Typography**: 
   - Headlines: 24-32px, bold
   - Body: 14-16px, regular
   - Captions: 12px, medium
5. **Accessible Colors**: Sufficient contrast ratios (WCAG AA minimum)
6. **Feedback**: Every action provides visual or haptic feedback
7. **Performance**: Smooth animations, quick load times
8. **iOS-First**: Follows Apple HIG, then adapt for Android

---

## Navigation Architecture

```
Home (Tab 1)
├── SimilarWeb Analytics Dashboard
│   ├── Domain Search
│   ├── Metrics View
│   ├── Charts & Insights
│   └── Export/Share
├── Video Generator
│   ├── Phase 1: Project Brief
│   ├── Phase 2: Global Definitions
│   ├── Phase 3: Clip Planning
│   ├── Phase 4: Reference Images
│   └── Phase 5: Generation & Preview
├── BGM Prompter
│   ├── 9-Dimension Form
│   ├── Duration & Structure
│   ├── Generation & Preview
│   └── Save/Export
└── Skill Creator
    ├── Template Selection
    ├── SKILL.md Editor
    ├── Resources Manager
    ├── Validation
    └── Publish/Export

Settings (Tab 2)
├── Theme
├── API Configuration
├── Storage Preferences
└── Help & About
```

---

## Implementation Notes

- **State Management**: React Context + AsyncStorage for local persistence
- **API Integration**: TanStack Query for SimilarWeb data fetching
- **Media Handling**: expo-video for video playback, expo-audio for music preview
- **File Management**: expo-file-system for local file storage
- **UI Framework**: NativeWind (Tailwind CSS) for consistent styling
- **Responsive Design**: Mobile portrait (9:16) as primary, web fallback
