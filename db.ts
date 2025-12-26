import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  agents, 
  InsertAgent,
  appointments,
  InsertAppointment,
  activityLog,
  InsertActivityLog,
  insuranceProviders,
  InsertInsuranceProvider
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== User Functions ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.agentId !== undefined) {
      values.agentId = user.agentId;
      updateSet.agentId = user.agentId;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== Agent Functions ==========

export async function getAllAgents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(agents).orderBy(agents.lastName, agents.firstName);
}

export async function getAgentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAgentByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(agents).where(eq(agents.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAgent(agent: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(agents).values(agent);
  return result;
}

export async function updateAgent(id: number, data: Partial<InsertAgent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(agents).set(data).where(eq(agents.id, id));
}

export async function deleteAgent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(agents).where(eq(agents.id, id));
}

// ========== Appointment Functions ==========

export async function getAppointmentsByAgent(agentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(appointments)
    .where(eq(appointments.agentId, agentId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getUpcomingAppointments(agentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  return await db.select().from(appointments)
    .where(
      and(
        eq(appointments.agentId, agentId),
        eq(appointments.status, 'scheduled')
      )
    )
    .orderBy(appointments.appointmentDate);
}

export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(appointments).values(appointment);
  return result;
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

// ========== Activity Log Functions ==========

export async function logActivity(log: InsertActivityLog) {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(activityLog).values(log);
  } catch (error) {
    console.error("[Database] Failed to log activity:", error);
  }
}

export async function getAgentActivityLog(agentId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(activityLog)
    .where(eq(activityLog.agentId, agentId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}

// ========== Insurance Provider Functions ==========

export async function getAllInsuranceProviders() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(insuranceProviders)
    .where(eq(insuranceProviders.active, true))
    .orderBy(insuranceProviders.name);
}

export async function createInsuranceProvider(provider: InsertInsuranceProvider) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(insuranceProviders).values(provider);
  return result;
}


// ========== Password Authentication ==========

import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function loginWithPassword(username: string, password: string) {
  const db = await getDb();
  if (!db) return null;

  const hashedPassword = hashPassword(password);
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (result.length === 0) return null;
  const user = result[0];

  if (user.password !== hashedPassword) return null;

  // Update last signed in
  await db
    .update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  return user;
}

export async function createUserSession(userId: number): Promise<string> {
  const secret = process.env.JWT_SECRET || "default-secret-change-me";
  const token = jwt.sign({ userId }, secret, { expiresIn: "7d" });
  return token;
}

export async function getUserFromSession(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "default-secret-change-me";
    const decoded = jwt.verify(token, secret) as { userId: number };
    return await getUserById(decoded.userId);
  } catch {
    return null;
  }
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

