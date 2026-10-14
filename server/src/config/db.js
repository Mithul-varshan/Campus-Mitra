import mysql from "mysql2/promise";
import env from "./env.js";

/**
 * TiDB Cloud (serverless) connection pool
 * TiDB is fully MySQL-compatible, accessed over SSL/TLS.
 * Set the following in server/.env:
 *
 *   DB_HOST=<gateway host, e.g. gateway01.ap-southeast-1.prod.aws.tidbcloud.com>
 *   DB_PORT=4000
 *   DB_USER=<your TiDB user, e.g. 2XiSX3Mxxxxxxx.root>
 *   DB_PASS=<your TiDB password>
 *   DB_NAME=<your database name>
 */
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,

  // TiDB Cloud requires TLS
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },

  // Pool settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Keep-alive for serverless cold-start reconnects
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Verify the connection on server startup
pool
  .getConnection()
  .then((conn) => {
    console.log("[db] Connected to TiDB Cloud ✓");
    conn.release();
  })
  .catch((err) => {
    console.error("[db] TiDB connection failed:", err.message);
    console.error(
      "[db] Check DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME in server/.env"
    );
  });

export default pool;
