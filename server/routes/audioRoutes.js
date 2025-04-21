import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { transcribeWithWhisper } from "../models/openaiBackend.js";
import OpenAI from "openai";

const router = express.Router();

// ✅ Use diskStorage to preserve original file extension (like .webm)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Keeps .webm etc.
  }
});
const upload = multer({ storage });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;
    const transcription = await transcribeWithWhisper(audioPath);

    // Optionally delete audio file after transcription
    fs.unlink(audioPath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });

    res.status(200).json({ text: transcription });
  } catch (error) {
    console.error("Transcription failed:", error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

router.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: text,
    });

    const buffer = await mp3.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

export default router;
