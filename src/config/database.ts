import mongoose from 'mongoose';
import config from './index';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.mongoUri);
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('Database error:', error);
});
