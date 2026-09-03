import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

// Ensure DATABASE_URL is set for PostgreSQL
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://node@localhost:5432/mentorhub";
}

// Function to guarantee PostgreSQL is running in container environment and requested DB exists
export function ensurePostgresRunning() {
  try {
    try {
      execSync('su - node -c "/usr/lib/postgresql/15/bin/pg_ctl -D /tmp/pgdata status"', { stdio: "ignore" });
    } catch {
      execSync("mkdir -p /var/run/postgresql && chown -R node:node /var/run/postgresql", { stdio: "ignore" });
      execSync('su - node -c "/usr/lib/postgresql/15/bin/pg_ctl -D /tmp/pgdata -l /tmp/pg.log start"', { stdio: "ignore" });
    }

    // Ensure postgres user exists
    try {
      execSync('su - node -c "psql -d template1 -c \\"CREATE ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD \'postgres123\';\\""', { stdio: "ignore" });
    } catch {
      try {
        execSync('su - node -c "psql -d template1 -c \\"ALTER USER postgres WITH SUPERUSER CREATEDB CREATEROLE PASSWORD \'postgres123\';\\""', { stdio: "ignore" });
      } catch {}
    }

    // Ensure requested database exists
    const dbUrl = process.env.DATABASE_URL || "";
    try {
      const parsed = new URL(dbUrl.replace(/^postgresql:\/\//, "http://"));
      const dbName = parsed.pathname.replace(/^\//, "").split("?")[0];
      if (dbName && dbName !== "template1" && dbName !== "postgres") {
        const checkDb = execSync(`su - node -c "psql -d template1 -tAc \\"SELECT 1 FROM pg_database WHERE datname='${dbName}'\\""`, { encoding: "utf-8" }).trim();
        if (checkDb !== "1") {
          execSync(`su - node -c "psql -d template1 -c \\"CREATE DATABASE \\\\\\"${dbName}\\\\\\" OWNER postgres;\\""`, { stdio: "ignore" });
          execSync("npx prisma db push --schema=server/prisma/schema.prisma --skip-generate", { stdio: "ignore" });
        }
      }
    } catch {}
  } catch (e) {
    console.warn("Notice: postgres check notice:", e);
  }
}

ensurePostgresRunning();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export * from "@prisma/client";
