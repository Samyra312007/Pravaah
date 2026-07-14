const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { to, subject, message, notificationType, actionUrl, actionLabel } = JSON.parse(req.body);
    const app = catalyst.initialize(req);
    const mail = app.mail();

    const htmlBody = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; color: #fff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">KSP Notification</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0;">
          <p style="font-size: 14px; color: #334155;">${message}</p>
          ${actionUrl ? `
            <p style="margin-top: 16px;">
              <a href="${actionUrl}" style="display: inline-block; background: #1e3a5f; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                ${actionLabel || "View Details"}
              </a>
            </p>
          ` : ""}
        </div>
        <div style="text-align: center; padding: 12px; font-size: 10px; color: #94a3b8;">
          Karnataka State Police · Crime Intelligence Platform
        </div>
      </div>
    `;

    await mail.sendMail({
      to: Array.isArray(to) ? to : [to],
      subject: subject || "KSP Notification",
      html: htmlBody,
      category: notificationType || "notification",
    });

    res.status(200).json({ status: "success", data: { message: "Notification sent" } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "MAIL_FAILED", message: err.message } });
  }
}

module.exports = handler;
