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
      .replace(/[^0-9a-zA-Z가-힣_()%]/g, "")
      .toLowerCase();
  }

  function clean(value) {
    return typeof value === "string" ? value.trim() : value;
  }

  function compact(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function numberOrText(value) {
    if (value === null || value === undefined || value === "") return "";
    const text = String(value).trim();
    const numberValue = Number(text);
    return Number.isFinite(numberValue) && text !== "" ? numberValue : clean(value);
  }

  function parseYear(value) {
    const match = String(value || "").match(/(19|20)\d{2}/);
    return match ? Number(match[0]) : "";
  }

  function parseDateLabel(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");

    if (digits.length >= 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }

    if (digits.length >= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}`;
    }

    return raw;
  }

  function normalizeTitle(value) {
    return compact(value)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function citationValue(value) {
    if (value === null || value === undefined || value === "") return undefined;
    const numberValue = Number(String(value).replace(/,/g, "").trim());
    return Number.isFinite(numberValue) ? numberValue : undefined;
  }

  function formatMetric(value, digits = 2) {
    if (value === null || value === undefined || value === "") return "";
    const numberValue = Number(String(value).replace(/,/g, "").trim());
    if (!Number.isFinite(numberValue)) return String(value).trim();
    return Number.isInteger(numberValue)
      ? String(numberValue)
      : numberValue.toFixed(digits).replace(/\.?0+$/, "");
  }

  function existingCitationMap() {
    const map = new Map();
    const publications = SITE_DATA?.outputs?.publications || [];

    publications.forEach((item) => {
      const key = normalizeTitle(item.title);
      if (!key || typeof item.citations !== "number") return;
      map.set(key, item.citations);
    });

    return map;
  }

  function findSheetName(workbook, candidates) {
    const wanted = candidates.map(normalizeKey);
    return workbook.SheetNames.find((name) => {
      const normalized = normalizeKey(name);
      return wanted.some((candidate) => normalized === candidate || normalized.includes(candidate));
    });
  }

  function getSheetRows(workbook, preferredName) {
    const sheetName = findSheetName(workbook, [preferredName]);
    if (!sheetName) return [];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
  }

  function getMatrix(workbook, candidates) {
    const sheetName = findSheetName(workbook, candidates);
    if (!sheetName) return [];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" });
  }

  function rowsFromMatrix(matrix) {
    const rows = matrix.filter((row) => row.some((cell) => compact(cell) !== ""));
    if (rows.length < 2) return [];
    const headers = rows[0].map((header) => compact(header));
    return rows.slice(1).map((row) => ({ headers, row }));
  }

  function valueByHeader(record, aliases, options = {}) {
    const wanted = aliases.map(normalizeKey);
    const matches = [];

    record.headers.forEach((header, index) => {
      const normalized = normalizeKey(header);
      if (wanted.includes(normalized)) matches.push(index);
    });

    if (!matches.length) return "";
    const index = options.last ? matches[matches.length - 1] : matches[0];
    return clean(record.row[index]);
  }

  function readCell(row, aliases) {
    const entries = Object.entries(row);
    const wanted = aliases.map(normalizeKey);
    const match = entries.find(([key]) => wanted.includes(normalizeKey(key)));
    return match ? clean(match[1]) : "";
  }

  function applyMetrics(rows) {
    if (!rows.length || typeof SITE_DATA === "undefined") return;
    const metrics = { ...(SITE_DATA.scholarMetrics || {}) };

    rows.forEach((row) => {
      const key = readCell(row, ["key", "metric", "name", "항목"]);
      const value = readCell(row, ["value", "값", "수치"]);
      const normalized = METRIC_KEYS[normalizeKey(key)];
      if (normalized && value !== "") metrics[normalized] = numberOrText(value);
    });

    SITE_DATA.scholarMetrics = metrics;
  }

  function publicationFromExcelRecord(record, source, citationMap = new Map()) {
    const title = compact(valueByHeader(record, ["title", "논문명", "제목"]));
    if (!title) return null;
    if (/^https?:\/\//i.test(title)) return null;

    const venue = compact(valueByHeader(record, ["venue", "journal", "학술지", "게재지명"]));
    const publicationDate = valueByHeader(record, ["최종출판", "온라인출판", "KCI"]);
    const indexType = compact(valueByHeader(record, ["등급", "논문종류", "indexType", "index", "구분"]));
    const impactFactor = valueByHeader(record, ["IF(최신)", "impactFactor", "IF", "impact factor"]);
    const impactFactorAtPublication = valueByHeader(record, ["IF(게재년도)"]);
    const percentile = valueByHeader(record, ["Percentile", "JIF Percentile(최신)", "percentile"]);
    const topPercent = valueByHeader(record, ["Rank(상위)", "topPercent", "top percent"]);
    const role = compact(valueByHeader(record, ["저자구문"], { last: true }));
    const authors = compact(valueByHeader(record, ["저자"], { last: true })) || role;
    const authorCount = valueByHeader(record, ["인원수", "발표자수"]);
    const paperUrl = compact(valueByHeader(record, ["인터넷주소", "paperUrl", "url", "link", "링크"]));
    const excelCitations = citationValue(valueByHeader(record, ["citations", "인용"]));
    const fallbackCitations = citationMap.get(normalizeTitle(title));

    return {
      type: "journal",
      journalClass: source === "domestic" ? "KCI" : "SCI",
      year: parseYear(publicationDate),
      citations: excelCitations ?? fallbackCitations,
      title,
      authors,
      venue,
      paperUrl,
      role,
      authorCount: Number(authorCount) || "",
      publicationDate: parseDateLabel(publicationDate),
      volume: compact(valueByHeader(record, ["권호"])),
      pages: compact(valueByHeader(record, ["페이지"])),
      issn: compact(valueByHeader(record, ["ISSN"])),
      metrics: {
        indexType: indexType || (source === "domestic" ? "KCI" : ""),
        impactFactor: formatMetric(impactFactor, 2),
        impactFactorAtPublication: formatMetric(impactFactorAtPublication, 2),
        percentile: formatMetric(percentile, 2),
        topPercent: formatMetric(topPercent, 2)
      }
    };
  }

  function applyGenericPublications(rows) {
    if (!rows.length || typeof SITE_DATA === "undefined") return [];

    return rows
      .map((row) => {
        const title = readCell(row, ["title", "논문명", "제목"]);
        if (!title) return null;

        const metrics = {};
        const indexType = readCell(row, ["indexType", "index", "구분"]);
        const impactFactor = readCell(row, ["impactFactor", "IF", "impact factor"]);
        const percentile = readCell(row, ["percentile", "JCR percentile", "percentile(%)"]);
        const topPercent = readCell(row, ["topPercent", "top percent", "상위"]);

        if (indexType) metrics.indexType = indexType;
        if (impactFactor) metrics.impactFactor = formatMetric(impactFactor, 2);
        if (percentile) metrics.percentile = formatMetric(percentile, 2);
        if (topPercent) metrics.topPercent = formatMetric(topPercent, 2);

        return {
          type: readCell(row, ["type", "유형"]) || "journal",
          year: Number(readCell(row, ["year", "연도"])) || "",
          citations: citationValue(readCell(row, ["citations", "인용"])),
          title,
          authors: readCell(row, ["authors", "저자"]),
          venue: readCell(row, ["venue", "journal", "학술지", "게재지"]),
          doi: readCell(row, ["doi", "DOI"]),
          paperUrl: readCell(row, ["paperUrl", "url", "link", "링크"]),
          metrics: Object.keys(metrics).length ? metrics : undefined
        };
      })
      .filter(Boolean);
  }

  function applyPublications(publications) {
    if (!publications.length || typeof SITE_DATA === "undefined") return;

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
        description: item.authors || item.role || "",
        page: "publications",
        anchor: `#publication-${index + 1}`,
        linkLabel: { ko: "전체 목록에서 보기", en: "View in full list" },
        tags: [String(item.year || ""), item.journalClass === "KCI" ? "KCI" : "SCI(E)"].filter(Boolean)
      }));
  }

  function dedupeActivities(items) {
    const seen = new Set();

    return items.filter((item) => {
      const title = typeof item.title === "object" ? item.title.ko || item.title.en : item.title;
      const body = typeof item.body === "object" ? item.body.ko || item.body.en : item.body;
      const key = [item.date, title, body]
        .map((part) => compact(part).toLowerCase())
        .join("|");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function removeAwardedPresentations(awards, presentations) {
    const awardedPaperTitles = new Set(
      awards
        .map((item) => {
          const body = typeof item.body === "object" ? item.body.ko || item.body.en : item.body;
          return normalizeTitle(String(body || "").split(" · ")[0]);
        })
        .filter(Boolean)
    );

    return presentations.filter((item) => {
      const body = typeof item.body === "object" ? item.body.ko || item.body.en : item.body;
      const paperTitle = normalizeTitle(String(body || "").split(" · ")[0]);
      return !paperTitle || !awardedPaperTitles.has(paperTitle);
    });
  }

  function buildAwardActivities(records) {
    return records
      .map((record) => {
        const award = compact(valueByHeader(record, ["수상 명(년도)", "수상명", "award"]));
        const title = compact(valueByHeader(record, ["논문 명", "논문명", "제목"]));
        const organization = compact(valueByHeader(record, ["기관", "organization"]));
        const date = parseDateLabel(valueByHeader(record, ["수상날짜", "date"]));
        if (!award && !title) return null;

        return {
          date: date || parseYear(title) || "",
          title: { ko: `수상: ${award}`, en: `Award: ${award}` },
          body: {
            ko: [title, organization].filter(Boolean).join(" · "),
            en: [title, organization].filter(Boolean).join(" · ")
          }
        };
      })
      .filter(Boolean);
  }

  function buildPresentationActivities(records) {
    return records
      .map((record) => {
        const title = compact(valueByHeader(record, ["논문 명", "논문명", "제목"]));
        const event = compact(valueByHeader(record, ["학술발표 명", "학술발표명", "conference"]));
        const date = parseDateLabel(valueByHeader(record, ["년도", "연도", "date"]));
        const role = compact(valueByHeader(record, ["저자", "role"]));
        if (!title && !event) return null;

        return {
          date,
          title: { ko: `학술발표: ${event || title}`, en: `Conference Presentation: ${event || title}` },
          body: {
            ko: [title, role].filter(Boolean).join(" · "),
            en: [title, role].filter(Boolean).join(" · ")
          }
        };
      })
      .filter(Boolean);
  }

  function activitySortValue(item) {
    const digits = String(item?.date || "").replace(/\D/g, "");
    return Number(digits.padEnd(8, "0")) || 0;
  }

  function applyWorkbookSpecificSheets(workbook) {
    const citationMap = existingCitationMap();
    const sci = rowsFromMatrix(getMatrix(workbook, ["전체-ver1-IF_SCI", "SCI"])).map((record) =>
      publicationFromExcelRecord(record, "international", citationMap)
    );
    const domestic = rowsFromMatrix(getMatrix(workbook, ["전체-ver1-IF_국내", "국내"])).map((record) =>
      publicationFromExcelRecord(record, "domestic", citationMap)
    );
    const publications = [...sci, ...domestic].filter(Boolean);

    if (publications.length) {
      applyPublications(publications);
    }

    const awards = dedupeActivities(buildAwardActivities(rowsFromMatrix(getMatrix(workbook, ["수상실적", "수상"]))));
    const presentations = removeAwardedPresentations(
      awards,
      dedupeActivities(buildPresentationActivities(rowsFromMatrix(getMatrix(workbook, ["학술발표", "발표"]))))
    );

    if (awards.length || presentations.length) {
      SITE_DATA.activities = (awards.length ? awards : presentations).sort((a, b) => activitySortValue(b) - activitySortValue(a));
      SITE_DATA.awards = awards;
      SITE_DATA.presentations = presentations;
    }
  }

  async function loadExcelData() {
    if (typeof SITE_DATA === "undefined" || typeof XLSX === "undefined") return;

    try {
      const response = await fetch(`${EXCEL_PATH}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) return;

      const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
      applyMetrics(getSheetRows(workbook, "metrics"));

      const genericPublications = applyGenericPublications(getSheetRows(workbook, "publications"));
      if (genericPublications.length) applyPublications(genericPublications);

      applyWorkbookSpecificSheets(workbook);
      window.SITE_DATA_EXCEL_LOADED = true;
    } catch (error) {
      console.warn("Excel data was not applied.", error);
    }
  }

  window.SITE_DATA_READY = loadExcelData();
})();
