const { verifyJWT } = require("../auth-api/login");

const ROLE_HIERARCHY = {
  SCRB_ADMIN: 5,
  DISTRICT_SP: 4,
  STATION_SHO: 3,
  INVESTIGATOR: 2,
  ANALYST: 1,
};

function requireAuth(handler, options = {}) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "error",
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
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

      req.user = payload;

      // Role check
      if (options.roles && options.roles.length > 0) {
        const userLevel = ROLE_HIERARCHY[payload.role] || 0;
        const requiredLevel = Math.max(...options.roles.map((r) => ROLE_HIERARCHY[r] || 0));
        if (userLevel < requiredLevel) {
          return res.status(403).json({
            status: "error",
            error: { code: "FORBIDDEN", message: "Insufficient permissions" },
          });
        }
      }

      // Scope check
      if (options.scopeCheck && req.path_params?.id) {
        const resourceId = parseInt(req.path_params.id);
        if (payload.role === "STATION_SHO" && payload.unitId !== resourceId) {
          return res.status(403).json({
            status: "error",
            error: { code: "FORBIDDEN", message: "Access restricted to own station" },
          });
        }
      }

      return handler(req, res);
    } catch (err) {
      return res.status(401).json({
        status: "error",
        error: { code: "UNAUTHORIZED", message: "Authentication failed" },
      });
    }
  };
}

module.exports = { requireAuth, ROLE_HIERARCHY };
