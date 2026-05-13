const MAX_LIST_RECORDS = 1000;
const DEFAULT_LIST_LIMIT = 60;
const DEFAULT_SCAN_MONTHS = 24;
const DEFAULT_ROWS_PER_JOURNAL = 30;
const CONCURRENT_CROSSREF_REQUESTS = 2;
const CROSSREF_TIMEOUT_MS = 12000;

const TARGET_JOURNALS = [
  { title: "Automation in Construction", short: "Automation in Construction", publisher: "Elsevier", issn: "0926-5805" },
  { title: "Journal of Building Engineering", short: "Journal of Building Engineering", publisher: "Elsevier", issn: "2352-7102" },
  { title: "Developments in the Built Environment", short: "Developments in Built Environment", publisher: "Elsevier", issn: "2666-1659" },
  { title: "Building and Environment", short: "Building and Environment", publisher: "Elsevier", issn: "0360-1323" },
  { title: "Journal of Construction Engineering and Management", short: "J. Construction Eng. & Management", publisher: "ASCE", issn: "0733-9364" },
  { title: "Journal of Management in Engineering", short: "J. Management in Engineering", publisher: "ASCE", issn: "0742-597X" },
  { title: "Journal of Computing in Civil Engineering", short: "J. Computing in Civil Engineering", publisher: "ASCE", issn: "0887-3801" }
];

