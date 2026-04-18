# 🚀 Ghost Claw OS - Quick Build Reference

## ⚡ One-Command Build

```bash
cd /home/ubuntu/advanced-ai-multi-tool && ./scripts/build-apk.sh
```

**That's it!** APK will be in `dist/ghost-claw-os.apk`

---

## 📱 Install on Device

```bash
# Via ADB
adb install -r dist/ghost-claw-os.apk

# Or transfer file and tap to install
```

---

## 🔍 Verify Build

```bash
# Check APK exists
ls -lh dist/ghost-claw-os.apk

# Check signature
jarsigner -verify dist/ghost-claw-os.apk

# Check size
du -h dist/ghost-claw-os.apk
```

---

## 📊 Build Information

| Item | Value |
|------|-------|
| **App Name** | Ghost Claw OS |
| **Package** | space.manus.advanced.ai.multi.tool |
| **Min Android** | 7.0 (API 24) |
| **Target Android** | 14 (API 34) |
| **Size** | ~150-200 MB |
| **Keystore** | android-release.keystore |
| **Key Alias** | ghostclaw |

---

## 🔑 Keystore Credentials

```
Password: ghostclaw123
Key Password: ghostclaw123
Validity: 10,000 days
```

---

## 🧪 Test Commands

```bash
# View logs
adb logcat | grep ghost-claw

# Check if installed
adb shell pm list packages | grep ghost

# Launch app
adb shell am start -n space.manus.advanced.ai.multi.tool/.MainActivity

# Clear app data
adb shell pm clear space.manus.advanced.ai.multi.tool
```

---

## 📁 Output Files

```
dist/
├── ghost-claw-os.apk      ← Main APK file
├── metadata.json          ← Build info
└── INSTALL.md             ← Installation guide
```

---

## 🎯 Next Steps

1. Run build script
2. Transfer APK to phone
3. Enable Unknown Sources
4. Tap APK to install
5. Launch app
6. Test functionality

---

**Build Status:** ✅ Ready  
**Last Updated:** April 18, 2026
