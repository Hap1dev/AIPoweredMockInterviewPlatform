import React, { useState, useRef } from "react";

const AudioRecorder = ({ onStopRecording }) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const RECORDING_LIMIT = 10000; // 10 seconds

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            audioChunksRef.current = [];
            sendAudioToServer(audioBlob);
            clearTimeout(timerRef.current); // Clear the timer
        };

        mediaRecorderRef.current.start();
        setRecording(true);

        // Auto-stop after RECORDING_LIMIT
        timerRef.current = setTimeout(() => {
            console.log("Timer triggered, stopping recording...");
            stopRecording();
        }, RECORDING_LIMIT);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            console.log("Stopping recording...");
            setRecording(false); // Set this first to prevent async issues
            mediaRecorderRef.current.stop();
            clearTimeout(timerRef.current); // Clear timeout when manually stopping
        }
    };

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "user_response.webm");

        try {
            const response = await fetch("http://localhost:3000/upload-audio", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            console.log("Server response:", result);
            onStopRecording(result);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div>
            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? "Stop Recording" : "Start Recording"}
            </button>
        </div>
    );
};

export default AudioRecorder;
