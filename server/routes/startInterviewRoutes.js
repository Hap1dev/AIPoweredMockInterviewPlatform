import express from "express";
import { db } from "./../models/db.js";

const router = express.Router();

function randomNumberGenerator(limit) {
  let numbers = [];
  while (numbers.length < 3) {
    let randomNumber = Math.floor(Math.random() * limit);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}

router.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const domain = req.body.domain;
    const difficulty = req.body.difficulty;
    const questions = [];
    try {
      const result = await db.query(
        "SELECT * FROM questions WHERE domain = $1 AND difficulty = $2",
        [domain, difficulty]
      );
      const numOfQuestions = result.rows.length;
      randomNumberGenerator(numOfQuestions).forEach((n) => {
        const { question , sample_answer  } = result.rows[n];
        questions.push({
          question,
          sample_answer,
        });
      });
      res.status(200).json({ questions });
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/login");
  }
});

export default router;
