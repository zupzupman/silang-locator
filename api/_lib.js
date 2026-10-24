const { Redis } = require("@upstash/redis");
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});
const isStaff = (req) =>
  !!process.env.STAFF_PASSWORD && req.headers["x-staff-key"] === process.env.STAFF_PASSWORD;
module.exports = { redis, isStaff };
