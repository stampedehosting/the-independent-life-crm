import twilio from 'twilio';
import config from '../config';

class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    if (!config.twilio.accountSid || !config.twilio.authToken) {
      console.warn('⚠ Twilio credentials not configured');
    }
    this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      if (!config.twilio.phoneNumber) {
        throw new Error('Twilio phone number not configured');
      }

      await this.client.messages.create({
        body: message,
        to: to,
        from: config.twilio.phoneNumber,
      });

      console.log(`SMS sent to ${to}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async makeCall(to: string, twimlUrl: string): Promise<void> {
    try {
      if (!config.twilio.phoneNumber) {
        throw new Error('Twilio phone number not configured');
      }

      await this.client.calls.create({
        url: twimlUrl,
        to: to,
        from: config.twilio.phoneNumber,
      });

      console.log(`Call initiated to ${to}`);
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }
}

export default new TwilioService();
