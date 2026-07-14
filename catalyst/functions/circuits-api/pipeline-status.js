const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { pipelineId } = req.path_params;
    const app = catalyst.initialize(req);
    const cache = app.cache();

    const state = await cache.get(`pipeline:${pipelineId}`);
    if (!state) {
      return res.status(404).json({ status: "error", error: { code: "NOT_FOUND", message: "Pipeline not found" } });
    }

    res.status(200).json({ status: "success", data: JSON.parse(state) });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
