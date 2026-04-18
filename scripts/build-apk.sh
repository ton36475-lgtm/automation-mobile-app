#!/bin/bash

# Ghost Claw OS - Android APK Build Script
# Generates signed APK for Play Store and direct installation

set -e

echo "🚀 Ghost Claw OS - APK Build Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
BUILD_DIR="$ANDROID_DIR/app/build"
DIST_DIR="$PROJECT_DIR/dist"
KEYSTORE_FILE="$PROJECT_DIR/android-release.keystore"
KEYSTORE_PASSWORD="ghostclaw123"
KEY_ALIAS="ghostclaw"
KEY_PASSWORD="ghostclaw123"

echo "📁 Project Directory: $PROJECT_DIR"
echo "📁 Android Directory: $ANDROID_DIR"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pnpm found${NC}"

if ! command -v keytool &> /dev/null; then
    echo -e "${RED}❌ keytool not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ keytool found${NC}"

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo -e "${RED}❌ Keystore file not found: $KEYSTORE_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Keystore file found${NC}"

echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
cd "$PROJECT_DIR"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build web assets
echo -e "${YELLOW}Step 3: Building web assets...${NC}"
pnpm build:web
echo -e "${GREEN}✓ Web assets built${NC}"
echo ""

# Step 4: Clean previous builds
echo -e "${YELLOW}Step 4: Cleaning previous builds...${NC}"
cd "$ANDROID_DIR"
./gradlew clean
echo -e "${GREEN}✓ Previous builds cleaned${NC}"
echo ""

# Step 5: Build APK
echo -e "${YELLOW}Step 5: Building APK...${NC}"
cd "$ANDROID_DIR"

# Build unsigned APK first
./gradlew assembleRelease \
    -PMYAPP_RELEASE_STORE_FILE=../android-release.keystore \
    -PMYAPP_RELEASE_STORE_PASSWORD=$KEYSTORE_PASSWORD \
    -PMYAPP_RELEASE_KEY_ALIAS=$KEY_ALIAS \
    -PMYAPP_RELEASE_KEY_PASSWORD=$KEY_PASSWORD

echo -e "${GREEN}✓ APK built${NC}"
echo ""

# Step 6: Find and verify APK
echo -e "${YELLOW}Step 6: Verifying APK...${NC}"

APK_FILE=$(find "$BUILD_DIR" -name "*release*.apk" -type f | head -1)

if [ -z "$APK_FILE" ]; then
    echo -e "${RED}❌ APK file not found in build directory${NC}"
    exit 1
fi

APK_SIZE=$(du -h "$APK_FILE" | cut -f1)
APK_MD5=$(md5sum "$APK_FILE" | cut -d' ' -f1)

echo -e "${GREEN}✓ APK found: $(basename "$APK_FILE")${NC}"
echo "  Size: $APK_SIZE"
echo "  MD5: $APK_MD5"
echo ""

# Step 7: Create distribution directory
echo -e "${YELLOW}Step 7: Creating distribution package...${NC}"

mkdir -p "$DIST_DIR"

# Copy APK
cp "$APK_FILE" "$DIST_DIR/ghost-claw-os.apk"

# Create metadata file
cat > "$DIST_DIR/metadata.json" << EOF
{
  "app_name": "Ghost Claw OS",
  "version": "1.0.0",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "apk_file": "ghost-claw-os.apk",
  "apk_size": "$APK_SIZE",
  "apk_md5": "$APK_MD5",
  "min_sdk": 24,
  "target_sdk": 34,
  "package_name": "space.manus.advanced.ai.multi.tool",
  "keystore": "android-release.keystore",
  "key_alias": "$KEY_ALIAS"
}
EOF

echo -e "${GREEN}✓ Distribution package created${NC}"
echo ""

# Step 8: Generate installation instructions
echo -e "${YELLOW}Step 8: Generating installation instructions...${NC}"

cat > "$DIST_DIR/INSTALL.md" << 'EOF'
# Ghost Claw OS - APK Installation Guide

## Installation Methods

### Method 1: Direct Installation (Recommended)

1. **Download APK**
   ```bash
   # Download ghost-claw-os.apk from dist/ folder
   ```

2. **Enable Unknown Sources**
   - Settings → Security → Unknown Sources (Enable)
   - Or: Settings → Apps & Notifications → Advanced → Install Unknown Apps

3. **Install APK**
   ```bash
   adb install ghost-claw-os.apk
   ```
   Or transfer to phone and tap to install

4. **Launch App**
   - Find "Ghost Claw OS" in app drawer
   - Tap to launch

### Method 2: Play Store Upload

1. **Prepare for Play Store**
   ```bash
   # Use app-bundle instead of APK
   ./gradlew bundleRelease
   ```

2. **Upload to Play Store**
   - Go to Google Play Console
   - Create new app
   - Upload AAB (Android App Bundle)
   - Fill in store listing
   - Submit for review

### Method 3: Firebase App Distribution

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Authenticate**
   ```bash
   firebase login
   ```

3. **Distribute APK**
   ```bash
   firebase appdistribution:distribute ghost-claw-os.apk \
     --app 1:123456789:android:abcdef123456 \
     --testers "tester@example.com"
   ```

## Verification

### Check APK Signature
```bash
jarsigner -verify -verbose ghost-claw-os.apk
```

### Check APK Contents
```bash
unzip -l ghost-claw-os.apk | head -20
```

### Install and Test
```bash
adb install -r ghost-claw-os.apk
adb shell am start -n space.manus.advanced.ai.multi.tool/.MainActivity
```

## Troubleshooting

### Installation Fails
- Ensure Unknown Sources is enabled
- Check Android version (min 7.0)
- Free up storage space
- Try: `adb install -r ghost-claw-os.apk` (replace existing)

### App Crashes on Launch
- Check Logcat: `adb logcat | grep ghost-claw`
- Ensure backend is running
- Check Gemma 4 API connection
- Clear app data: `adb shell pm clear space.manus.advanced.ai.multi.tool`

### Performance Issues
- Reduce Gemma 4 model size
- Enable GPU acceleration
- Clear app cache
- Restart device

## Support

For issues, check:
- [Mobile App Setup Guide](../MOBILE-APP-SETUP.md)
- [Gemma 4 Integration](../ghost-claw-os/docs/GEMMA4-INTEGRATION-GUIDE.md)
- [System Architecture](../ghost-claw-os/docs/03-SYSTEM-ARCHITECTURE.md)
EOF

echo -e "${GREEN}✓ Installation guide created${NC}"
echo ""

# Step 9: Summary
echo -e "${GREEN}===================================="
echo "✅ APK Build Complete!"
echo "====================================${NC}"
echo ""
echo "📦 Output Files:"
echo "  APK: $DIST_DIR/ghost-claw-os.apk"
echo "  Metadata: $DIST_DIR/metadata.json"
echo "  Guide: $DIST_DIR/INSTALL.md"
echo ""
echo "📊 APK Information:"
echo "  Size: $APK_SIZE"
echo "  MD5: $APK_MD5"
echo ""
echo "🚀 Next Steps:"
echo "  1. Transfer APK to Android device"
echo "  2. Enable Unknown Sources in Settings"
echo "  3. Tap APK to install"
echo "  4. Launch Ghost Claw OS"
echo ""
echo "📱 Or use adb:"
echo "  adb install -r $DIST_DIR/ghost-claw-os.apk"
echo ""
echo "🎯 For Play Store:"
echo "  ./scripts/build-app-bundle.sh"
echo ""
