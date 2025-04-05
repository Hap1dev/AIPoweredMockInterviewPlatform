import { main } from "./openai.js";

async function getOverallFeedback(results) {
    const interviewSummary = results.map((result, index) => 
        `Q${index + 1}: ${result.question}\nAnswer: ${result.answer}\nCorrectness Score: ${result.correctnessScore}`
    ).join("\n\n");

    const prompt = `Here is a candidate's mock interview session:\n\n${interviewSummary}\n\nProvide an overall assessment of the candidate's performance, including strengths, weaknesses, and areas for improvement. the feedback should look as if you are talking to the candidate, and it should be long as a paragraph`;

    // const chatCompletion = await client.chat.completions.create({
    //     model: "gpt-4o-mini",
    //     messages: [{ role: "user", content: prompt }]
    // });

    const feedback = await main(prompt);


    console.log("Overall Feedback:", feedback);
    return feedback;
}

export default getOverallFeedback;