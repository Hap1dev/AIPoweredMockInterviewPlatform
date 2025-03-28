import readQuestion from "./readQuestion.js";
import enableMic from "./enableMic.js";
import { main, generateEmbedding } from "./openai.js";
import calculateCosineSimilarity from "./cosineSimilarity.js"

async function startInterview(queries) {
    const results = [];
    for (let i = 0; i < queries.length; i++) {
        const q = queries[i];
        console.log(`Reading question ${i + 1}: ${q.question}`);
        await readQuestion(q.question);
        const userResponse = await enableMic();
        console.log(`User's answer for question ${i + 1}: ${userResponse}`);
        const actualAnswerEmbedded = await generateEmbedding(q.sample_answer);
        const userResponseEmbedded = await generateEmbedding(userResponse);
        const similarityScore = calculateCosineSimilarity(actualAnswerEmbedded, userResponseEmbedded);
        results.push({
            question: q.question,
            answer: userResponse,
            correctnessScore: similarityScore,
        });
    }
    console.log("Interview session completed!");
    console.log("Results:", results);

    return results;
}

export { startInterview };