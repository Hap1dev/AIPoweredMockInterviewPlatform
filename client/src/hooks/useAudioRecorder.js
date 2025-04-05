import { useState, useRef } from "react";
import RecordRTC from "recordrtc";

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const recorderRef = useRef(null);

    // Start Recording
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorderRef.current = new RecordRTC(stream, { type: "audio" });
        recorderRef.current.startRecording();
        setIsRecording(true);
    };

    // Stop Recording
    const stopRecording = async () => {
        return new Promise((resolve) => {
            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                setAudioBlob(blob);
                setIsRecording(false);
                resolve(blob);
            });
        });
    };

    return { isRecording, startRecording, stopRecording, audioBlob };
};

export default useAudioRecorder;
