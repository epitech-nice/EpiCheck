# EpiCheck CORS Proxy Server

This proxy server forwards requests to the Epitech Intranet API, bypassing CORS restrictions for web browsers.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd proxy-server
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if needed (default settings work for local development).

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "service": "EpiCheck CORS Proxy"
}
```

### Proxy Endpoint
```
POST /api/intra-proxy
```

**Request Body:**
```json
{
  "endpoint": "/user/?format=json",
  "cookie": "your-intranet-cookie-value",
  "method": "GET"
}
```

**Response:**
Returns the data from Epitech Intranet API

**Example using curl:**
```bash
curl -X POST http://localhost:3001/api/intra-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "/user/?format=json",
    "cookie": "YOUR_COOKIE_HERE",
    "method": "GET"
  }'
```

## 🔒 Security Features

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Helmet.js:** Security headers
- **CORS:** Configurable allowed origins
- **Input Validation:** Validates endpoint and cookie parameters
- **Error Handling:** Graceful error responses

## 🌍 Deployment

### Option 1: Heroku

1. Install Heroku CLI: `brew install heroku` (macOS)
2. Login: `heroku login`
3. Create app: `heroku create epicheck-proxy`
4. Deploy: `git push heroku main`
5. Set environment variables:
   ```bash
   heroku config:set ALLOWED_ORIGINS=https://your-web-app.com
   heroku config:set NODE_ENV=production
   ```

### Option 2: Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variables in Vercel dashboard

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select `proxy-server` directory
4. Set environment variables
5. Deploy

### Option 4: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `proxy-server` directory
3. Configure build command: `npm install`
4. Configure run command: `npm start`
5. Deploy

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `*` | No |
| `NODE_ENV` | Environment (development/production) | `development` | No |

### CORS Configuration

To restrict access to specific domains, set `ALLOWED_ORIGINS`:

```bash
# .env
ALLOWED_ORIGINS=https://your-app.com,https://www.your-app.com
```

For local development:
```bash
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

## 📊 Monitoring

### Logs

The server logs all requests:
```
[2025-11-12T10:30:00.000Z] GET /user/?format=json | Cookie: abc123...
```

### Health Check

Monitor server health:
```bash
curl http://localhost:3001/health
```

## 🐛 Troubleshooting

### Error: EADDRINUSE

Port 3001 is already in use. Either:
- Change the port in `.env`: `PORT=3002`
- Kill the process using port 3001: `lsof -ti:3001 | xargs kill`

### Error: Cannot connect to Intranet

Check if:
- Intranet is accessible: `curl https://intra.epitech.eu`
- Cookie is valid
- Network allows outgoing HTTPS requests

### CORS errors persist

Make sure:
- Proxy server is running
- React Native app is configured to use proxy URL
- `ALLOWED_ORIGINS` includes your web app domain

## 📝 License

MIT
