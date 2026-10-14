import express from "express";
import cors from "cors";

import env from "./config/env.js";
import "./config/db.js"; // initialises pool + logs connection status
import oauthRoutes from "./Routes/oauthRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();

/* ── Global middleware ─────────────────────────────────────────────── */
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

/* ── Health check ──────────────────────────────────────────────────── */
app.get("/health", (_req, res) => res.json({ status: "ok" }));

/* ── Routes ────────────────────────────────────────────────────────── */
app.use("/api/oauth", oauthRoutes);

/* ── 404 + error handler (must be last) ───────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ── Start ─────────────────────────────────────────────────────────── */
app.listen(env.PORT, () => {
  console.log(`[server] Running on http://localhost:${env.PORT}`);
});
