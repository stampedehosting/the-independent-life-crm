import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema";
import * as crypto from "crypto";

// Simple password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  // Create demo admin user
  const demoUser = {
    username: "admin",
    password: hashPassword("demo123"),
    name: "Demo Admin",
    email: "admin@theindependentlife.com",
    role: "admin" as const,
    loginMethod: "password",
  };

  try {
    await db.insert(users).values(demoUser);
    console.log("✅ Demo admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: demo123");
  } catch (error: any) {
    if (error.message?.includes("Duplicate entry")) {
      console.log("ℹ️  Demo user already exists");
    } else {
      console.error("❌ Error creating demo user:", error);
    }
  }

  process.exit(0);
}

main();

