// server/routes/openaiRoutes.js

import express from "express";
import { generateEmbedding } from "../models/openaiBackend.js";

const router = express.Router();

router.post("/embed", async (req, res) => {
  try {
    const { text } = req.body;
    const embedding = await generateEmbedding(text);
    res.json({ embedding });
  } catch (err) {
    res.status(500).json({ error: "Embedding failed" });
  }
});

export default router;
