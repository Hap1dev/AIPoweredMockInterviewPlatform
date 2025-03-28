import googleTTS from 'google-tts-api';
import player from 'play-sound';

const audioPlayer = player();

async function readQuestion(text) {
    try {
        const url = googleTTS.getAudioUrl(text, {
            lang: 'en-US',
            slow: false,
        });
        const filePath = await downloadAudio(url);
        await playAudio(filePath);
    } catch (error) {
        console.error("Error reading question:", error);
        throw error;
    }
}


function playAudio(filePath) {
    return new Promise((resolve, reject) => {
        audioPlayer.play(filePath, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}
import fs from 'fs';
import axios from 'axios';

async function downloadAudio(url) {
    const filePath = './models/question-audio.mp3'; // Temporary audio file
    const response = await axios.get(url, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}

export default readQuestion;
