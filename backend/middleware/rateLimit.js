import jwt from "jsonwebtoken";

const buckets = new Map();

function getAuthPayload(req) {
  const header = req.headers.authorization || "";
  const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearerToken || req.cookies?.token;

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function getClientKey(req, payload) {
  if (payload?.id) return `user:${payload.id}`;

  return (
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export function rateLimit({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = "global",
  message = "Too many requests. Please try again later.",
  skipAdmin = false,
} = {}) {
  return (req, res, next) => {
    const payload = getAuthPayload(req);

    if (skipAdmin && payload?.role === "admin") {
      return next();
    }

    const now = Date.now();
    const key = `${keyPrefix}:${getClientKey(req, payload)}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });

      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", max - 1);
      return next();
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > max) {
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({ message });
    }

    return next();
  };
}

setInterval(() => {
  const now = Date.now();

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 60 * 1000).unref();

export default rateLimit;
