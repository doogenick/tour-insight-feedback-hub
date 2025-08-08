# Tour Insight Mobile App Deployment Guide

## Prerequisites Setup

### 1. Android Studio Installation & Setup
1. Download and install Android Studio from [developer.android.com](https://developer.android.com/studio)
2. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform-Tools
   - Android Virtual Device (AVD)
3. Open Android Studio and complete the setup wizard
4. Install at least one Android SDK version (API 30+ recommended)

### 2. Environment Setup
1. Add Android SDK to your PATH:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
2. Restart your terminal/command prompt

## Project Setup

### 1. Export and Clone Project
1. In Lovable, click "Export to Github" button (top right)
2. Clone your repository locally:
   ```bash
   git clone YOUR_GITHUB_REPO_URL
   cd your-project-name
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Android Platform
```bash
npx cap add android
```

### 4. Update Platform Dependencies
```bash
npx cap update android
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Build Backend (if needed)
```bash
npm run build
```

### 4. Start Backend Server
```bash
npm run dev
```
**Keep this terminal window open** - the backend will run on http://localhost:3001

## Mobile App Build & Deployment

### 1. Open New Terminal Window
Navigate back to project root (keep backend running in the other terminal):
```bash
cd .. # Go back to project root
```

### 2. Build the Frontend
```bash
npm run build
```

### 3. Sync to Android
```bash
npx cap sync android
```

### 4. Open Android Project
```bash
npx cap open android
```
This opens the project in Android Studio.

### 5. Configure Android Studio
1. Wait for Gradle sync to complete (status bar at bottom)
2. If prompted, update Gradle plugin and Android Gradle Plugin
3. Ensure your Android SDK is properly configured

### 6. Set Up Device/Emulator

#### Option A: Physical Device (Xiaomi Redmi Tablet)
1. Enable Developer Options on your tablet:
   - Go to Settings → About Tablet
   - Tap "MIUI Version" 7 times
   - Developer Options will appear in Settings
2. Enable USB Debugging in Developer Options
3. Connect tablet via USB
4. Accept USB debugging prompt on tablet

#### Option B: Virtual Device (Emulator)
1. In Android Studio: Tools → AVD Manager
2. Click "Create Virtual Device"
3. Choose a tablet device (e.g., Pixel C)
4. Select API level 30+
5. Click "Finish" and start the emulator

### 7. Run the App
1. In Android Studio, click the green "Run" button (play icon)
2. Select your device (physical tablet or emulator)
3. App will install and launch automatically

## Testing Offline Functionality

### 1. Test Data Collection
1. Fill out a feedback form while connected to WiFi
2. Turn off WiFi on the tablet
3. Fill out another feedback form (should save locally)
4. Turn WiFi back on
5. Check that both feedbacks sync to the backend

### 2. Verify Local Storage
- Forms should save even without internet
- Data should automatically sync when connection returns
- Check LocalForage in browser dev tools (if using web view)

## Troubleshooting

### Backend Issues
- **Port already in use**: Kill process on port 3001 or change port in backend/src/index.ts
- **Dependencies missing**: Run `npm install` in backend directory
- **Build fails**: Check Node.js version (16+ recommended)

### Android Build Issues
- **Gradle sync fails**: Update Android Gradle Plugin in Android Studio
- **SDK not found**: Verify ANDROID_HOME environment variable
- **Build tools missing**: Install via SDK Manager in Android Studio

### Device Connection Issues
- **Device not detected**: Enable USB Debugging and accept prompts
- **Permission denied**: Check USB cable and connection
- **Driver issues**: Install device-specific USB drivers

### App Runtime Issues
- **White screen**: Check console logs in Chrome DevTools (chrome://inspect)
- **Network errors**: Verify backend is running and accessible
- **Data not syncing**: Check network connectivity and backend endpoints

## Production Deployment

### 1. Build Release APK
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Choose APK
3. Create/use keystore for signing
4. Build release APK

### 2. Install on Devices
```bash
adb install app-release.apk
```

## Daily Development Workflow

### 1. Start Development Session
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend development
cd .. && npm run dev

# For mobile testing:
npm run build && npx cap sync android && npx cap run android
```

### 2. Code Changes
- Make changes in Lovable or your IDE
- For mobile: rebuild and sync after significant changes
- Use hot reload for web development

### 3. Testing Cycle
1. Test in web browser first
2. Build and test on mobile when ready
3. Test offline functionality regularly

## Important Notes

- **Always keep backend running** when testing mobile app
- **Sync after changes**: Run `npx cap sync android` after frontend changes
- **Network configuration**: Update API URLs in app if backend runs on different port
- **Data persistence**: LocalForage handles offline storage automatically
- **Hot reload**: Available via Capacitor configuration for faster development

## File Locations
- **Frontend code**: `src/` directory
- **Backend code**: `backend/src/` directory
- **Android project**: `android/` directory (created after `npx cap add android`)
- **Build output**: `dist/` directory
- **APK output**: `android/app/build/outputs/apk/`