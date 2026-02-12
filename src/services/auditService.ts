import AuditLog, { IAuditLog } from '../models/AuditLog';
import mongoose from 'mongoose';

interface AuditLogData {
  userId: mongoose.Types.ObjectId;
  userType: 'agent' | 'system';
  action: string;
  resourceType: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditService {
  async log(data: AuditLogData): Promise<void> {
    try {
      await AuditLog.create({
        ...data,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  async getLogsForUser(
    userId: mongoose.Types.ObjectId,
    limit = 100
  ): Promise<IAuditLog[]> {
    return AuditLog.find({ userId }).sort({ timestamp: -1 }).limit(limit);
  }

  async getLogsForResource(
    resourceType: string,
    resourceId: mongoose.Types.ObjectId,
    limit = 100
  ): Promise<IAuditLog[]> {
    return AuditLog.find({ resourceType, resourceId }).sort({ timestamp: -1 }).limit(limit);
  }
}

export default new AuditService();
