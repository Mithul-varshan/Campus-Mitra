import axios from "axios";
import env from "../config/env.js";

/**
 * POST /api/oauth/exchange-code
 * Exchanges a GitHub OAuth authorization code for an access token.
 * Keeps the client_secret server-side.
 */
export async function exchangeCode(req, res) {
  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return res.status(500).json({
        error: "Server OAuth configuration missing",
        message: "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in server/.env",
      });
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token, error, error_description } = tokenResponse.data || {};

    if (error) {
      return res.status(400).json({ error, error_description });
    }

    if (!access_token) {
      return res
        .status(400)
        .json({ error: "Failed to obtain GitHub access token" });
    }

    return res.json({ access_token, token_type: "bearer" });
  } catch (err) {
    return res.status(500).json({
      error: "Token exchange failed",
      message: err?.response?.data || err?.message || "Unknown error",
    });
  }
}
