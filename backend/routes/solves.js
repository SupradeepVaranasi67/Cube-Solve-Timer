import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all solves
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM solves ORDER BY id DESC");
  res.json(rows);
});

// POST new solve
router.post("/", async (req, res) => {
  const { time, cubeType, penalty } = req.body;
  const [result] = await pool.query(
    "INSERT INTO solves (time, cubeType, penalty) VALUES (?, ?, ?)",
    [time, cubeType, penalty || null]
  );
  res.json({ id: result.insertId, time, cubeType, penalty });
});

// PUT update penalty
router.put("/:id", async (req, res) => {
  const { penalty } = req.body;
  await pool.query("UPDATE solves SET penalty = ? WHERE id = ?", [
    penalty,
    req.params.id,
  ]);
  res.json({ success: true });
});

// DELETE solve
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM solves WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

export default router;
