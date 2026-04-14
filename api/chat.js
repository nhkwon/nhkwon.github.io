const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const ALLOWED_MODELS = new Set([
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
]);

module.exports = async function handler(req, res) {
  const corsOrigin = getCorsOrigin(req.headers.origin);

  if (!corsOrigin && req.headers.origin) {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  setCorsHeaders(res, corsOrigin || "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Gemini chat proxy is running.",
      defaultModel: DEFAULT_MODEL
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
  }

  try {
    const body = normalizeBody(req.body);
    const userMessage = clipText(body.message, 2000);
    const siteContext = clipText(body.siteContext, 10000);
    const language = body.lang === "en" ? "en" : "ko";
    const page = clipText(body.page, 80);
    const url = clipText(body.url, 500);
    const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;

    if (!userMessage) {
      return res.status(400).json({ error: "A user message is required." });
    }

    const history = normalizeHistory(body.history);
    const systemInstruction = buildSystemInstruction({
      lang: language,
      page,
      url,
      siteContext
    });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            ...history,
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 700
          }
        })
      }
    );

    const payload = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const message = payload?.error?.message || "Gemini API request failed.";
      return res.status(geminiResponse.status).json({ error: message });
    }

    const reply = extractText(payload);

    if (!reply) {
      return res.status(502).json({ error: "Gemini returned an empty response." });
    }

    return res.status(200).json({
      reply,
      model
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
};

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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
    .slice(-16)
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: clipText(item.text, 2000) }]
    }));
}

function buildSystemInstruction({ lang, page, url, siteContext }) {
  const languageInstruction =
    lang === "en"
      ? "Reply in English."
      : "Reply in Korean unless the user's message is clearly in English.";

  return [
    "You are the AI assistant for a personal academic website.",
    languageInstruction,
    "Use the supplied site context whenever possible.",
    "Do not invent facts, dates, affiliations, publication details, or contact information.",
    "If the site context does not contain the answer, say so clearly and suggest contacting the site owner.",
    "Keep answers concise, practical, and friendly.",
    page ? `Current page: ${page}` : "",
    url ? `Current URL: ${url}` : "",
    siteContext ? `Website context:\n${siteContext}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");
}

function extractText(payload) {
  const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];

  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
    const text = parts
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

function clipText(value, limit) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > limit ? text.slice(0, limit) : text;
}
