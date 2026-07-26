const catalyst = require("zcatalyst-sdk-node");

function getCache(req) {
  const app = catalyst.initialize(req);
  return app.cache();
}

async function getOrSet(req, key, fetchFn, ttl = 300) {
  const cache = getCache(req);
  try {
    const cached = await cache.get(key);
    if (cached) return JSON.parse(cached);
  } catch (_) {
    // Cache miss
  }

  const data = await fetchFn();
  await cache.put(key, JSON.stringify(data), ttl);
  return data;
}

module.exports = { getCache, getOrSet };
