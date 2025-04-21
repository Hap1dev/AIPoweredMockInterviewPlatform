async function getOverallFeedback(results) {
  try {
    const response = await fetch("http://localhost:3000/api/audio/overall-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results }),
    });

    if (!response.ok) throw new Error("Failed to generate feedback");

    const data = await response.json();
    console.log("Overall Feedback:", data.feedback);
    return data.feedback;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
}

export default getOverallFeedback;
