import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
dotenv.config({ path: "./../../.env" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function main(prompt) {
  const chatCompletion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });
  return chatCompletion.choices[0].message.content;
}

export async function generateEmbedding(text){
    const embedding = await client.embeddings.create({
        model : "text-embedding-3-small",
        input : text,
        encoding_format : "float"
    });
    return embedding.data[0].embedding
}

export async function transcribeWithWhisper(audioFilePath) {
    const apiKey = process.env.OPENAI_API_KEY;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioFilePath));
    formData.append("model", "whisper-1");

    try {
        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
        });

        return response.data.text;
    } catch (err) {
        console.error("Error from Whisper API:", err.response?.data || err.message);
        throw err;
    }
}




