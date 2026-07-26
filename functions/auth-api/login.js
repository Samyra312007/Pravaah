const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const TOKEN_EXPIRY = "24h";

const mockUsers = {
  "admin@ksp.gov.in": {
    id: "user_001", name: "SCRB Admin", role: "SCRB_ADMIN",
    districtId: null, unitId: null, password: "admin@123",
  },
  "sp@ksp.gov.in": {
    id: "user_002", name: "SP Mahesh", role: "DISTRICT_SP",
    districtId: 1, unitId: null, password: "sp@123",
  },
  "sho@ksp.gov.in": {
    id: "user_003", name: "SHO Ravi", role: "STATION_SHO",
    districtId: 1, unitId: 1, password: "sho@123",
  },
  "investigator@ksp.gov.in": {
    id: "user_004", name: "Investigator Kumar", role: "INVESTIGATOR",
    districtId: null, unitId: null, password: "investigator@123",
  },
  "analyst@ksp.gov.in": {
    id: "user_005", name: "Analyst Reader", role: "ANALYST",
    districtId: null, unitId: null, password: "analyst@123",
  },
};

function base64UrlEncode(data) {
  return Buffer.from(data).toString("base64url");
}

function base64UrlDecode(str) {
  return Buffer.from(str, "base64url").toString("utf-8");
}

function createJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 86400,
    iss: "ksp-crime-intelligence",
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function verifyJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

async function handler(req, res) {
  try {
    const { email, password } = JSON.parse(req.body);
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        error: { code: "VALIDATION", message: "Email and password required" },
      });
    }

    const mockUser = mockUsers[email.toLowerCase()];
    if (!mockUser || password !== mockUser.password) {
      return res.status(401).json({
        status: "error",
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
      });
    }

    const token = createJWT({
      sub: mockUser.id,
      email,
      role: mockUser.role,
      districtId: mockUser.districtId,
      unitId: mockUser.unitId,
    });

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email,
          role: mockUser.role,
          districtId: mockUser.districtId,
          unitId: mockUser.unitId,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL", message: err.message },
    });
  }
}

module.exports = handler;
module.exports.verifyJWT = verifyJWT;
