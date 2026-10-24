const { redis, isStaff } = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!isStaff(req)) return res.status(401).json({ error: "Wrong password" });
  const b = req.body || {};
  let ids = b.all ? await redis.zrange("loc:index", 0, -1) : [b.id];
  ids = ids.map((i) => String(i || "").slice(0, 16)).filter(Boolean);
  if (ids.length) {
    await redis.del(...ids.map((i) => "loc:" + i));
    await redis.zrem("loc:index", ...ids);
  }
  res.json({ ok: true, count: ids.length });
};
