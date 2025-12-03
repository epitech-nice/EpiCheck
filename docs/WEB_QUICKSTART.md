# 🌐 EpiCheck Web Platform - Quick Start Guide

This guide will help you run EpiCheck on web browsers with full API functionality.

## 🚨 Prerequisites

Before starting the web version, you need to run the **CORS Proxy Server** to bypass browser security restrictions.

## 🚀 Quick Start

### 1. Start the Proxy Server

Open a terminal and run:

```bash
cd proxy-server
npm install  # Only needed first time
npm start
```

You should see:

```
🚀 EpiCheck CORS Proxy Server running on port 3001
📍 Health check: http://localhost:3001/health
🔗 Proxy endpoint: http://localhost:3001/api/intra-proxy
```

**Keep this terminal open!** The proxy must run in the background while using the web app.

### 2. Start the Expo Web App

Open a **new terminal** and run:

```bash
npm start
# Then press 'w' to open in web browser
```

Or directly:

```bash
npm run web
```

The web app will open at `http://localhost:8081`

## 🔐 Authentication on Web

1. Click **"🔐 Login with Office365"** button
2. A new tab opens with Epitech Intranet login
3. Login with your Office365 account
4. After successful login, open DevTools (F12)
5. Go to: **Application** → **Cookies** → **intra.epitech.eu**
6. Find the **"user"** cookie
7. **Copy its entire value** (should be ~200+ characters)
8. Return to the EpiCheck tab
9. **Paste the cookie** in the input field
10. Click **Submit**

## ✅ Verification

After authentication:

- You should see a success message
- The app will load your user profile
- All API calls go through the proxy server (check console logs)

## 🛠️ Troubleshooting

### Error: "Failed to fetch" or "Network request failed"

**Problem:** Proxy server is not running

**Solution:**

```bash
cd proxy-server
npm start
```

### Error: "EADDRINUSE: Port 3001 already in use"

**Problem:** Port 3001 is occupied

**Solution:** Kill the process or change port:

```bash
# Option 1: Kill existing process
lsof -ti:3001 | xargs kill

# Option 2: Change port in proxy-server/.env
PORT=3002
```

Then update `PROXY_BASE_URL` in `services/intraApi.ts`:

```typescript
const PROXY_BASE_URL = "http://localhost:3002/api/intra-proxy";
```

### API calls still fail

1. **Check proxy server is running:**

    ```bash
    curl http://localhost:3001/health
    ```

    Should return: `{"status":"ok",...}`

2. **Check browser console** for error messages

3. **Verify cookie is saved:**
    - Open DevTools → Application → Local Storage
    - Look for `intra_cookie` key

4. **Test proxy directly:**
    ```bash
    curl -X POST http://localhost:3001/api/intra-proxy \
      -H "Content-Type: application/json" \
      -d '{"endpoint":"/user/?format=json","cookie":"YOUR_COOKIE","method":"GET"}'
    ```

## 📊 Monitoring

### Check Proxy Logs

The terminal running the proxy server shows all requests:

```
[2025-11-12T10:30:00.000Z] GET /user/?format=json | Cookie: abc123...
[2025-11-12T10:30:15.000Z] GET /planning/load?location=FR/PAR&... | Cookie: abc123...
```

### Check API Requests

Open browser DevTools → Network tab:

- Filter by `intra-proxy` to see all API calls
- All requests go to `localhost:3001` instead of `intra.epitech.eu`

## 🎯 Architecture Overview

```
┌─────────────────┐
│  Web Browser    │
│  (localhost:    │
│   8081)         │
└────────┬────────┘
         │
         │ API Requests
         ▼
┌─────────────────┐
│ Proxy Server    │  ← Bypasses CORS
│ (localhost:     │
│  3001)          │
└────────┬────────┘
         │
         │ Forwarded with Cookie
         ▼
┌─────────────────┐
│ Epitech         │
│ Intranet API    │
│ (intra.epitech  │
│  .eu)           │
└─────────────────┘
```

## 🔒 Security Notes

- **Cookie storage:** Cookies are stored in browser's `localStorage` (not secure for production)
- **Proxy server:** Only accessible on localhost (127.0.0.1)
- **Rate limiting:** 100 requests per 15 minutes per IP
- **HTTPS:** Not used locally (development only)

⚠️ **For production deployment:**

- Deploy proxy server to a secure hosting service
- Use HTTPS for all connections
- Implement proper cookie encryption
- Add authentication middleware

## 📚 Additional Resources

- [Proxy Server Setup](../proxy-server/README.md) - Detailed proxy documentation
- [CORS Explanation](WEB_CORS_LIMITATION.md) - Why we need a proxy
- [Main README](../README.md) - General project documentation

## 💡 Tips

1. **Keep proxy running:** Leave the proxy terminal open while developing
2. **Cookie expiration:** Intranet cookies expire after ~24 hours, re-authenticate if needed
3. **DevTools:** Keep browser DevTools open to monitor requests and errors
4. **Mobile recommended:** For production use, mobile apps (iOS/Android) are more reliable

## 🚀 Production Deployment

For deploying to production, see:

- [proxy-server/README.md](../proxy-server/README.md#-deployment) for deployment options
- Update `PROXY_BASE_URL` in `intraApi.ts` to your deployed proxy URL
- Configure `ALLOWED_ORIGINS` in proxy server to your web app domain

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
