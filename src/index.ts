import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Routes
import indexRoutes from './routes/index';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(config.server.port, config.server.host, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║   The Independent Life CRM API Server             ║
╟───────────────────────────────────────────────────╢
║   Environment: ${config.server.nodeEnv.padEnd(33)}║
║   Server:      http://${config.server.host}:${config.server.port.toString().padEnd(21)}║
║   Status:      Running ✓                          ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

export default app;
