import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  username: varchar("username", { length: 64 }).unique(),
  password: varchar("password", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "agent"]).default("user").notNull(),
  agentId: int("agentId"), // Link to agents table for agent users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Agents table - stores all insurance agent information
 */
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "onboarding", "suspended"]).default("active").notNull(),
  state: varchar("state", { length: 2 }), // US state abbreviation
  // Insurance provider appointments (stored as JSON array)
  appointments: text("appointments"), // JSON: ["Provider1", "Provider2", ...]
  // Performance metrics
  totalSales: int("totalSales").default(0),
  monthlyGoal: int("monthlyGoal").default(0),
  commissionRate: int("commissionRate").default(15), // Percentage as integer (15 = 15%)
  // Additional info
  territory: varchar("territory", { length: 255 }),
  licenseNumber: varchar("licenseNumber", { length: 100 }),
  licenseState: varchar("licenseState", { length: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

/**
 * Appointments/Events table - tracks agent appointments and activities
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  duration: int("duration").default(60), // Duration in minutes
  type: mysqlEnum("type", ["meeting", "call", "training", "review", "other"]).default("meeting").notNull(),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  location: varchar("location", { length: 255 }),
  clientName: varchar("clientName", { length: 255 }),
  clientPhone: varchar("clientPhone", { length: 20 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Activity log - tracks all actions performed on agents
 */
export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  userId: int("userId").notNull(), // Who performed the action
  action: varchar("action", { length: 100 }).notNull(), // "email_sent", "sms_sent", "status_changed", etc.
  details: text("details"), // JSON with additional details
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

/**
 * Insurance providers - list of available insurance companies
 */
export const insuranceProviders = mysqlTable("insuranceProviders", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  type: varchar("type", { length: 100 }), // "Health", "Life", "Medicare", etc.
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InsuranceProvider = typeof insuranceProviders.$inferSelect;
export type InsertInsuranceProvider = typeof insuranceProviders.$inferInsert;
