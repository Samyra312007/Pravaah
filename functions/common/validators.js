function validateRequired(data, fields) {
  const missing = fields.filter((f) => data[f] === undefined || data[f] === null);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

function validateDateRange(fromDate, toDate) {
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    throw new Error("Incident from date cannot be after incident to date");
  }
}

function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>]/g, "");
}

module.exports = { validateRequired, validateDateRange, sanitizeString };
