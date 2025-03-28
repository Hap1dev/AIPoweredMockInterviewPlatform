import { exec } from "child_process";
import fs from "fs";
import { transcribeWithWhisper } from "./openai.js";

const FFmpegRecordCommand = 'ffmpeg -f avfoundation -i ":0" -t 10 -ar 16000 ./models/user_response.wav';

async function enableMic() {
    console.log("Microphone enabled. Speak your answer (max 10 seconds)...");

    return new Promise((resolve, reject) => {
        exec(FFmpegRecordCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during audio recording:", error.message);
                return reject(error);
            }
            console.log("Recording complete. Processing transcription...");
            const audioFilePath = './models/user_response.wav';
            transcribeWithWhisper(audioFilePath)
                .then(transcription => {
                    fs.unlinkSync(audioFilePath);
                    resolve(transcription);
                })
                .catch(err => {
                    console.error("Error during transcription:", err.message);
                    reject(err);
                });
        });
    });
}

export default enableMic;
