import readQuestion from "./readQuestion.js";
import enableMic from "./enableMic.js";
import calculateCosineSimilarity from "./cosineSimilarity.js";
import getOverallFeedback from "./getOverallFeedback.js";
import { getEmbedding } from "../apiRequest.js";
import { captureFacialExpression } from "./faceExpression.js";
import * as faceapi from "face-api.js";

let modelsLoaded = false;

async function loadFaceApiModels() {
  if (!modelsLoaded) {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Added this line
    ]);
    modelsLoaded = true;
    console.log("✅ face-api models loaded");
  }
}

async function startInterview(queries, videoElement, setCurrentQuestion) {
  const results = [];

  if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
    console.error("Invalid video element passed to captureFacialExpression.");
    return;
  }

  console.log("Video element passed:", videoElement);

  // Load face-api models once before the interview begins
  await loadFaceApiModels();

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    console.log(`📣 Reading question ${i + 1}: ${q.question}`);

    // Update currentQuestion state to display the question
    setCurrentQuestion(i, null, false); // Reset previous response and mic state

    await readQuestion(q.question);

    let userResponse = "";
    let facialExpressionData = null;

    try {
      // Notify UI that we're listening for response
      setCurrentQuestion(i, null, true);

      // Get both user response and facial expression in parallel
      const [response, expression] = await Promise.all([
        enableMic().then((res) => {
          console.log(`🎤 User's answer for question ${i + 1}: ${res}`);
          return res;
        }),
        captureFacialExpression(videoElement, 10000).then((expr) => {
          console.log(`😐 Facial Expression for question ${i + 1}:`, expr);
          return expr;
        }),
      ]);

      userResponse = response;
      facialExpressionData = expression;

      // Update with final response and turn off mic state
      setCurrentQuestion(i, userResponse, false);
    } catch (err) {
      console.error("⚠️ Error during response capture:", err.message);
      // Ensure mic state is turned off on error
      setCurrentQuestion(i, null, false);
    }

    // Calculate similarity score if we got a response
    if (userResponse) {
      const actualAnswerEmbedded = await getEmbedding(q.sample_answer);
      const userResponseEmbedded = await getEmbedding(userResponse);
      const similarityScore = calculateCosineSimilarity(
        actualAnswerEmbedded,
        userResponseEmbedded
      );

      results.push({
        question: q.question,
        answer: userResponse,
        correctnessScore: similarityScore,
        facialExpressionData,
      });
    } else {
      results.push({
        question: q.question,
        answer: "No response recorded",
        correctnessScore: 0,
        facialExpressionData,
      });
    }
  }

  console.log("✅ Interview session completed!");
  console.log("📊 Results:", results);

  // Get overall feedback and read it out
  const feedback = await getOverallFeedback(results);
  return { 
  interviewResults: results,
  generatedFeedback: feedback 
};
}

export { startInterview };
