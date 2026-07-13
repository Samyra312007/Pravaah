const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { email, password } = JSON.parse(req.body);
    if (!email || !password) {
      return res.status(400).json({ status: "error", error: { code: "VALIDATION", message: "Email and password required" } });
    }

    const app = catalyst.initialize(req);
    const auth = app.userManagement();

    try {
      const user = await auth.getUserByEmail(email);
      if (!user) throw new Error("User not found");

      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

      res.status(200).json({
        status: "success",
        data: {
          token,
          user: {
            id: user.user_id,
            name: user.first_name + " " + user.last_name,
            email: user.email,
            role: user.role_ids?.[0]?.role_name || "ANALYST",
          },
        },
      });
    } catch {
      // Demo mode: return a mock user for testing
      const mockUsers = {
        "admin@ksp.gov.in": { name: "SCRB Admin", role: "SCRB_ADMIN", districtId: null, unitId: null },
        "sp@ksp.gov.in": { name: "District SP", role: "DISTRICT_SP", districtId: 1, unitId: null },
        "sho@ksp.gov.in": { name: "Station SHO", role: "STATION_SHO", districtId: 1, unitId: 1 },
        "investigator@ksp.gov.in": { name: "Investigator Kumar", role: "INVESTIGATOR", districtId: null, unitId: null },
        "analyst@ksp.gov.in": { name: "Analyst Reader", role: "ANALYST", districtId: null, unitId: null },
      };

      const mockUser = mockUsers[email];
      if (!mockUser || password !== "password") {
        return res.status(401).json({ status: "error", error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
      }

      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
      res.status(200).json({
        status: "success",
        data: { token, user: { id: email, email, ...mockUser } },
      });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
