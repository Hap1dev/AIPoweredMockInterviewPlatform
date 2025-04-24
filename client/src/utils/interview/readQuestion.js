export default async function readQuestion(text) {
  try {
    const response = await fetch("http://localhost:3000/api/audio/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("TTS failed");

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve) => {
      audio.onended = () => {
        resolve();
      };
      audio.onerror = (err) => {
        console.error("Audio playback error:", err);
        resolve();
      };
      audio.play();
    });
  } catch (err) {
    console.error("Error reading question:", err.message);
    throw err;
  }
}
