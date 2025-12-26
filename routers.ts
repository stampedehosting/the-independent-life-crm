        // TODO: Implement actual email sending
        // For now, just log the activity
        await db.logActivity({
          agentId: input.agentId,
          userId: ctx.user.id,
          action: 'email_sent',
          details: JSON.stringify({ subject: input.subject, to: agent.email }),
        });
        
        return { success: true, message: 'Email sent successfully' };
      }),

    // Send SMS to agent (admin only)
    sendSMS: adminProcedure
      .input(z.object({
        agentId: z.number(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const agent = await db.getAgentById(input.agentId);
        if (!agent) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
        }
        
        // TODO: Implement actual SMS sending
        // For now, just log the activity
        await db.logActivity({
          agentId: input.agentId,
          userId: ctx.user.id,
          action: 'sms_sent',
          details: JSON.stringify({ to: agent.phone }),
        });
        
        return { success: true, message: 'SMS sent successfully' };
      }),
  }),

  appointments: router({
    // Get appointments for an agent
    list: protectedProcedure
      .input(z.object({ agentId: z.number() }))
      .query(async ({ input, ctx }) => {
        // Agents can only view their own appointments
        if (ctx.user.role === 'agent' && ctx.user.agentId !== input.agentId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        return await db.getAppointmentsByAgent(input.agentId);
      }),

    // Get upcoming appointments
    upcoming: protectedProcedure
      .input(z.object({ agentId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === 'agent' && ctx.user.agentId !== input.agentId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        return await db.getUpcomingAppointments(input.agentId);
      }),

    // Create appointment
    create: protectedProcedure
      .input(z.object({
        agentId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        appointmentDate: z.date(),
        duration: z.number().default(60),
        type: z.enum(["meeting", "call", "training", "review", "other"]).default("meeting"),
        location: z.string().optional(),
        clientName: z.string().optional(),
        clientPhone: z.string().optional(),
        clientEmail: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Agents can only create appointments for themselves
        if (ctx.user.role === 'agent' && ctx.user.agentId !== input.agentId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        const result = await db.createAppointment({
          ...input,
          status: 'scheduled',
        });
        
        return { success: true, id: result[0].insertId };
      }),

    // Update appointment
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          appointmentDate: z.date().optional(),
          duration: z.number().optional(),
          type: z.enum(["meeting", "call", "training", "review", "other"]).optional(),
          status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
          location: z.string().optional(),
          clientName: z.string().optional(),
          clientPhone: z.string().optional(),
          clientEmail: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateAppointment(input.id, input.data);
        return { success: true };
      }),
  }),

  insuranceProviders: router({
    // Get all insurance providers
    list: publicProcedure.query(async () => {
      return await db.getAllInsuranceProviders();
    }),
  }),
});
