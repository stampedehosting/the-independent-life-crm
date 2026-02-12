import sgMail from '@sendgrid/mail';
import config from '../config';

class SendGridService {
  constructor() {
    if (!config.sendgrid.apiKey) {
      console.warn('⚠ SendGrid API key not configured');
    } else {
      sgMail.setApiKey(config.sendgrid.apiKey);
    }
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    try {
      if (!config.sendgrid.fromEmail) {
        throw new Error('SendGrid from email not configured');
      }

      const msg = {
        to: to,
        from: {
          email: config.sendgrid.fromEmail,
          name: config.sendgrid.fromName,
        },
        subject: subject,
        text: text,
        html: html || text,
      };

      await sgMail.send(msg);
      console.log(`Email sent to ${Array.isArray(to) ? to.join(', ') : to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendTemplateEmail(
    to: string | string[],
    templateId: string,
    dynamicData: Record<string, unknown>
  ): Promise<void> {
    try {
      if (!config.sendgrid.fromEmail) {
        throw new Error('SendGrid from email not configured');
      }

      const msg = {
        to: to,
        from: {
          email: config.sendgrid.fromEmail,
          name: config.sendgrid.fromName,
        },
        templateId: templateId,
        dynamicTemplateData: dynamicData,
      };

      await sgMail.send(msg);
      console.log(`Template email sent to ${Array.isArray(to) ? to.join(', ') : to}`);
    } catch (error) {
      console.error('Error sending template email:', error);
      throw error;
    }
  }
}

export default new SendGridService();
