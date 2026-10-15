import { Router } from "express";
import {
  handleAssistantQuery,
  getDatabaseStatus,
} from "../Controllers/assistantController.js";

const router = Router();

router.get("/status", getDatabaseStatus);
router.post("/query", handleAssistantQuery);

export default router;
