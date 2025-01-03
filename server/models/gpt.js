import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({path: "./../.env"});


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function main() {
  const chatCompletion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "hello" }]
  });
}