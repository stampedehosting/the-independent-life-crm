import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  assignedAgent?: mongoose.Types.ObjectId;
  status: 'lead' | 'prospect' | 'client' | 'inactive';
  source?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

const ClientSchema = new Schema<IClient>(
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
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
    },
    status: {
      type: String,
      enum: ['lead', 'prospect', 'client', 'inactive'],
      default: 'lead',
    },
    source: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    lastContactedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries and HIPAA compliance audit trails
ClientSchema.index({ email: 1 });
ClientSchema.index({ assignedAgent: 1 });
ClientSchema.index({ status: 1 });
ClientSchema.index({ createdAt: -1 });

export default mongoose.model<IClient>('Client', ClientSchema);
