import readQuestion from "./readQuestion.js";
import enableMic from "./enableMic.js";
import calculateCosineSimilarity from "./cosineSimilarity.js";
import getOverallFeedback from "./getOverallFeedback.js";
import { getEmbedding } from "../apiRequest.js";

async function startInterview(queries) {
    const results = [];

    for (let i = 0; i < queries.length; i++) {
        const q = queries[i];
        console.log(`Reading question ${i + 1}: ${q.question}`);
        
        await readQuestion(q.question);

        const userResponse = await enableMic();
        console.log(`User's answer for question ${i + 1}: ${userResponse}`);

        const actualAnswerEmbedded = await getEmbedding(q.sample_answer);
        const userResponseEmbedded = await getEmbedding(userResponse);

        const similarityScore = calculateCosineSimilarity(actualAnswerEmbedded, userResponseEmbedded);

        results.push({
            question: q.question,
            answer: userResponse,
            correctnessScore: similarityScore,
        });
    }

    console.log("Interview session completed!");
    console.log("Results:", results);

    const feedback = await getOverallFeedback(results);
    await readQuestion(feedback);

    return results;
}

export { startInterview };
