import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import auditService from '../services/auditService';
import { AuthRequest } from './auth';

export const auditLogger = (action: string, resourceType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id
        ? new mongoose.Types.ObjectId(req.user.id)
        : new mongoose.Types.ObjectId();
      const userType = req.user ? 'agent' : 'system';

      // Get resourceId from request params if available
      const resourceId = req.params.id ? new mongoose.Types.ObjectId(req.params.id) : undefined;

      await auditService.log({
        userId,
        userType,
        action,
        resourceType,
        resourceId,
        details: {
          method: req.method,
          path: req.path,
          body: req.body,
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      next();
    } catch (error) {
      // Don't block the request if audit logging fails
      console.error('Audit logging error:', error);
      next();
    }
  };
};
