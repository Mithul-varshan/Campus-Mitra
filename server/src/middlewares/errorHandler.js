/**
 * Global error handler — must be registered last with app.use()
 */
export function errorHandler(err, req, res, _next) {
  console.error("[errorHandler]", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
  });
}

/**
 * 404 handler — catches any unmatched route
 */
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
