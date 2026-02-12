import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/', (req, res) => {
  res.json({
    name: 'The Independent Life CRM API',
    version: '1.0.0',
    description: 'A CRM to manage agents and clients with HIPAA compliance',
  });
});

export default router;
