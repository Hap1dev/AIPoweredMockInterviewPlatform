import { useEffect } from "react";

const InterviewPanel = ({ videoRef, questions }) => {
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();
  }, [videoRef]);

  return (
    <div className="flex h-[90vh] m-4 border-4 border-black rounded-2xl overflow-hidden shadow-lg">
      <div className="w-1/2 bg-black flex items-center justify-center border-r border-white">
        <video ref={videoRef} autoPlay muted playsInline className="w-[95%] h-[95%] object-cover rounded-xl" />
      </div>
      <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Interview Questions</h2>
        <ul className="space-y-4">
          {questions.map((q, idx) => (
            <li key={idx} className="p-4 border rounded bg-white shadow">
              <p className="font-semibold">Q{idx + 1}: {q.question}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewPanel;
