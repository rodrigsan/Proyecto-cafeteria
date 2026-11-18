const defaultOrigins = ["http://localhost:4200", "http://127.0.0.1:4200"];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const allowedMethods = "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS";
const allowedHeaders = "Content-Type,Authorization";

function cors(req, res, next) {
  const origin = req.get("Origin");
  if (!origin) {
    return next();
  }

  res.vary("Origin");
  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({ error: "Origen no permitido" });
  }

  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", allowedMethods);
  res.set("Access-Control-Allow-Headers", allowedHeaders);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
}

module.exports = cors;
