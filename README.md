# The Independent Life CRM

A production-ready CRM system to manage agents and clients with HIPAA compliance, designed for deployment on Digital Ocean.

## Features

- **Agent Management**: Register, authenticate, and manage insurance agents
- **Client Management**: Track leads, prospects, and clients with full HIPAA compliance
- **API Integrations**:
  - **Twilio**: SMS and voice communication
  - **SendGrid**: Email marketing and transactional emails
  - **GoHighLevel**: CRM synchronization and workflow automation
- **Security**: JWT authentication, bcrypt password hashing, rate limiting, audit logging
- **Database**: MongoDB with Mongoose ODM
- **Production Ready**: Docker containerization, Digital Ocean deployment configuration

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher (or MongoDB Atlas)
- Digital Ocean account (for production deployment)
- API Keys for:
  - Twilio (SMS/Voice)
  - SendGrid (Email)
  - GoHighLevel (CRM integration)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/stampedehosting/the-independent-life-crm.git
cd the-independent-life-crm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/independent-life-crm

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourcompany.com

# GoHighLevel
GOHIGHLEVEL_API_KEY=your-gohighlevel-api-key
GOHIGHLEVEL_LOCATION_ID=your-location-id
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or using local MongoDB installation
mongod
```

### 5. Run the application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check without building

### Project Structure

```
.
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models (Agent, Client, AuditLog)
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic (Twilio, SendGrid, GoHighLevel)
│   ├── middleware/      # Express middleware (auth, audit, errors)
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── .do/                 # Digital Ocean deployment config
├── Dockerfile           # Docker container definition
├── docker-compose.yml   # Local Docker setup
└── deploy-digital-ocean.sh  # Deployment script
```

## API Documentation

### Authentication Endpoints

#### Register Agent
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "licenseNumber": "LIC123456"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Client Endpoints

All client endpoints require authentication.

#### Create Client
```bash
POST /api/clients
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "status": "lead",
  "source": "website"
}
```

#### Get Clients
```bash
GET /api/clients?status=lead&page=1&limit=20
Authorization: Bearer <jwt-token>
```

#### Get Single Client
```bash
GET /api/clients/:id
Authorization: Bearer <jwt-token>
```

#### Update Client
```bash
PUT /api/clients/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "client",
  "notes": "Completed onboarding"
}
```

#### Delete Client (Admin only)
```bash
DELETE /api/clients/:id
Authorization: Bearer <jwt-token>
```

### Health Check
```bash
GET /health
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Docker Deployment

### Local Docker Development

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Build Docker Image

```bash
docker build -t independent-life-crm .
docker run -p 3000:3000 --env-file .env independent-life-crm
```

## Digital Ocean Deployment

### Prerequisites

