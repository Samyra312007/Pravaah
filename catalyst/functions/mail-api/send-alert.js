const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { to, subject, alertData } = JSON.parse(req.body);
    const app = catalyst.initialize(req);
    const mail = app.mail();

    const htmlBody = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; color: #fff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">KSP Crime Intelligence Alert</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0;">
          ${alertData.map((a) => `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
              <h4 style="margin: 0 0 4px; color: #b91c1c;">${a.district} — ${a.crimeType}</h4>
              <p style="margin: 0; font-size: 13px; color: #7f1d1d;">${a.message}</p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #b91c1c;">Increase: ${a.increase}%</p>
            </div>
          `).join("")}
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;"/>
          <p style="font-size: 12px; color: #64748b;">
            <a href="${process.env.APP_URL || "https://ksp-crime.karnataka.gov.in"}/dashboard" style="color: #1e3a5f;">
              View Dashboard
            </a>
          </p>
        </div>
        <div style="text-align: center; padding: 12px; font-size: 10px; color: #94a3b8;">
          Karnataka State Police · Crime Intelligence Platform
        </div>
      </div>
    `;

    await mail.sendMail({
      to: Array.isArray(to) ? to : [to],
      subject: subject || "KSP Crime Intelligence Alert",
      html: htmlBody,
      category: "alert",
    });

    res.status(200).json({ status: "success", data: { message: "Alert email sent", recipients: Array.isArray(to) ? to.length : 1 } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "MAIL_FAILED", message: err.message } });
  }
}

module.exports = handler;
