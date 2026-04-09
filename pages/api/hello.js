/**
 * Serverless API Route: /api/hello
 * Deployed as an isolated serverless function on Vercel.
 */
export default function handler(req, res) {
  const appName = process.env.APP_NAME || "Vercel PoC";

  // Simple request logging
  console.log(`[${new Date().toISOString()}] ${req.method} /api/hello — user-agent: ${req.headers["user-agent"]}`);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.status(200).json({
    message: `Hello from ${appName}!`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    region: process.env.VERCEL_REGION || "local",
  });
}
