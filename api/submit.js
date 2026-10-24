const { redis } = require("./_lib");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = req.body || {};
  const key = "loc:" + String(b.id || "").slice(0, 16);
  const rec = await redis.get(key);
  if (!rec) return res.status(410).json({ error: "expired" });
  if (rec.status === "received") return res.status(409).json({ error: "used" });
  if (b.action === "open") {
    if (rec.status === "sent") { rec.status = "opened"; await redis.set(key, rec, { ex: 900 }); }
    return res.json({ ok: true });
  }
  const lat = Number(b.lat), lon = Number(b.lon);
  if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180) || (lat === 0 && lon === 0))
    return res.status(400).json({ error: "bad coordinates" });
  rec.lat = lat; rec.lon = lon; rec.acc = Math.round(Number(b.acc) || 0);
  rec.status = "received"; rec.received = Date.now();
  await redis.set(key, rec, { ex: 21600 });
  res.json({ ok: true });
};
