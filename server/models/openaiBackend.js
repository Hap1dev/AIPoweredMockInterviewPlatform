// server/models/openaiBackend.js

import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float"
  });
  return embedding.data[0].embedding;
}

export async function transcribeWithWhisper(filePath) {
  const transcription = await client.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream(filePath),
  });
  return transcription.text;
}

export async function main(prompt) {
  const chatCompletion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return chatCompletion.choices[0].message.content;
}
