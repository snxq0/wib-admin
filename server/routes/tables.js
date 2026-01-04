import express from "express";
import { getTables, setTableState } from "../services/tableService.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getTables());
});

router.post("/", adminAuth, (req, res) => {
  const { id, status } = req.body;
  setTableState(id, status);
  res.json({ ok: true });
});

export default router;
