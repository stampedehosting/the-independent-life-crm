import { Router } from 'express';
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', auditLogger('create', 'client'), createClient);
router.get('/', getClients);
router.get('/:id', auditLogger('view', 'client'), getClient);
router.put('/:id', auditLogger('update', 'client'), updateClient);
router.delete('/:id', authorize('admin'), auditLogger('delete', 'client'), deleteClient);

export default router;
