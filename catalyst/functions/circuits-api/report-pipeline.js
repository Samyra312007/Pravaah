const catalyst = require("zcatalyst-sdk-node");

const PIPELINE_STEPS = [
  "FETCH_DATA",
  "GENERATE_HTML",
  "CONVERT_TO_PDF",
  "STORE_IN_STRATUS",
  "SEND_EMAIL",
];

async function handler(req, res) {
  try {
    const { districtId, districtName, reportType, periodStart, periodEnd, recipientEmails } = JSON.parse(req.body);
    const pipelineId = `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const app = catalyst.initialize(req);

    const pipelineState = {
      pipelineId,
      districtId,
      districtName,
      reportType: reportType || "district-summary",
      periodStart,
      periodEnd,
      recipientEmails: recipientEmails || [],
      step: 0,
      status: "running",
      results: {},
      errors: [],
      startedAt: new Date().toISOString(),
    };

    // Step 1: Fetch Data
    try {
      const query = app.datastore().getTable("CaseMaster").getQuery();
      const rows = await query.execute(`
        SELECT cm.*, cg.CrimeGroupName, cs.CaseStatusName, u.UnitName, d.DistrictName
        FROM CaseMaster cm
        LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
        LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
        LEFT JOIN Unit u ON cm.UnitID = u.UnitID
        LEFT JOIN District d ON u.DistrictID = d.DistrictID
        WHERE u.DistrictID = ?
      `, { params: [parseInt(districtId)] });
      pipelineState.results.dataCount = rows.length;
      pipelineState.step = 1;
    } catch (err) {
      pipelineState.errors.push({ step: "FETCH_DATA", error: err.message });
    }

    // Step 2: Generate HTML
    if (pipelineState.errors.length === 0) {
      try {
        const smartbrowz = app.smartbrowz();
        const htmlContent = `<html><body><h1>${districtName || "District"} Report</h1><p>Period: ${periodStart || "—"} to ${periodEnd || "—"}</p><p>Cases: ${pipelineState.results.dataCount || 0}</p></body></html>`;
        pipelineState.results.htmlGenerated = true;
        pipelineState.results.htmlContent = htmlContent;
        pipelineState.step = 2;
      } catch (err) {
        pipelineState.errors.push({ step: "GENERATE_HTML", error: err.message });
      }
    }

    // Step 3: Convert to PDF
    if (pipelineState.errors.length === 0) {
      try {
        const smartbrowz = app.smartbrowz();
        const pdf = await smartbrowz.generatePdf({
          html_content: pipelineState.results.htmlContent,
          page_size: "A4",
          margin: "15mm",
        });
        pipelineState.results.pdfContent = pdf.pdf_content;
        pipelineState.results.pageCount = pdf.page_count || 1;
        pipelineState.step = 3;
      } catch (err) {
        pipelineState.errors.push({ step: "CONVERT_TO_PDF", error: err.message });
      }
    }

    // Step 4: Store in Stratus
    if (pipelineState.errors.length === 0) {
      try {
        const stratus = app.stratus();
        const fileKey = `reports/${reportType || "district"}-${districtId}-${Date.now()}.pdf`;
        const fileResp = await stratus.saveAsFile({
          file_name: fileKey,
          file_content: pipelineState.results.pdfContent,
          content_type: "application/pdf",
        });
        pipelineState.results.fileKey = fileKey;
        pipelineState.results.downloadUrl = fileResp.download_url || `/api/reports/download?key=${fileKey}`;
        pipelineState.step = 4;
      } catch (err) {
        pipelineState.errors.push({ step: "STORE_IN_STRATUS", error: err.message });
      }
    }

    // Step 5: Send Email
    if (pipelineState.errors.length === 0 && pipelineState.recipientEmails.length > 0) {
      try {
        const mail = app.mail();
        await mail.sendMail({
          to: pipelineState.recipientEmails,
          subject: `Intelligence Report — ${districtName || "District"}`,
          html: `<p>The report for <strong>${districtName || "District"}</strong> is ready.</p>
                 <p><a href="${pipelineState.results.downloadUrl}">Download PDF</a></p>`,
          category: "circuits-report",
        });
        pipelineState.results.emailSent = true;
        pipelineState.step = 5;
      } catch (err) {
        pipelineState.errors.push({ step: "SEND_EMAIL", error: err.message });
      }
    }

    const cache = app.cache();
    pipelineState.status = pipelineState.errors.length === 0 ? "completed" : "completed_with_errors";
    pipelineState.completedAt = new Date().toISOString();
    await cache.put(`pipeline:${pipelineId}`, JSON.stringify(pipelineState), 86400);

    res.status(200).json({
      status: "success",
      data: {
        pipelineId,
        status: pipelineState.status,
        stepsCompleted: pipelineState.step,
        totalSteps: PIPELINE_STEPS.length,
        errors: pipelineState.errors.length,
        downloadUrl: pipelineState.results.downloadUrl,
        completedAt: pipelineState.completedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "PIPELINE_FAILED", message: err.message } });
  }
}

module.exports = handler;
