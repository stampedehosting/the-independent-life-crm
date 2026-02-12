# Quick Reference Card - The Independent Life CRM

## 🚀 Fast Track to Production (Step-by-Step)

### Prerequisites Checklist
```
□ Digital Ocean account
□ GitHub repository access
□ Node.js 18+ installed locally (for testing)
□ MongoDB connection string
□ API keys ready
```

### Step 1: Get API Keys (30 mins each)

**Twilio** (https://www.twilio.com/)
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**SendGrid** (https://sendgrid.com/)
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
SENDGRID_FROM_NAME=Your Company Name
```

**GoHighLevel** (Your account dashboard)
```bash
GOHIGHLEVEL_API_KEY=your_api_key_here
GOHIGHLEVEL_LOCATION_ID=your_location_id
```

**JWT Secret** (Generate it)
```bash
# Run this command to generate a secure secret:
openssl rand -base64 32

JWT_SECRET=<paste_generated_secret_here>
```

### Step 2: Database Setup (15 mins)

**Option A: Digital Ocean (Recommended)**
1. Go to: Digital Ocean Dashboard → Databases
2. Create → MongoDB → Version 6 or 7
3. Choose region (e.g., NYC3)
4. Select plan (Basic $15/month minimum)
5. Copy connection string
6. Save as: `MONGODB_URI=mongodb+srv://...`

**Option B: MongoDB Atlas**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create cluster → Free tier or paid
3. Setup → Network Access → Add 0.0.0.0/0
4. Setup → Database Access → Create user
5. Get connection string
6. Save as: `MONGODB_URI=mongodb+srv://...`

### Step 3: Deploy to Digital Ocean (30 mins)

**Using Web UI (Easiest)**
1. Login to Digital Ocean
2. Go to: Apps → Create App
3. Source: GitHub → Select repository
4. Settings:
   - Branch: `main`
   - Build: Auto-detect (Dockerfile)
   - Port: 3000
5. Add Environment Variables (from Step 1 & 2)
6. Click: Create Resources
7. Wait for deployment (~5-10 mins)

**Using CLI (Advanced)**
```bash
# Install doctl
brew install doctl  # macOS
# or download from: https://docs.digitalocean.com/reference/doctl/

# Authenticate
doctl auth init

# Deploy
cd the-independent-life-crm
doctl apps create --spec .do/app.yaml
```

### Step 4: Configure Environment Variables

In Digital Ocean App Settings → Environment Variables, add:

```bash
NODE_ENV=production
PORT=3000

# Database (from Step 2)
MONGODB_URI=<your_mongodb_connection_string>

# JWT (from Step 1)
JWT_SECRET=<your_generated_secret>

# Twilio (from Step 1)
TWILIO_ACCOUNT_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_token>
TWILIO_PHONE_NUMBER=<your_twilio_phone>

# SendGrid (from Step 1)
SENDGRID_API_KEY=<your_sendgrid_key>
SENDGRID_FROM_EMAIL=<your_email>
SENDGRID_FROM_NAME=The Independent Life CRM

# GoHighLevel (from Step 1)
GOHIGHLEVEL_API_KEY=<your_ghl_key>
GOHIGHLEVEL_LOCATION_ID=<your_location_id>

# Security (use defaults)
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (your domain or * for testing)
CORS_ORIGIN=*
```

### Step 5: Verify Deployment (5 mins)

```bash
# Test health endpoint
curl https://your-app-url.ondigitalocean.app/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}

# Test API info
curl https://your-app-url.ondigitalocean.app/

# Should return app info
```

### Step 6: Create First Admin User (2 mins)

```bash
curl -X POST https://your-app-url.ondigitalocean.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@yourcompany.com",
    "phone": "+1234567890",
    "password": "ChangeMe123!",
    "role": "admin"
  }'

# Save the returned token!
```

### Step 7: Test Client Creation (2 mins)

```bash
# Replace <TOKEN> with token from Step 6
curl -X POST https://your-app-url.ondigitalocean.app/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "firstName": "Test",
    "lastName": "Client",
    "email": "test@example.com",
    "phone": "+1234567890",
    "status": "lead"
  }'

# Should return created client
```

## 🛠️ Local Development Setup

```bash
# Clone repository
git clone https://github.com/stampedehosting/the-independent-life-crm.git
cd the-independent-life-crm

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env

# Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:7

# Run in development mode
npm run dev

# App runs at http://localhost:3000
```

## 📋 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run typecheck    # Type check without building
```

## 🔧 Troubleshooting

### Build Fails
```bash
# Check Node version (need 18+)
node --version

# Clean install
rm -rf node_modules package-lock.json
npm install

# Check build logs in DO dashboard
```

### Database Connection Error
```bash
# Verify MongoDB URI format:
# mongodb://localhost:27017/dbname (local)
# mongodb+srv://user:pass@cluster.mongodb.net/dbname (Atlas)

# Test connection locally:
npm run dev
# Check console for "Database connected successfully"
```

### API Returns 401 Unauthorized
```bash
# Make sure you're including the token:
# -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Token expires in 24h by default - login again
```

### Twilio/SendGrid Not Working
```bash
# Verify API keys are correct
# Check service status:
# Twilio: https://status.twilio.com/
# SendGrid: https://status.sendgrid.com/

# Check logs in DO dashboard for errors
```

## 📊 API Quick Reference

### Authentication
```bash
POST /api/auth/register    # Register agent
POST /api/auth/login       # Login
GET  /api/auth/profile     # Get profile (auth required)
```

### Clients (All require auth)
```bash
POST   /api/clients        # Create client
GET    /api/clients        # List clients (with pagination)
GET    /api/clients/:id    # Get client
PUT    /api/clients/:id    # Update client
DELETE /api/clients/:id    # Delete client (admin only)
```

### System
```bash
GET /health               # Health check
GET /                     # API info
```

## 💡 Pro Tips

1. **Use environment-specific configs**: Create separate DO apps for dev/staging/prod
2. **Monitor logs**: Set up log forwarding to a service like Papertrail
3. **Set up alerts**: Configure DO monitoring alerts for CPU/Memory
4. **Regular backups**: Enable point-in-time recovery on database
5. **Use secrets**: Never commit API keys to repository
6. **Rate limiting**: Adjust limits based on your traffic
7. **Custom domain**: Set up via DO App Settings → Domains
8. **SSL is automatic**: Digital Ocean handles SSL certificates

## 🔒 Security Reminders

- ✅ All API keys in DO environment variables (encrypted)
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Enable 2FA on all service accounts
- ✅ Restrict MongoDB access to DO IP range
- ✅ Use HTTPS only (DO handles this)
- ✅ Regular security updates: `npm audit fix`
- ✅ Monitor audit logs for suspicious activity

## 📞 Support Links

- **Digital Ocean**: https://docs.digitalocean.com/
- **MongoDB**: https://docs.mongodb.com/
- **Twilio**: https://www.twilio.com/docs
- **SendGrid**: https://docs.sendgrid.com/
- **Repository Issues**: GitHub Issues tab

## 🎯 Success Criteria

- [x] App deployed to Digital Ocean
- [x] Health endpoint returns 200 OK
- [x] Can register and login as admin
- [x] Can create and retrieve clients
- [x] Database connection stable
- [x] All environment variables configured
- [x] No errors in application logs

---

**Total Setup Time**: ~2 hours
**Monthly Cost**: ~$22 minimum
**Support**: See DEPLOYMENT.md for detailed guide
