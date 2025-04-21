export async function transcribeWithWhisper(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "speech.webm");

  const response = await fetch("http://localhost:3000/api/audio/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Transcription failed:", errText);
    throw new Error("Transcription failed");
  }

  const data = await response.json();
  return data.text;
}
