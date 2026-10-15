import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 3001,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  // GitHub OAuth
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // TiDB Cloud (MySQL-compatible)
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT || "4000", 10),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,

  // LeetCode API (Docker alfa-leetcode-api container)
  LEETCODE_API_URL: process.env.LEETCODE_API_URL || "http://localhost:3000",
};

// Warn at startup if OAuth secrets are missing
if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
  console.warn(
    "[config/env] WARNING: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set. " +
      "GitHub OAuth token exchange will fail. Add them to server/.env"
  );
}

// Warn if DB config is incomplete
const dbVars = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
const missingDb = dbVars.filter((k) => !env[k]);
if (missingDb.length) {
  console.warn(
    `[config/env] WARNING: Missing TiDB env vars: ${missingDb.join(", ")}. ` +
      "Database queries will fail. Add them to server/.env"
  );
}

export default env;
