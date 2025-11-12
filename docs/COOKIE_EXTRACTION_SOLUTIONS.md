# Cookie Extraction Solutions for Epitech Intranet

## Problem Overview

The Epitech Intranet authentication system uses an **HttpOnly cookie** named `user` for session management. This cookie cannot be accessed via JavaScript's `document.cookie` API due to security restrictions, making automatic cookie extraction challenging in mobile WebView environments.

## Cookie Characteristics

- **Name**: `user`
- **Domain**: `intra.epitech.eu`
- **HttpOnly**: ✅ Yes (cannot be read by JavaScript)
- **Secure**: ✅ Yes (HTTPS only)
- **SameSite**: Lax/Strict (varies by browser)

## Extraction Strategies

### 1. **JavaScript Extraction** (Limited)

**Method**: Inject JavaScript into WebView to read `document.cookie`

```javascript
window.ReactNativeWebView.postMessage(document.cookie);
```

**Pros**:

- Simple implementation
- Works in all environments

**Cons**:

- ❌ **Cannot access HttpOnly cookies**
- Only retrieves `gdpr` cookie, not the `user` authentication cookie

**Status**: ⚠️ Partially working (only non-HttpOnly cookies)

---

### 2. **Native Cookie Manager** (Requires Dev Build)

**Method**: Use `@react-native-cookies/cookies` package

```typescript
import CookieManager from "@react-native-cookies/cookies";
const cookies = await CookieManager.get("https://intra.epitech.eu");
const userCookie = cookies.user?.value;
```

**Pros**:

- ✅ Can access HttpOnly cookies via native API
- Works on both iOS and Android

**Cons**:

- ❌ Requires custom development build (doesn't work in Expo Go)
- ❌ Needs proper linking with `expo prebuild`
- ❌ Module import can be fragile

**Status**: 🔧 Implemented but requires proper dev build setup

**Setup Instructions**:

```bash
# 1. Install dependencies
npm install @react-native-cookies/cookies

# 2. Rebuild native modules
npx expo prebuild --clean

# 3. Build development version
npx expo run:android  # or expo run:ios
```

---

### 3. **Manual Cookie Input** (Always Works)

**Method**: User manually extracts cookie via browser DevTools

**Steps for Users**:

1. Open `intra.epitech.eu` in browser
2. Login with Office365 credentials
3. Press `F12` → Application → Cookies → `intra.epitech.eu`
4. Copy the `user` cookie value
5. Go to app Settings → Developer Options
6. Paste cookie and click "SET COOKIE"

**Pros**:

- ✅ Always works (no technical limitations)
- ✅ Works in Expo Go
- ✅ No native dependencies

**Cons**:

- ⏱️ Requires manual user intervention
- 📚 Needs user education

**Status**: ✅ Fully implemented and working

---

## Current Implementation

### Mobile (Android/iOS)

The app uses a **dual-strategy approach**:

1. **Automatic Extraction** (1-2 seconds)
    - Try JavaScript extraction first
    - Fallback to native Cookie Manager
    - Both happen in background

2. **Manual Fallback** (shows after failures)
    - If both automatic methods fail
    - Display clear instructions banner
    - Direct link to Settings

### Web Platform

- **Manual only**: Displays step-by-step instructions
- WebView not available on web
- Users guided through browser DevTools method

---

## Platform-Specific Behavior

| Platform                    | JavaScript | Native API | Manual | Default Method |
| --------------------------- | ---------- | ---------- | ------ | -------------- |
| **Expo Go (iOS/Android)**   | ⚠️ Partial | ❌ No      | ✅ Yes | Manual         |
| **Dev Build (iOS/Android)** | ⚠️ Partial | ✅ Yes     | ✅ Yes | Native API     |
| **Web Browser**             | ❌ No      | ❌ No      | ✅ Yes | Manual         |

---

## Troubleshooting

### Issue: "CookieManager not available"

**Cause**: Running in Expo Go or native module not properly linked

**Solution**:

```bash
# Clean and rebuild
npx expo prebuild --clean
cd android && ./gradlew clean && cd ..
npx expo run:android
```

### Issue: "Cookie string is empty"

**Cause**: HttpOnly cookie blocking JavaScript access

**Expected Behavior**: This is normal. The app should automatically try native API next.

**What You'll See**:

```
[Mobile] Cookie string is empty
[Mobile] ⚠ Cookie empty (likely HttpOnly), trying native API...
[Mobile] Attempting native cookie extraction...
```

### Issue: "All extraction methods failed"

**Cause**: Both JavaScript and native API failed

**Solution**: Use manual cookie input

1. Click "Go to Settings" in the warning banner
2. Follow Developer Options instructions

---

## Future Improvements

### Possible Solutions (Not Implemented)

1. **Network Intercept**: Intercept HTTP requests to read Set-Cookie headers
    - Complex implementation
    - May violate platform policies

2. **Proxy Server**: Route requests through custom proxy
    - Requires backend infrastructure
    - Privacy concerns

3. **OAuth Token Exchange**: Request Epitech to provide OAuth token API
    - Best long-term solution
    - Requires Epitech API changes

---

## Developer Notes

### Log Prefixes

- `[Mobile]` - Mobile authentication component
- `[WebView]` - JavaScript running inside WebView
- `[Auth]` - Main authentication routing

### Key Files

- `/screens/IntraWebViewAuth.tsx` - Mobile/Web authentication
- `/screens/SettingsScreen.tsx` - Manual cookie input
- `/services/intraAuth.ts` - Cookie storage and management

### Testing

**Expo Go**:

```bash
npm start
# Scan QR code with Expo Go app
# Expected: Manual input required
```

**Dev Build**:

```bash
npx expo run:android
# Expected: Automatic extraction via native API
```

---

## Summary

The **HttpOnly cookie limitation is a security feature**, not a bug. Our implementation provides:

1. **Best effort automation** (when possible)
2. **Graceful degradation** (manual fallback)
3. **Clear user guidance** (step-by-step instructions)

For the best user experience, recommend using a **custom development build** where the native Cookie Manager API can access HttpOnly cookies.
