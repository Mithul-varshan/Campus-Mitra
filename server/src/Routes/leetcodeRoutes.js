import { Router } from "express";
import {
  checkLeetCodeHealth,
  getConsolidatedStats,
  proxyLeetcodeRequest,
} from "../Controllers/leetcodeController.js";

const router = Router();

// Health check to verify Docker / remote connectivity
router.get("/health", checkLeetCodeHealth);

// Consolidated statistics (profile + solved + contest + badges + calendar)
router.get("/stats/:username", getConsolidatedStats);

// Subpath proxy (e.g. /proxy/:username/badges, /proxy/:username/solved)
router.get("/proxy/:username/:subpath", proxyLeetcodeRequest);

export default router;
