const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;
const MAX_POSTS = 30;

module.exports = async function handler(req, res) {
  const corsOrigin = getCorsOrigin(req.headers.origin);

  if (!corsOrigin && req.headers.origin) {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  setCorsHeaders(res, corsOrigin || "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Supabase is not configured." });
  }

  try {
    if (req.method === "GET") {
      return listPosts(res);
    }

    if (req.method === "POST") {
      return createPost(req, res);
    }

    if (req.method === "DELETE") {
      return deletePost(req, res);
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
};

async function listPosts(res) {
  const response = await supabaseRequest(
    `/rest/v1/contact_posts?select=id,name,email,subject,message,attachments,created_at&order=created_at.desc&limit=${MAX_POSTS}`
  );
  const rows = await readJson(response);

  if (!response.ok) {
    return res.status(response.status).json({ error: rows?.message || "Could not load posts." });
  }

  return res.status(200).json({ posts: rows.map(normalizeRow) });
}

async function createPost(req, res) {
  const body = normalizeBody(req.body);

  if (!verifyWriteCode(req, body)) {
    return res.status(401).json({ error: "A valid board authentication code is required." });
  }

  const post = {
    name: clipText(body.name, 80),
    email: clipText(body.email, 160),
    subject: clipText(body.subject, 160),
    message: clipText(body.message, 3000),
    attachments: normalizeAttachments(body.attachments)
  };

  if (!post.name || !post.email || !post.subject || !post.message) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const response = await supabaseRequest("/rest/v1/contact_posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(post)
  });
  const rows = await readJson(response);

  if (!response.ok) {
    return res.status(response.status).json({ error: rows?.message || "Could not create post." });
  }

  return res.status(201).json({ post: normalizeRow(Array.isArray(rows) ? rows[0] : rows) });
}

async function deletePost(req, res) {
  const body = normalizeBody(req.body);
  const id = clipText(body.id || req.query?.id, 80);

  if (!verifyWriteCode(req, body)) {
    return res.status(401).json({ error: "A valid board authentication code is required." });
  }

  if (!id) {
    return res.status(400).json({ error: "Post id is required." });
  }

  const response = await supabaseRequest(`/rest/v1/contact_posts?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  });

  if (!response.ok) {
    const payload = await readJson(response);
    return res.status(response.status).json({ error: payload?.message || "Could not delete post." });
  }

  return res.status(204).end();
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

async function readJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
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

function normalizeAttachments(attachments) {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments.slice(0, MAX_ATTACHMENTS).map((file) => {
    const dataUrl = clipText(file?.dataUrl, MAX_FILE_SIZE * 2.2);
    const size = Number(file?.size || 0);

    if (!dataUrl || !size || size > MAX_FILE_SIZE) {
      throw new Error("Each attachment must be 2MB or smaller.");
    }

    return {
      name: clipText(file?.name, 180),
      type: clipText(file?.type, 120),
      size,
      dataUrl
    };
  });
}

function normalizeRow(row) {
  return {
    id: row?.id,
    name: row?.name || "",
    email: row?.email || "",
    subject: row?.subject || "",
    message: row?.message || "",
    attachments: Array.isArray(row?.attachments) ? row.attachments : [],
    createdAt: row?.created_at || row?.createdAt || ""
  };
}

function verifyWriteCode(req, body) {
  const configuredCode = String(process.env.CONTACT_BOARD_WRITE_CODE || "").trim();
  const suppliedCode = String(body?.authCode || req.headers["x-contact-board-code"] || "").trim();

  return Boolean(configuredCode && suppliedCode && configuredCode === suppliedCode);
}

function clipText(value, limit) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > limit ? text.slice(0, limit) : text;
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
