// backend/routes/audio.js or a new routes/feedback.js
import express from "express";
import { main } from "../models/openaiBackend.js";

const router = express.Router();

router.post("/overall-feedback", async (req, res) => {
  try {
    const { results } = req.body;

    const interviewSummary = results.map((result, index) =>
      `Q${index + 1}: ${result.question}\nAnswer: ${result.answer}\nCorrectness Score: ${result.correctnessScore}`
    ).join("\n\n");

    const prompt = `Here is a candidate's mock interview session:\n\n${interviewSummary}\n\nProvide an overall assessment of the candidate's performance, including strengths, weaknesses, and areas for improvement. the feedback should look as if you are talking to the candidate, and it should be long as a paragraph`;

    const feedback = await main(prompt);
    res.status(200).json({ feedback });

  } catch (err) {
    console.error("Error generating feedback:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

export default router;
