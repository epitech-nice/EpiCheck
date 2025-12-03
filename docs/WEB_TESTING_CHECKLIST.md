# ✅ Web Platform Testing Checklist

Use this checklist to verify that the web platform implementation works correctly.

## 🚀 Before You Start

- [ ] Node.js is installed (v16 or higher)
- [ ] You have a valid Epitech Intranet account
- [ ] You're connected to the internet

## 📋 Testing Steps

### 1️⃣ Start the Proxy Server

```bash
cd proxy-server
node server.js
```

**Expected output:**

```
🚀 EpiCheck CORS Proxy Server running on port 3001
📍 Health check: http://localhost:3001/health
🔗 Proxy endpoint: http://localhost:3001/api/intra-proxy
```

- [ ] Proxy server starts without errors
- [ ] Port 3001 is available
- [ ] Health check URL is displayed

**Verify:** Test health endpoint

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
    "status": "ok",
    "timestamp": "2025-11-12T...",
    "service": "EpiCheck CORS Proxy"
}
```

- [ ] Health check returns `"status":"ok"`

---

### 2️⃣ Start the Web App

**Open a NEW terminal** (keep proxy running!) and run:

```bash
npm run web
```

Or:

```bash
npm start
# Then press 'w' for web
```

**Expected:**

- [ ] Metro bundler starts
- [ ] Web app opens in browser at `http://localhost:8081`
- [ ] Login screen is visible

---

### 3️⃣ Authentication

1. **Click "Login with Intranet" button**
    - [ ] Button is visible on login screen
    - [ ] Clicking opens authentication modal/screen

2. **Click "🔐 Login with Office365"**
    - [ ] New browser tab opens
    - [ ] URL is `https://intra.epitech.eu`
    - [ ] Office365 login page appears

3. **Login with Office365**
    - [ ] Enter your Epitech email
    - [ ] Enter your password
    - [ ] Successfully logged in
    - [ ] Redirected to Intranet homepage

4. **Extract Cookie**
    - [ ] Press F12 (or right-click → Inspect)
    - [ ] DevTools opens
    - [ ] Navigate to: **Application** → **Cookies** → **intra.epitech.eu**
    - [ ] "user" cookie is visible
    - [ ] Cookie value is ~200+ characters

5. **Copy Cookie Value**
    - [ ] Click on the cookie value
    - [ ] Right-click → Copy or Ctrl+C
    - [ ] Value is in clipboard

6. **Return to EpiCheck Tab**
    - [ ] Switch back to `localhost:8081` tab
    - [ ] Cookie input field is visible

7. **Paste Cookie**
    - [ ] Click in the input field
    - [ ] Paste (Ctrl+V or Cmd+V)
    - [ ] Cookie value appears (truncated display is OK)

8. **Submit**
    - [ ] Click "Submit" or "Save" button
    - [ ] Loading indicator appears
    - [ ] Success alert shows:
        ```
        ✅ Authentication Successful
        Your Intranet cookie has been saved!
        🚀 The app now uses a proxy server...
        ```
    - [ ] Modal/screen closes

---

### 4️⃣ Verify User Profile

After authentication:

- [ ] User profile screen loads
- [ ] Your name is displayed
- [ ] Your email is displayed
- [ ] Profile picture loads (if available)
- [ ] No error messages in UI

**Check Browser Console (F12 → Console):**

- [ ] Look for: `✓ Using Intranet cookie for request`
- [ ] Look for: `🌐 Making proxy request`
- [ ] No CORS errors
- [ ] No 401/403 authentication errors

**Check Proxy Server Terminal:**

- [ ] Look for: `[2025-11-12T...] GET /user/?format=json | Cookie: ...`
- [ ] Request completed successfully

---

### 5️⃣ Test Activities Screen

1. **Navigate to Activities**
    - [ ] Click "Activities" button/tab
    - [ ] Activities screen loads

2. **Check Activity List**
    - [ ] List of activities/events appears
    - [ ] Each activity shows:
        - [ ] Event name
        - [ ] Date and time
        - [ ] Location
    - [ ] No errors displayed

**Check Browser Console:**

- [ ] Look for: `Fetching activities from Intra API`
- [ ] Look for: `Activities response: X events`
- [ ] No errors

**Check Proxy Server Terminal:**

- [ ] Look for: `GET /planning/load?location=...`
- [ ] Request completed successfully

---

### 6️⃣ Test Presence Marking (Optional)

**Prerequisites:**

- You must be an assistant/teacher for an event
- There must be an active event

1. **Select an Event**
    - [ ] Click on an event in the list
    - [ ] Event details appear

