async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "error", error: { code: "UNAUTHORIZED", message: "No token provided" } });
    }

    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const email = decoded.split(":")[0];

    res.status(200).json({
      status: "success",
      data: { email, authenticated: true },
    });
  } catch (err) {
    res.status(401).json({ status: "error", error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
}

module.exports = handler;
