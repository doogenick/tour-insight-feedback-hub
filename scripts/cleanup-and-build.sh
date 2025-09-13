#!/bin/bash

# Cleanup and Build Script for Nomad Feedback App
# This script helps clean up old app data and build the new version

echo "🧹 Starting cleanup and build process..."

# 1. Clean up old app data from local storage
echo "📱 Cleaning up old app data..."
echo "Please manually uninstall the old 'Safari Feedback App' from your Android device"
echo "This will remove all old local data and prevent conflicts"

# 2. Build the web app
echo "🌐 Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

# 3. Sync with Capacitor
echo "📱 Syncing with Capacitor..."
npx cap sync

# 4. Build Android app
echo "🤖 Building Android app..."
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Android build failed. Please check for errors."
    exit 1
fi

cd ..

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Uninstall the old 'Safari Feedback App' from your Android device"
echo "2. Install the new APK from: android/app/build/outputs/apk/debug/app-debug.apk"
echo "3. The new app will be called 'Nomadtours Feedback' (version 1.0.5)"
echo "4. Only the new app will be able to write data to the database"
echo ""
echo "🔒 Security features:"
echo "- App version tracking (1.0.5)"
echo "- Client identifier validation (nomad-feedback-mobile)"
echo "- Database access control via RLS policies"
echo "- Automatic cleanup of old version data"