2. **View Registered Students**
    - [ ] List of students loads
    - [ ] Student names are visible

3. **Mark Presence**
    - [ ] Click "Present" or "Absent" for a student
    - [ ] Loading indicator appears
    - [ ] Success message shows
    - [ ] Student status updates

**Check Proxy Server Terminal:**

- [ ] Look for: `POST /module/.../updateregistered`
- [ ] Request completed successfully

---

## 🐛 Troubleshooting

### ❌ Issue: "Failed to fetch" or "Network request failed"

**Diagnosis:**

- Proxy server is not running
- Wrong proxy URL

**Solution:**

1. Check proxy server terminal - is it running?
2. Test health check: `curl http://localhost:3001/health`
3. Restart proxy: `cd proxy-server && node server.js`

---

### ❌ Issue: "CORS header 'Access-Control-Allow-Origin' missing"

**Diagnosis:**

- App is not using proxy (still trying direct API)
- Platform detection failed

**Solution:**

1. Open `services/intraApi.ts`
2. Verify `this.isWeb = Platform.OS === "web";` (line ~43)
3. Add console log: `console.log("Platform:", Platform.OS, "isWeb:", this.isWeb);`
4. Refresh browser
5. Check console - should show: `Platform: web isWeb: true`

---

### ❌ Issue: "Cookie expired" or "Session expired"

**Diagnosis:**

- Intranet cookie expired (typically after 24 hours)

**Solution:**

1. Click "Logout" in app
2. Re-authenticate (steps 3️⃣ above)
3. Extract new cookie
4. Submit again

---

### ❌ Issue: Activities list is empty

**Diagnosis:**

- No activities scheduled for today
- Wrong location parameter
- Cookie doesn't have permissions

**Solution:**

1. Check Intranet website - are there activities today?
2. Try different date range
3. Verify your account has access to activities

---

### ❌ Issue: Port 3001 already in use

**Diagnosis:**

- Another process is using port 3001

**Solution:**

**Option 1:** Kill the process

```bash
lsof -ti:3001 | xargs kill
```

**Option 2:** Change port

1. Edit `proxy-server/.env`: `PORT=3002`
2. Edit `services/intraApi.ts`:
    ```typescript
    const PROXY_BASE_URL = "http://localhost:3002/api/intra-proxy";
    ```
3. Restart both proxy and app

---

## 📊 Success Indicators

### ✅ Proxy Server Logs (Expected)

```
🚀 EpiCheck CORS Proxy Server running on port 3001
[2025-11-12T11:00:13.169Z] GET /user/?format=json | Cookie: eyJ0eXAi...
[2025-11-12T11:00:13.978Z] GET /planning/load?location=FR%2FPAR&... | Cookie: eyJ0eXAi...
[2025-11-12T11:00:45.123Z] POST /module/.../updateregistered | Cookie: eyJ0eXAi...
```

### ✅ Browser Console Logs (Expected)

```
[Web] Submitting cookie: eyJ0eXAiOiJKV1QiL...
[Web] ✓ Cookie saved successfully
✓ Using Intranet cookie for request: /user/ | Cookie length: 203
🌐 Making proxy request: GET /user/?format=json
Fetching activities from Intra API: {location: "FR/PAR", startDate: "2025-11-12", endDate: "2025-11-12"}
🌐 Making proxy request: GET /planning/load?location=FR%2FPAR&...
Activities response: 5 events
```

### ✅ Network Tab (Expected)

**Filter by:** `intra-proxy`

You should see:

- `POST http://localhost:3001/api/intra-proxy` (Status: 200)
- Request payload contains: `{endpoint, cookie, method}`
- Response contains actual Intranet data

**You should NOT see:**

- Direct requests to `https://intra.epitech.eu` (those would fail with CORS)

---

## 🎉 All Tests Passed?

If you've checked all boxes above:

✅ **Web platform is working correctly!**

### Optional Next Steps:

1. **Deploy proxy to production** (see `proxy-server/README.md`)
2. **Update proxy URL** in `intraApi.ts` for production
3. **Add SSL/HTTPS** for secure deployment
4. **Implement token refresh** for expired cookies

---

## 📚 Need Help?

- **Quick Start Guide:** `/docs/WEB_QUICKSTART.md`
- **Proxy Documentation:** `/proxy-server/README.md`
- **CORS Explanation:** `/docs/WEB_CORS_LIMITATION.md`
- **Implementation Details:** `/docs/IMPLEMENTATION_COMPLETE.md`

---

**Happy Testing! 🚀**
