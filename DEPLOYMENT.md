# Production Deployment Guide

This guide walks through deploying The Independent Life CRM to production on Digital Ocean.

## Prerequisites Checklist

- [ ] Digital Ocean account created
- [ ] GitHub repository access
- [ ] API credentials obtained:
  - [ ] Twilio Account SID and Auth Token
  - [ ] SendGrid API Key
  - [ ] GoHighLevel API Key
- [ ] Domain name (optional but recommended)

## Step 1: Database Setup

### Option A: Digital Ocean Managed MongoDB (Recommended)

1. Log into Digital Ocean Dashboard
2. Navigate to **Databases** → **Create Database**
3. Select:
   - **Database Engine**: MongoDB
   - **Version**: 6 or higher
   - **Datacenter**: Choose closest to your users (e.g., NYC, SF, LON)
   - **Plan**: Basic ($15/month minimum for production)
4. Click **Create Database Cluster**
5. Wait for cluster to provision (5-10 minutes)
6. Click **Connection Details** → Copy the connection string
7. Save the connection string securely (you'll need it for environment variables)

### Option B: MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free or paid cluster
3. Configure IP whitelist (add `0.0.0.0/0` for Digital Ocean)
4. Create a database user
5. Get connection string
6. Ensure BAA is signed for HIPAA compliance

## Step 2: Application Deployment

### Method 1: Using Digital Ocean App Platform (Easiest)

1. **Create App**:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

2. **Alternative - Use Dashboard**:
   - Go to Digital Ocean Dashboard → Apps
   - Click **Create App**
   - Choose **GitHub** as source
   - Select repository: `stampedehosting/the-independent-life-crm`
   - Select branch: `main`
   - Digital Ocean will auto-detect Dockerfile

3. **Configure Environment Variables**:
   
   In the App Settings → Environment Variables, add:
   
   ```
   NODE_ENV=production
   PORT=3000
   
   # Database (from Step 1)
   MONGODB_URI=<your-mongodb-connection-string>
   
   # JWT Secret (generate with: openssl rand -base64 32)
   JWT_SECRET=<your-generated-secret>
   
   # Twilio
   TWILIO_ACCOUNT_SID=<your-twilio-sid>
   TWILIO_AUTH_TOKEN=<your-twilio-token>
   TWILIO_PHONE_NUMBER=<your-twilio-phone>
   
   # SendGrid
   SENDGRID_API_KEY=<your-sendgrid-key>
   SENDGRID_FROM_EMAIL=<your-verified-email>
   SENDGRID_FROM_NAME=The Independent Life CRM
   
   # GoHighLevel
   GOHIGHLEVEL_API_KEY=<your-ghl-key>
   GOHIGHLEVEL_LOCATION_ID=<your-location-id>
   
   # Security
   BCRYPT_ROUNDS=10
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS (your frontend domain)
   CORS_ORIGIN=https://yourdomain.com
   ```

4. **Deploy**:
   - Click **Deploy**
   - Wait for build and deployment (5-10 minutes)
   - App will be available at a Digital Ocean URL

### Method 2: Using Container Registry + App Platform

1. **Create Container Registry**:
   ```bash
   doctl registry create independent-life-crm
   ```

2. **Build and Push**:
   ```bash
   export DO_REGISTRY_NAME=independent-life-crm
   export DO_API_TOKEN=<your-api-token>
   ./deploy-digital-ocean.sh
   ```

3. **Create App from Container**:
   - Go to Apps → Create App
   - Choose **DigitalOcean Container Registry**
   - Select your image
   - Configure environment variables (same as Method 1)
   - Deploy

## Step 3: Configure Custom Domain (Optional)

1. In App Settings → Domains
2. Click **Add Domain**
3. Enter your domain name
4. Add DNS records to your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: <app-url>.ondigitalocean.app
   ```
5. Wait for DNS propagation (can take up to 48 hours)
6. SSL certificate will be automatically provisioned

## Step 4: Verify Deployment

1. **Check Health Endpoint**:
   ```bash
   curl https://your-app-url/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-26T...",
     "uptime": 123.45
   }
   ```

2. **Test API**:
   ```bash
   curl https://your-app-url/
   ```
   
   Expected response:
   ```json
   {
     "name": "The Independent Life CRM API",
     "version": "1.0.0",
     "description": "A CRM to manage agents and clients with HIPAA compliance"
   }
   ```

3. **Create First Agent**:
   ```bash
   curl -X POST https://your-app-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Admin",
       "lastName": "User",
       "email": "admin@yourcompany.com",
       "phone": "+1234567890",
       "password": "SecurePassword123!",
       "role": "admin"
     }'
   ```

## Step 5: Configure Monitoring

1. **Digital Ocean Monitoring** (Included):
   - Navigate to your App → Insights
   - Monitor CPU, Memory, Bandwidth
   - Set up alerts for high resource usage

2. **External Monitoring** (Optional):
   - [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
   - [Sentry](https://sentry.io/) - Error tracking
   - [LogDNA](https://www.logdna.com/) - Log management

## Step 6: Set Up Backups

1. **Database Backups**:
   - Digital Ocean Managed MongoDB: Automatic daily backups
   - MongoDB Atlas: Configure backup schedule
   - Recommended: Enable point-in-time recovery

2. **Backup Verification**:
   - Test restore process monthly
   - Document restore procedures

## Step 7: Security Hardening

1. **Review Access Controls**:
   - Ensure database is not publicly accessible
   - Configure firewall rules if using Droplets

2. **Enable Two-Factor Authentication**:
   - Enable 2FA on Digital Ocean account
   - Enable 2FA on MongoDB account

3. **Secrets Management**:
   - Never commit secrets to repository
   - Use Digital Ocean's encrypted environment variables
   - Rotate secrets regularly (quarterly)

4. **HIPAA Compliance**:
   - Sign BAA with Digital Ocean
   - Sign BAA with database provider
   - Sign BAAs with Twilio, SendGrid
   - Enable audit logging
   - Configure data retention policies

## Step 8: CI/CD Setup

The app is configured to auto-deploy on push to `main` branch.

To modify:
1. Go to App Settings → Source
2. Configure auto-deploy preferences
3. Set up staging environment (optional)

## Troubleshooting

### Build Fails

1. Check build logs in Digital Ocean dashboard
2. Verify Dockerfile is correct
3. Ensure all dependencies are in package.json
4. Check Node.js version compatibility

### App Won't Start

1. Check runtime logs
2. Verify environment variables are set
3. Test database connection string
4. Ensure MongoDB cluster is running

### Database Connection Issues

1. Verify connection string format
2. Check MongoDB cluster status
3. Ensure IP whitelist includes Digital Ocean
4. Test connection from local environment first

### API Returns 500 Errors

1. Check application logs
2. Verify all API keys are correct
3. Test each service integration individually
4. Enable debug logging temporarily

## Scaling Considerations

### Vertical Scaling
- Start with Basic plan ($5-12/month)
- Upgrade to Professional ($25-50/month) as usage grows
- Monitor metrics to determine when to scale

### Horizontal Scaling
- App Platform supports multiple instances
- Configure load balancing in App settings
- Recommended for >1000 daily active users

### Database Scaling
- Monitor connection count
- Upgrade database plan as needed
- Consider read replicas for heavy read workloads

## Cost Estimation

**Minimum Monthly Cost**:
- App (Basic): $5
- Database (Basic): $15
- Total: **~$20/month**

**Recommended Production**:
- App (Professional): $25
- Database (Production): $50
- Backups: Included
- Total: **~$75/month**

**High-Traffic Production**:
- App (2x Professional): $50
- Database (High-Performance): $150
- Additional storage: $10
- Total: **~$210/month**

## Maintenance

### Weekly
- [ ] Review application logs
- [ ] Check error rates
- [ ] Monitor resource usage

### Monthly
- [ ] Review security alerts
- [ ] Test backup restoration
- [ ] Update dependencies
- [ ] Review access logs

### Quarterly
- [ ] Rotate secrets and API keys
- [ ] Review and update documentation
- [ ] Performance audit
- [ ] Security audit

## Support

- Digital Ocean Support: Available via tickets
- Community: Discord/Slack channels
- Documentation: https://docs.digitalocean.com/

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Create API documentation for your team
3. Set up development and staging environments
4. Implement CI/CD improvements
5. Add frontend application
