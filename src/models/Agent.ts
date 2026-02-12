import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  licenseNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'agent' | 'admin' | 'manager';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    role: {
      type: String,
      enum: ['agent', 'admin', 'manager'],
      default: 'agent',
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AgentSchema.index({ email: 1 });
AgentSchema.index({ status: 1 });

export default mongoose.model<IAgent>('Agent', AgentSchema);
