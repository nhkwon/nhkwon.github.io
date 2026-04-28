(() => {
  const EXCEL_PATH = "assets/data/site-data.xlsx";
  const METRIC_KEYS = {
    citationsall: "citationsAll",
    citations_all: "citationsAll",
    citationssince2021: "citationsSince2021",
    citations_since_2021: "citationsSince2021",
    hindexall: "hIndexAll",
    h_index_all: "hIndexAll",
    hindexsince2021: "hIndexSince2021",
    h_index_since_2021: "hIndexSince2021",
    i10indexall: "i10IndexAll",
    i10_index_all: "i10IndexAll",
    i10indexsince2021: "i10IndexSince2021",
    i10_index_since_2021: "i10IndexSince2021",
    updated: "updated"
  };

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .replace(/[\s-]+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();
  }

  function clean(value) {
    return typeof value === "string" ? value.trim() : value;
  }

  function numberOrText(value) {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const numberValue = Number(value);
    return Number.isFinite(numberValue) && String(value).trim() !== "" ? numberValue : clean(value);
  }

  function getSheetRows(workbook, preferredName) {
    const sheetName =
      workbook.SheetNames.find((name) => normalizeKey(name) === normalizeKey(preferredName)) ||
      workbook.SheetNames.find((name) => normalizeKey(name).includes(normalizeKey(preferredName)));

    if (!sheetName) {
      return [];
    }

    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
  }

  function readCell(row, aliases) {
    const entries = Object.entries(row);
    const wanted = aliases.map(normalizeKey);
    const match = entries.find(([key]) => wanted.includes(normalizeKey(key)));
    return match ? clean(match[1]) : "";
  }

  function applyMetrics(rows) {
    if (!rows.length || typeof SITE_DATA === "undefined") {
      return;
    }

    const metrics = { ...(SITE_DATA.scholarMetrics || {}) };

    rows.forEach((row) => {
      const key = readCell(row, ["key", "metric", "name", "항목"]);
      const value = readCell(row, ["value", "값", "수치"]);
      const normalized = METRIC_KEYS[normalizeKey(key)];

      if (normalized && value !== "") {
        metrics[normalized] = numberOrText(value);
      }
    });

    SITE_DATA.scholarMetrics = metrics;
  }

  function applyPublications(rows) {
    if (!rows.length || typeof SITE_DATA === "undefined") {
      return;
    }

    const publications = rows
      .map((row) => {
        const title = readCell(row, ["title", "논문명", "제목"]);

        if (!title) {
          return null;
        }

        const metrics = {};
        const indexType = readCell(row, ["indexType", "index", "구분"]);
        const impactFactor = readCell(row, ["impactFactor", "IF", "impact factor"]);
        const percentile = readCell(row, ["percentile", "JCR percentile", "percentile(%)"]);
        const topPercent = readCell(row, ["topPercent", "top percent", "상위"]);

        if (indexType) metrics.indexType = indexType;
        if (impactFactor) metrics.impactFactor = String(impactFactor);
        if (percentile) metrics.percentile = String(percentile);
        if (topPercent) metrics.topPercent = String(topPercent);

        return {
          type: readCell(row, ["type", "유형"]) || "journal",
          year: Number(readCell(row, ["year", "연도"])) || "",
          citations: Number(readCell(row, ["citations", "인용"])) || 0,
          title,
          authors: readCell(row, ["authors", "저자"]),
          venue: readCell(row, ["venue", "journal", "학술지", "게재지"]),
          doi: readCell(row, ["doi", "DOI"]),
          paperUrl: readCell(row, ["paperUrl", "url", "link", "링크"]),
          metrics: Object.keys(metrics).length ? metrics : undefined
        };
      })
      .filter(Boolean);

    if (!publications.length) {
      return;
    }

    SITE_DATA.outputs = SITE_DATA.outputs || {};
    SITE_DATA.outputs.publications = publications;
    SITE_DATA.outputs.featured = publications
      .slice()
      .sort((a, b) => (b.citations || 0) - (a.citations || 0) || (b.year || 0) - (a.year || 0))
      .slice(0, 6)
      .map((item, index) => ({
        type: { ko: "대표 논문", en: "Representative Paper" },
        date: String(item.year || ""),
        title: item.title,
        meta: item.venue,
        description: item.authors,
        page: "publications",
        anchor: `#publication-${index + 1}`,
        linkLabel: { ko: "전체 목록에서 보기", en: "View in full list" },
        tags: [String(item.year || ""), item.type === "conference" ? "Conference" : "Journal"].filter(Boolean)
      }));
  }

  async function loadExcelData() {
    if (typeof SITE_DATA === "undefined" || typeof XLSX === "undefined") {
      return;
    }

    try {
      const response = await fetch(`${EXCEL_PATH}?v=${Date.now()}`, { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
      applyMetrics(getSheetRows(workbook, "metrics"));
      applyPublications(getSheetRows(workbook, "publications"));
      window.SITE_DATA_EXCEL_LOADED = true;
    } catch (error) {
      console.warn("Excel data was not applied.", error);
    }
  }

  window.SITE_DATA_READY = loadExcelData();
})();
