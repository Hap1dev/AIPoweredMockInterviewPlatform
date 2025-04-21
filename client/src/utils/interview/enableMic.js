import { transcribeWithWhisper } from "./openaiFrontend.js";

async function enableMic() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          try {
            const transcription = await transcribeWithWhisper(audioBlob);
            resolve(transcription);
          } catch (err) {
            reject(err);
          }
        };

        console.log("Recording... Speak now (max 10 seconds).");
        mediaRecorder.start();

        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }, 10000); // stop after 10 seconds
      })
      .catch(err => {
        console.error("Mic access denied or error:", err.message);
        reject(err);
      });
  });
}

export default enableMic;
