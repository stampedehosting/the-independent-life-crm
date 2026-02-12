import { Response } from 'express';
import Client from '../models/Client';
import { AuthRequest } from '../middleware/auth';
import gohighlevelService from '../services/gohighlevelService';

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clientData = req.body;

    // Create client in database
    const client = await Client.create({
      ...clientData,
      assignedAgent: req.user?.id,
    });

    // Sync to GoHighLevel if configured
    try {
      if (process.env.GOHIGHLEVEL_API_KEY) {
        await gohighlevelService.createContact({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
        });
      }
    } catch (ghlError) {
      console.error('Error syncing to GoHighLevel:', ghlError);
      // Continue even if GoHighLevel sync fails
    }

    res.status(201).json({
      message: 'Client created successfully',
      client,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    // Non-admin users can only see their assigned clients
    if (req.user?.role !== 'admin') {
      query.assignedAgent = req.user?.id;
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('assignedAgent', 'firstName lastName email');

    const total = await Client.countDocuments(query);

    res.json({
      clients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id).populate(
      'assignedAgent',
      'firstName lastName email'
    );

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Non-admin users can only see their assigned clients
    if (
      req.user?.role !== 'admin' &&
      client.assignedAgent?.toString() !== req.user?.id
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const client = await Client.findById(id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Non-admin users can only update their assigned clients
    if (
      req.user?.role !== 'admin' &&
      client.assignedAgent?.toString() !== req.user?.id
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    Object.assign(client, updateData);
    await client.save();

    res.json({
      message: 'Client updated successfully',
      client,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Only admins can delete clients
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await client.deleteOne();

    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
