// client/src/utils/apiRequests.js

export async function getEmbedding(text) {
  const response = await fetch("http://localhost:3000/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data.embedding;
}
