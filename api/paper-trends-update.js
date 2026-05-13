const { refreshPaperTrendRecords } = require("./paper-trends");

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.CRON_SECRET) {
    return res.status(500).json({ error: "CRON_SECRET is not configured." });
  }

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const result = await refreshPaperTrendRecords({
      months: Number(process.env.PAPER_TREND_SCAN_MONTHS || 24),
      rowsPerJournal: Number(process.env.PAPER_TREND_ROWS_PER_JOURNAL || 30)
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(Number(error?.status || 500)).json({
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
};