async function handler(req, res) {
  const corsOrigin = getCorsOrigin(req.headers.origin);

  if (!corsOrigin && req.headers.origin) {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  setCorsHeaders(res, corsOrigin || "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      return await listPaperTrends(req, res);
    }

    if (req.method === "POST") {
      if (!verifyCronSecret(req)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      const body = normalizeBody(req.body);
      const result = await refreshPaperTrendRecords({
        months: boundedNumber(body.months, DEFAULT_SCAN_MONTHS, 1, 72),
        rowsPerJournal: boundedNumber(body.rowsPerJournal, DEFAULT_ROWS_PER_JOURNAL, 1, 100)
      });
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    const status = Number(error?.status || 500);
    return res.status(status).json({
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
}

async function listPaperTrends(req, res) {
  assertSupabaseConfigured();

  const url = requestUrl(req);
  const months = boundedNumber(url.searchParams.get("months"), DEFAULT_SCAN_MONTHS, 1, 120);
  const limit = boundedNumber(url.searchParams.get("limit"), DEFAULT_LIST_LIMIT, 1, 100);
  const journal = String(url.searchParams.get("journal") || "").trim();
  const query = String(url.searchParams.get("query") || "").trim();
  const params = new URLSearchParams();
  params.set("select", "id,doi,title,authors,venue,journal,publisher,url,citations,published_date,published_year,first_seen_at,last_seen_at,source");
  params.set("published_date", `gte.${isoDateMonthsAgo(months)}`);
  params.set("order", "published_date.desc.nullslast");
  params.set("limit", String(MAX_LIST_RECORDS));

  if (journal) {
    params.set("journal", `eq.${journal}`);
  }

  const response = await supabaseRequest(`/rest/v1/paper_trend_records?${params.toString()}`);
  const rows = await readJson(response);

  if (!response.ok) {
    return res.status(response.status).json({ error: rows?.message || "Could not load paper trends." });
  }

  const filtered = Array.isArray(rows) ? rows.filter((row) => matchesStoredQuery(row, query)) : [];
  const items = filtered.slice(0, limit).map(normalizeStoredTrendRow);
  const run = await latestPaperTrendRun();
  const lastUpdatedAt =
    items.map((item) => item.lastSeenAt).filter(Boolean).sort().reverse()[0] ||
    run?.completedAt ||
    "";

  return res.status(200).json({
    source: "stored",
    items,
    count: items.length,
    availableCount: filtered.length,
    lastUpdatedAt,
    run
  });
}

async function refreshPaperTrendRecords(options = {}) {
  assertSupabaseConfigured();

  const months = boundedNumber(options.months, DEFAULT_SCAN_MONTHS, 1, 72);
  const rowsPerJournal = boundedNumber(
    options.rowsPerJournal || process.env.PAPER_TREND_ROWS_PER_JOURNAL,
    DEFAULT_ROWS_PER_JOURNAL,
    1,
    100
  );
  const startedAt = new Date().toISOString();
  const payloads = await fetchCrossrefPayloads(
    TARGET_JOURNALS.map((journal) => ({ ...journal, months })),
    rowsPerJournal
  );
  const records = dedupeTrendRecords(
    payloads.flatMap((payload, index) => {
      const journal = TARGET_JOURNALS[index];
      return normalizeCrossrefItems(payload?.message?.items || [], journal);
    })
  );

  await upsertTrendRecords(records);

  const completedAt = new Date().toISOString();
  const result = {
    ok: true,
    source: "crossref",
    startedAt,
    completedAt,
    months,
    rowsPerJournal,
    journalsCount: TARGET_JOURNALS.length,
    respondedJournals: payloads.filter(Boolean).length,
    fetchedCount: records.length,
    storedCount: records.length
  };

  await insertTrendRun({
    ...result,
    status: "success",
    message: ""
  });

  return result;
}

async function fetchCrossrefPayloads(targets, rows) {
  const payloads = new Array(targets.length).fill(null);
  let nextIndex = 0;
  const workerCount = Math.min(CONCURRENT_CROSSREF_REQUESTS, targets.length);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < targets.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        payloads[currentIndex] = await fetchCrossrefPayload(targets[currentIndex], rows);
      }
    })
  );

  return payloads;
}

async function fetchCrossrefPayload(target, rows) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), CROSSREF_TIMEOUT_MS) : 0;

    try {
      const response = await fetch(buildCrossrefUrl(target, rows), {
        headers: { Accept: "application/json" },
        signal: controller?.signal
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      // Crossref occasionally times out. Retrying once keeps the cron durable without stalling the whole run.
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    await wait(350 * (attempt + 1));
  }

  return null;
}

function buildCrossrefUrl(data, rows) {
  const params = new URLSearchParams();
  params.set("filter", [
    "type:journal-article",
    `from-pub-date:${isoDateMonthsAgo(data.months)}`,
    `until-pub-date:${isoTodayDate()}`,
    `issn:${data.issn}`
  ].join(","));
  params.set("sort", "published");
  params.set("order", "desc");
  params.set("rows", String(rows));
  params.set("select", "DOI,title,author,container-title,published,published-print,published-online,issued,URL,is-referenced-by-count");
  return `https://api.crossref.org/works?${params.toString()}`;
}

function normalizeCrossrefItems(items, journal) {
  return items
    .map((item) => {
      const title = Array.isArray(item.title) ? item.title[0] : item.title;
      const venue = Array.isArray(item["container-title"]) ? item["container-title"][0] : item["container-title"];
      const date = crossrefPublishedDate(item);
      const doi = String(item.DOI || "").trim();
      const url = String(item.URL || "").trim();
      const record = {
        id: doi ? `doi:${doi.toLowerCase()}` : `title:${hashRecordKey([title, venue, date.iso].join("|"))}`,
        doi: doi || null,
        title: String(title || "").trim(),
        authors: formatAuthors(item.author),
        venue: String(venue || "").trim(),
        journal: journal.title,
        publisher: journal.publisher,
        url,
        citations: Number(item["is-referenced-by-count"] || 0),
        published_date: date.iso || null,
        published_year: date.year || null,
        source: "crossref",
        last_seen_at: new Date().toISOString()
      };
      return record;
    })
    .filter((item) => item.title && item.venue && isTargetVenue(item.venue, journal.title) && isResearchRecord(item));
}

function dedupeTrendRecords(records) {
  const seen = new Set();
  return records.filter((record) => {
    const key = record.id;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function upsertTrendRecords(records) {
  if (!records.length) {
    return;
  }

  for (let index = 0; index < records.length; index += 100) {
    const chunk = records.slice(index, index + 100);
    const response = await supabaseRequest("/rest/v1/paper_trend_records?on_conflict=id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(chunk)
    });

    if (!response.ok) {
      const payload = await readJson(response);
      const error = new Error(payload?.message || "Could not store paper trend records.");
      error.status = response.status;
      throw error;
    }
  }
}

async function insertTrendRun(run) {
  const response = await supabaseRequest("/rest/v1/paper_trend_runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      started_at: run.startedAt,
      completed_at: run.completedAt,
      status: run.status,
      source: run.source,
      months: run.months,
      rows_per_journal: run.rowsPerJournal,
      journals_count: run.journalsCount,
      responded_journals: run.respondedJournals,
      fetched_count: run.fetchedCount,
      stored_count: run.storedCount,
      message: run.message || ""
    })
  });

  if (!response.ok) {
    const payload = await readJson(response);
    const error = new Error(payload?.message || "Could not store paper trend run.");
    error.status = response.status;
    throw error;
  }
}

