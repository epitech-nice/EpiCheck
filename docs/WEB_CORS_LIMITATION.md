# Web Platform CORS Limitation

## Problem Overview

The Epitech Intranet API (`https://intra.epitech.eu`) does not support Cross-Origin Resource Sharing (CORS), which prevents web browsers from making direct API calls to the Intranet from web applications.

### What is CORS?

CORS is a security feature implemented by web browsers to prevent malicious websites from accessing APIs on different domains. When a web app tries to access `intra.epitech.eu`, the browser blocks the request unless the API explicitly allows it via CORS headers.

### Error Message

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://intra.epitech.eu/user/?format=json. (Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 403.
```

## Why Mobile Works But Web Doesn't

| Platform | CORS Restrictions | Explanation |
|----------|-------------------|-------------|
| **Mobile (iOS/Android)** | ✅ No restrictions | Native apps don't have CORS. HTTP requests work directly. |
| **Web Browser** | ❌ Blocked by CORS | Browsers enforce same-origin policy for security. |

## Current Status

✅ **Working on Mobile:**
- Cookie extraction via WebView
- Direct API calls to Intranet
- Full functionality

❌ **Limited on Web:**
- Cookie can be stored
- API calls are blocked by browser
- Cannot fetch user data, activities, presence, etc.

---

## Solutions

### Solution 1: Use Mobile App (Current Approach) ✅

**Recommendation:** Inform web users that full functionality requires the mobile app.

**Pros:**
- No additional development
- Maintains security
- Simple to implement

**Cons:**
- Web version has limited functionality

**Implementation:** ✅ Already done
- Warning messages in UI
- Clear guidance to download mobile app

---

### Solution 2: Backend Proxy Server

Create a backend server that forwards requests to Epitech Intranet, bypassing CORS restrictions.

**Architecture:**
```
Web App → Your Backend Proxy → Epitech Intranet API
```

**Example Implementation (Node.js/Express):**

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for your web app
app.use(express.json());

// Proxy endpoint
app.post('/api/intra-proxy', async (req, res) => {
  const { endpoint, cookie } = req.body;
  
  try {
    const response = await axios.get(`https://intra.epitech.eu${endpoint}`, {
      headers: {
        'Cookie': `user=${cookie}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

**Frontend Update:**
```typescript
// intraApi.ts - Add proxy mode for web
const BASE_URL = Platform.OS === 'web' 
  ? 'https://your-proxy-server.com/api/intra-proxy'
  : 'https://intra.epitech.eu';
```

**Pros:**
- Full functionality on web
- Secure (your server handles authentication)
- Can add caching, rate limiting

**Cons:**
- Requires backend infrastructure
- Additional hosting costs
- Maintenance overhead
- Security responsibility

**Deployment Options:**
- Heroku (free tier available)
- Vercel/Netlify (serverless functions)
- AWS Lambda
- Your own VPS

---

### Solution 3: Browser Extension

Create a browser extension that bypasses CORS restrictions.

**How it works:**
- Browser extensions can make cross-origin requests
- Extension acts as a bridge between web app and API

**Pros:**
- No backend needed
- Full API access

**Cons:**
- Users must install extension
- Limited to Chrome/Firefox/Edge
- Additional app to maintain
- Not suitable for mobile web

---

### Solution 4: Use Epitech's Official OAuth (if available)

Check if Epitech provides an official OAuth flow or API key system for third-party apps.

**Steps:**
1. Contact Epitech IT department
2. Request API access or OAuth credentials
3. Use official authentication flow

**Pros:**
- Official support
- Proper CORS headers
- No workarounds needed

**Cons:**
- May not be available
- Requires Epitech approval
- Potential delays

---

## Recommended Approach

For this project: **Solution 1** (Use Mobile App)

**Rationale:**
- EpiCheck is primarily a mobile app
- RFID/NFC scanning requires mobile device
- QR code scanning requires camera
- Cookie extraction works better on mobile
- No backend infrastructure needed

**Web Version Purpose:**
- Development/testing
- Limited administrative access
- Cookie management via Settings

---

## Alternative: Make Web Read-Only

Instead of full functionality, make the web version read-only with cached data:

1. Mobile app syncs data to local storage
2. Web version displays cached data
3. Users must use mobile for updates

**Example:**
```typescript
if (Platform.OS === 'web') {
  // Show cached data only
  return getCachedActivities();
} else {
  // Fetch fresh data from API
  return fetchActivitiesFromIntranet();
}
```

---

## Testing CORS Solutions

### Test if proxy works:
```bash
curl -X POST http://localhost:3000/api/intra-proxy \
  -H "Content-Type: application/json" \
  -d '{"endpoint": "/user/?format=json", "cookie": "YOUR_COOKIE"}'
```

### Test browser extension:
1. Load unpacked extension in Chrome
2. Check console for CORS errors
3. Verify API calls succeed

---

## Security Considerations

### If implementing proxy server:

1. **Authentication:** Validate cookies server-side
2. **Rate Limiting:** Prevent abuse
3. **Logging:** Track API usage
4. **HTTPS:** Always use encrypted connections
5. **Environment Variables:** Store sensitive config securely

### Example Security Middleware:
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Cookie validation
function validateCookie(cookie) {
  // Add validation logic
  return cookie && cookie.length > 50;
}
```

---

## Conclusion

**Current Status:** Web platform has CORS limitations (expected behavior)

**Best Solution:** Use mobile app for full functionality

**If backend is needed:** Implement Solution 2 (Proxy Server) with proper security measures

**For now:** Web version can be used for cookie management and testing, while mobile app provides full functionality including API access, NFC scanning, and QR code scanning.
