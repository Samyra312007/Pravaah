const { verifyJWT } = require("./login");

async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        error: { code: "UNAUTHORIZED", message: "No token provided" },
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJWT(token);

    if (!payload) {
      return res.status(401).json({
        status: "error",
        error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        email: payload.email,
        role: payload.role,
        districtId: payload.districtId,
        unitId: payload.unitId,
        authenticated: true,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "error",
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    });
  }
}

module.exports = handler;