async function latestPaperTrendRun() {
  try {
    const params = new URLSearchParams();
    params.set("select", "completed_at,status,stored_count,fetched_count,journals_count,responded_journals,message");
    params.set("order", "completed_at.desc.nullslast");
    params.set("limit", "1");
    const response = await supabaseRequest(`/rest/v1/paper_trend_runs?${params.toString()}`);
    const rows = await readJson(response);

    if (!response.ok || !Array.isArray(rows) || !rows.length) {
      return null;
    }

    const row = rows[0];
    return {
      completedAt: row.completed_at || "",
      status: row.status || "",
      storedCount: Number(row.stored_count || 0),
      fetchedCount: Number(row.fetched_count || 0),
      journalsCount: Number(row.journals_count || 0),
      respondedJournals: Number(row.responded_journals || 0),
      message: row.message || ""
    };
  } catch (error) {
    return null;
  }
}

function normalizeStoredTrendRow(row) {
  return {
    id: row?.id || "",
    doi: row?.doi || "",
    title: row?.title || "",
    authors: row?.authors || "",
    venue: row?.venue || row?.journal || "",
    journal: row?.journal || "",
    publisher: row?.publisher || "",
    url: row?.url || "",
    citations: Number(row?.citations || 0),
    date: formatDisplayDate(row?.published_date, row?.published_year),
    year: Number(row?.published_year || 0),
    firstSeenAt: row?.first_seen_at || "",
    lastSeenAt: row?.last_seen_at || "",
    source: row?.source || "crossref"
  };
}

function matchesStoredQuery(row, query) {
  const tokens = normalizeText(query)
    .split(" ")
    .filter((token) => token.length > 2);

  if (!tokens.length) {
    return true;
  }

  const corpus = normalizeText([row?.title, row?.venue, row?.journal, row?.authors].filter(Boolean).join(" "));
  return tokens.some((token) => corpus.includes(token));
}

function isTargetVenue(venue, target) {
  const normalizedVenue = normalizeText(venue);
  const normalizedTarget = normalizeText(target);
  return normalizedVenue.includes(normalizedTarget) || normalizedTarget.includes(normalizedVenue);
}

function isResearchRecord(item) {
  const title = normalizeText(item.title);
  const excludedTitles = [
    "editorial board",
    "editorial",
    "corrigendum",
    "erratum",
    "correction",
    "correction to",
    "retraction",
    "contents",
    "front matter",
    "back matter",
    "announcement",
    "call for papers",
    "preface"
  ];

  return !excludedTitles.some((excluded) => title === excluded || title.startsWith(`${excluded} `));
}

function crossrefPublishedDate(item) {
  const candidates = [item?.["published-online"], item?.["published-print"], item?.published, item?.issued];
  const parts = candidates
    .map((candidate) => candidate?.["date-parts"]?.[0])
    .find((part) => Array.isArray(part) && part.length);
  const year = Number(parts?.[0] || 0);
  const month = Number(parts?.[1] || 1);
  const day = Number(parts?.[2] || 1);

  if (!year) {
    return { year: null, iso: "" };
  }

  return {
    year,
    iso: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  };
}

function formatAuthors(authors) {
  if (!Array.isArray(authors) || !authors.length) {
    return "Author metadata unavailable";
  }

  const names = authors
    .slice(0, 3)
    .map((author) => [author.given, author.family].filter(Boolean).join(" ") || author.name || "")
    .filter(Boolean);

  return `${names.join(", ")}${authors.length > 3 ? " et al." : ""}`;
}

function formatDisplayDate(date, year) {
  if (date) {
    return String(date).replace(/-/g, ".");
  }

  return year ? String(year) : "Date unavailable";
}

function supabaseRequest(path, options = {}) {
  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {})
    }
  });
}

function assertSupabaseConfigured() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error("Supabase is not configured.");
    error.status = 503;
    throw error;
  }
}

async function readJson(response) {
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

function normalizeBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}

function verifyCronSecret(req) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && req.headers.authorization === `Bearer ${secret}`);
}

function requestUrl(req) {
  return new URL(req.url || "/api/paper-trends", "https://nhkwon-github-io.vercel.app");
}

function boundedNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(number)));
}

function isoDateMonthsAgo(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - Number(months || DEFAULT_SCAN_MONTHS));
  return date.toISOString().slice(0, 10);
}

function isoTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hashRecordKey(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCorsOrigin(origin) {
  const allowed = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!allowed.length) {
    return "*";
  }

  if (origin && allowed.includes(origin)) {
    return origin;
  }

  return "";
}

function setCorsHeaders(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

module.exports = handler;
module.exports.refreshPaperTrendRecords = refreshPaperTrendRecords;
