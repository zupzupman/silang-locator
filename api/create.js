const crypto = require("crypto");
const { redis, isStaff } = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!isStaff(req)) return res.status(401).json({ error: "Wrong password" });
  const b = req.body || {};
  const id = crypto.randomBytes(6).toString("base64url");
  const rec = {
    id, status: "sent", created: Date.now(),
    label: String(b.label || "").slice(0, 60),
    phone: String(b.phone || "").replace(/[^\d+]/g, "").slice(0, 16),
  };
  await redis.set("loc:" + id, rec, { ex: 900 });
  await redis.zadd("loc:index", { score: rec.created, member: id });
  res.json({ id });
};
