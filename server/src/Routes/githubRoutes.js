import { Router } from "express";
import { getGitHubStats, getGitHubRepos } from "../Controllers/githubController.js";

const router = Router();

router.get("/stats/:username", getGitHubStats);
router.get("/repos/:username", getGitHubRepos);

export default router;
