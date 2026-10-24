const { redis, isStaff } = require("./_lib");
module.exports = async (req, res) => {
  if (!isStaff(req)) return res.status(401).json({ error: "Wrong password" });
  await redis.zremrangebyscore("loc:index", 0, Date.now() - 86400000);
  const ids = await redis.zrange("loc:index", 0, 19, { rev: true });
  const recs = ids.length ? await redis.mget(...ids.map((i) => "loc:" + i)) : [];
  res.json(recs.filter(Boolean));
};
