import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== middleware =====
app.use(cors());
app.use(express.json());

// ===== paths =====
const DATA_DIR = path.resolve("data");
const TABLES_FILE = path.join(DATA_DIR, "tables.json");

// ===== helpers =====
function readTables() {
  const raw = fs.readFileSync(TABLES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTables(data) {
  fs.writeFileSync(TABLES_FILE, JSON.stringify(data, null, 2));
}

// ===== routes =====

// PUBLIC — сайт бара
app.get("/tables", (req, res) => {
  try {
    const tables = readTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to read tables" });
  }
});

// ADMIN — админка
app.post("/tables", (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const tables = readTables();

    if (!tables[id]) {
      return res.status(404).json({ error: "Table not found" });
    }

    tables[id] = status;
    writeTables(tables);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
});

// ===== start =====
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
