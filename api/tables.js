import fs from "fs";
import path from "path";

const TABLES_FILE = path.join(process.cwd(), "data", "tables.json");
const ALLOWED = ["free", "busy", "reserved"];

function readTables() {
  try {
    const raw = fs.readFileSync(TABLES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeTables(data) {
  fs.writeFileSync(TABLES_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(readTables());
  }

  if (req.method === "POST") {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { id, status } = req.body;

    if (!id || !ALLOWED.includes(status)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const tables = readTables();

    if (!(id in tables)) {
      return res.status(404).json({ error: "Table not found" });
    }

    tables[id] = status;
    writeTables(tables);

    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
