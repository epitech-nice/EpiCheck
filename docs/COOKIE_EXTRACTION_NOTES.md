# Cookie Extraction Implementation Notes

## Current Implementation (Updated: Nov 10, 2025)

The `IntraWebViewAuth` screen now uses a **WebView message-passing approach** for cookie extraction on all platforms (web, iOS, Android).

### How It Works

1. **User navigates** through Office365 OAuth in the WebView.
2. **When reaching the Intranet home** (`https://intra.epitech.eu` without `/auth/office365`), the app injects JavaScript into the page:
    ```javascript
    window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage(document.cookie);
    ```
3. **The `onMessage` handler** receives the posted `document.cookie` string, parses it, and looks for the `user` cookie.
4. **If found**, calls `onSuccess(cookie)` and the user is authenticated.

### Why This Approach?

- **Cross-platform**: Works on web (Expo web), iOS, and Android without needing native modules.
- **No native linking required**: The `@react-native-cookies/cookies` package was not properly linked/loaded (showed `{"default": undefined}`), so we removed the native cookie extraction code and rely on the WebView JS injection method.
- **Simpler**: No complex native module configuration or platform-specific cookie manager APIs.

### Important Limitations

#### HttpOnly Cookies

If the Intranet sets the `user` cookie with the **HttpOnly** flag, `document.cookie` in JavaScript **will not be able to access it**. This is a security feature of browsers.

**Solutions if the cookie is HttpOnly:**

1. **Server-side redirect with token in URL**: After OAuth, redirect to a custom URL with the auth token in the fragment or query parameter, and intercept it in the app.
2. **Use a different cookie**: If the server also sets a non-HttpOnly session cookie or token, use that instead.
3. **Native cookie extraction (requires native module setup)**: Native CookieManager APIs can sometimes access HttpOnly cookies (platform-dependent). To enable this:
    - Ensure `@react-native-cookies/cookies` is properly installed and linked.
    - For bare React Native:
        ```bash
        yarn add @react-native-cookies/cookies
        npx pod-install ios   # iOS
        yarn android          # rebuild Android
        ```
    - For Expo managed workflow: you'll need to use a **dev client** or **prebuild** (Expo Go doesn't support custom native modules).
    - Re-enable the native extraction code in `IntraWebViewAuth.tsx` (currently removed/commented out).

#### Cross-Origin / SameSite Restrictions

Cookies with `SameSite=Strict` or `SameSite=Lax` may not be visible in all contexts. Modern browsers and WebView implementations enforce strict cookie policies.

### Testing

#### Web (Browser)

1. Start the dev server:
    ```bash
    npm start -- --web
    # or
    expo start --web
    ```
2. Open the app in a browser and navigate to the WebView auth screen.
3. Sign in with Office365.
4. Watch the browser console for logs:
    - "Reached Intranet home, attempting to extract cookie via WebView message..."
    - "User cookie received from webview" (if successful)
    - "User cookie not found in document.cookie" (if the cookie is not accessible)

#### iOS / Android

1. Build and run the app on a device or simulator:
    ```bash
    npm run ios    # or expo run:ios
    npm run android # or expo run:android
    ```
2. Navigate to the WebView auth screen and sign in.
3. Check the logs (React Native debugger or `react-native log-ios` / `react-native log-android`).
4. The `onMessage` handler should receive the cookies and log them.

### Future Enhancements

- **Add fallback to manual login**: If cookie extraction fails, show a manual login form.
- **Server-side token exchange**: Implement a redirect flow where the server appends a short-lived token to the redirect URL, which the app intercepts and exchanges for a session.
- **Native cookie extraction (optional)**: Re-enable the native CookieManager code if you need to access HttpOnly cookies on mobile and are willing to set up native modules.

### Code Location

- **File**: `/screens/IntraWebViewAuth.tsx`
- **Key Functions**:
    - `handleWebMessage(event)`: Parses `document.cookie` posted from the WebView.
    - `handleNavigationStateChange(navState)`: Injects JavaScript to request cookies when the user reaches the Intranet home.
    - `injectedJavaScript`: Injects dark-mode CSS if the app theme is dark.

### Dependencies

- `react-native-webview`: Provides WebView component with `onMessage` and `injectJavaScript` support.
- `@react-native-cookies/cookies`: Installed but not currently used (native module not linked). Can be removed if not needed, or kept for future native extraction.

### Troubleshooting

**No cookie received / "User cookie not found":**

- Check if the cookie is HttpOnly (inspect in browser DevTools > Application > Cookies).
- Verify the cookie name is exactly `user` (case-sensitive).
- Ensure the Intranet page is on `https://intra.epitech.eu` (check `currentUrl` in logs).
- Check for CORS or SameSite restrictions in the Intranet server config.

**WebView not injecting JavaScript:**

- Ensure `javaScriptEnabled={true}` and `domStorageEnabled={true}` props are set on the WebView (they are in the current code).
- Check if `window.ReactNativeWebView` exists in the page context (log it from the injected script).

**Dark mode not working in WebView:**

- The `injectedJavaScript` prop applies a CSS filter to invert colors. This is a visual workaround and not a true dark theme. For a proper dark theme, the Intranet page would need to support a dark color scheme natively.

---

**Last Updated**: November 10, 2025  
**Implementation**: WebView message-passing approach (no native cookie module required)