1. Install [doctl](https://docs.digitalocean.com/reference/doctl/)
2. Create a Digital Ocean account
3. Create a Container Registry
4. Generate an API token

### Deployment Steps

#### Option 1: Using the deployment script

```bash
# Set environment variables
export DO_REGISTRY_NAME=your-registry-name
export DO_API_TOKEN=your-api-token

# Run deployment script
./deploy-digital-ocean.sh
```

#### Option 2: Using Digital Ocean App Platform

1. **Create App from Spec**:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

2. **Configure Secrets** in Digital Ocean dashboard:
   - JWT_SECRET
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER
   - SENDGRID_API_KEY
   - SENDGRID_FROM_EMAIL
   - GOHIGHLEVEL_API_KEY
   - GOHIGHLEVEL_LOCATION_ID

3. **Deploy**:
   - The app will automatically deploy on push to main branch
   - Or manually trigger deployment from the dashboard

#### Option 3: Manual Digital Ocean Setup

1. **Create MongoDB Database**:
   - Go to Digital Ocean Dashboard → Databases
   - Create a new MongoDB cluster
   - Copy the connection string

2. **Create App**:
   - Go to Apps → Create App
   - Choose GitHub repository
   - Select Dockerfile deployment
   - Add environment variables
   - Deploy

### Database Options

The application supports multiple database options:

1. **MongoDB (Recommended)**:
   - Digital Ocean Managed MongoDB
   - MongoDB Atlas
   - Self-hosted MongoDB

2. **PostgreSQL** (requires code changes):
   - Would need to replace Mongoose with Sequelize or TypeORM
   - Update models to use SQL schema

## Security & HIPAA Compliance

This CRM includes several security features for HIPAA compliance:

### Security Features

- ✅ **Encryption in Transit**: HTTPS/TLS for all communications
- ✅ **Authentication**: JWT-based authentication
- ✅ **Password Security**: bcrypt hashing with configurable rounds
- ✅ **Audit Logging**: All access and modifications logged
- ✅ **Rate Limiting**: Protection against brute force attacks
- ✅ **Input Validation**: Request validation and sanitization
- ✅ **CORS Protection**: Configurable CORS policies
- ✅ **Security Headers**: Helmet.js for secure headers

### HIPAA Compliance Checklist

To ensure full HIPAA compliance:

- [ ] Enable MongoDB encryption at rest
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup and disaster recovery
- [ ] Implement access controls and role-based permissions
- [ ] Configure audit log retention policies
- [ ] Sign Business Associate Agreements (BAAs) with:
  - [ ] Digital Ocean
  - [ ] MongoDB Atlas (if used)
  - [ ] Twilio
  - [ ] SendGrid
- [ ] Implement data retention and disposal policies
- [ ] Set up intrusion detection
- [ ] Configure monitoring and alerting

## Production Checklist

Before deploying to production:

- [ ] **Environment Variables**: All API keys and secrets configured
- [ ] **Database**: MongoDB cluster created and connection tested
- [ ] **SSL/TLS**: HTTPS enabled (Digital Ocean handles this automatically)
- [ ] **Monitoring**: Set up application monitoring (Digital Ocean provides basic monitoring)
- [ ] **Backups**: Configure database backups
- [ ] **Scaling**: Adjust instance size based on load
- [ ] **Domain**: Configure custom domain
- [ ] **Email**: Verify SendGrid domain and sender
- [ ] **Testing**: Run integration tests
- [ ] **Documentation**: Update API documentation
- [ ] **Security**: Review security settings
- [ ] **Compliance**: Complete HIPAA compliance checklist

## Current Status & Next Steps

### ✅ Completed

- [x] Project structure and configuration
- [x] TypeScript setup with strict mode
- [x] Express.js server with security middleware
- [x] MongoDB database integration
- [x] Agent authentication (register, login, JWT)
- [x] Client management (CRUD operations)
- [x] Twilio service integration
- [x] SendGrid service integration
- [x] GoHighLevel service integration
- [x] Audit logging for HIPAA compliance
- [x] Docker containerization
- [x] Digital Ocean deployment configuration
- [x] Environment variable management
- [x] Rate limiting and security headers
- [x] Role-based access control

### 📋 To Complete Before Production

1. **Testing**:
   - [ ] Write unit tests for models
   - [ ] Write integration tests for API endpoints
   - [ ] Write tests for service integrations
   - [ ] End-to-end testing

2. **API Keys Configuration**:
   - [ ] Obtain Twilio credentials
   - [ ] Obtain SendGrid API key
   - [ ] Obtain GoHighLevel API key
   - [ ] Configure all environment variables

3. **Database**:
   - [ ] Choose between MongoDB Atlas or Digital Ocean Managed MongoDB
   - [ ] Create production database
   - [ ] Configure database backup strategy
   - [ ] Enable encryption at rest

4. **Deployment**:
   - [ ] Create Digital Ocean Container Registry
   - [ ] Deploy application to Digital Ocean
   - [ ] Configure custom domain
   - [ ] Set up SSL certificate (automatic with DO)
   - [ ] Configure monitoring and alerts

5. **Documentation**:
   - [ ] API documentation (consider Swagger/OpenAPI)
   - [ ] User guide for agents
   - [ ] Admin guide
   - [ ] Runbook for operations

6. **Compliance**:
   - [ ] Complete HIPAA compliance checklist
   - [ ] Sign BAAs with service providers
   - [ ] Implement data retention policies
   - [ ] Set up compliance monitoring

## Support & Contribution

For questions or issues, please open an issue in the GitHub repository.

## License

ISC License - See LICENSE file for details
