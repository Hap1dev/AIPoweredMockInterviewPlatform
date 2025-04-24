// backend/routes/audio.js or a new routes/feedback.js
import express from "express";
import { main } from "../models/openaiBackend.js";

const router = express.Router();

router.post("/overall-feedback", async (req, res) => {
  try {
    const { results } = req.body;

    const interviewSummary = results.map((result, index) => {
  const {
    question,
    answer,
    correctnessScore,
    facialExpressionData
  } = result;

  const {
    happiness,
    sadness,
    anger,
    surprise,
    facialExpressionScore
  } = facialExpressionData || {};

  return (
    `Q${index + 1}: ${question}\n` +
    `Answer: ${answer}\n` +
    `Correctness Score: ${correctnessScore.toFixed(2)}\n` +
    `Facial Expression Analysis:\n` +
    ` - Happiness: ${happiness?.toFixed(2)}\n` +
    ` - Sadness: ${sadness?.toFixed(2)}\n` +
    ` - Anger: ${anger?.toFixed(2)}\n` +
    ` - Surprise: ${surprise?.toFixed(2)}\n` +
    ` - Facial Expression Score (happiness - sadness - anger): ${facialExpressionScore?.toFixed(2)}`
  );
}).join("\n\n");

    const prompt = `
Here is a candidate's mock interview session. For each question, you'll find the candidate's answer, a correctness score (semantic similarity between expected and given answers), and facial expression metrics captured during the response.

🧠 Correctness Score ranges from 0 to 1 — higher means better answer relevance.

😐 Facial expression values (happiness, sadness, anger, surprise) also range from 0 to 1 — higher means stronger expression. The facialExpressionScore is calculated as: (happiness - sadness - anger). A higher score generally means a more positive emotional tone.

Use these data points to provide an overall **spoken-style feedback** for the candidate. Your feedback should:
- Address their knowledge and accuracy.
- Reflect on their emotional composure or confidence based on expressions.
- Mention strengths, weaknesses, and improvement areas.
- Feel like it’s spoken directly to the candidate.
- Be around a paragraph in length.

Mock Interview Summary:

${interviewSummary}
`;

    const feedback = await main(prompt);
    res.status(200).json({ feedback });

  } catch (err) {
    console.error("Error generating feedback:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

export default router;
