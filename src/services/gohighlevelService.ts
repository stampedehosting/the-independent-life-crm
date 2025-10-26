import axios, { AxiosInstance } from 'axios';
import config from '../config';

class GoHighLevelService {
  private client: AxiosInstance;

  constructor() {
    if (!config.gohighlevel.apiKey) {
      console.warn('⚠ GoHighLevel API key not configured');
    }

    this.client = axios.create({
      baseURL: 'https://rest.gohighlevel.com/v1',
      headers: {
        Authorization: `Bearer ${config.gohighlevel.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createContact(contactData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/contacts/', {
        ...contactData,
        locationId: config.gohighlevel.locationId,
      });

      console.log(`Contact created in GoHighLevel: ${contactData.email}`);
      return response.data;
    } catch (error) {
      console.error('Error creating GoHighLevel contact:', error);
      throw error;
    }
  }

  async updateContact(contactId: string, updateData: Record<string, unknown>): Promise<any> {
    try {
      const response = await this.client.put(`/contacts/${contactId}`, updateData);

      console.log(`Contact updated in GoHighLevel: ${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating GoHighLevel contact:', error);
      throw error;
    }
  }

  async addNote(contactId: string, note: string): Promise<any> {
    try {
      const response = await this.client.post(`/contacts/${contactId}/notes`, {
        body: note,
      });

      console.log(`Note added to GoHighLevel contact: ${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding note to GoHighLevel contact:', error);
      throw error;
    }
  }

  async addToWorkflow(contactId: string, workflowId: string): Promise<any> {
    try {
      const response = await this.client.post(`/contacts/${contactId}/workflows/${workflowId}`);

      console.log(`Contact added to workflow in GoHighLevel: ${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding contact to GoHighLevel workflow:', error);
      throw error;
    }
  }
}

export default new GoHighLevelService();
