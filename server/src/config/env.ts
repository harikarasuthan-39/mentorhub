import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const raw = process.env[name];
  const value = raw && raw.length > 0 ? raw : fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl: required("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/mentor_assistant?schema=public"),
  jwtSecret: required("JWT_SECRET", "dev_only_secret_change_me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  aiProvider: process.env.AI_PROVIDER ?? "mock",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "claude-sonnet-4-6",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 300),
};
