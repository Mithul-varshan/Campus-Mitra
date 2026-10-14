import { Router } from "express";
import { exchangeCode } from "../Controllers/oauthController.js";

const router = Router();

// POST /api/oauth/exchange-code
router.post("/exchange-code", exchangeCode);

export default router;
