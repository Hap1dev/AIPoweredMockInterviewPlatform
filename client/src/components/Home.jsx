import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewSetup from "../components/InterviewSetup";
import InterviewPanel from "../components/InterviewPanel";
import { startInterview } from "../utils/interview/startInterview";

const Home = () => {
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const videoRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:3000/api/home", { withCredentials: true })
      .then(res => {
        if (!res.data.authenticated) navigate("/login");
      })
      .catch(() => navigate("/home"));
  }, []);

const handleStartInterview = async () => {
  try {
    // 🛑 Request camera and mic permission first
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach(track => track.stop()); // stop immediately, just checking permission

    // ✅ Only if permission granted, proceed with interview fetch
    const response = await fetch("http://localhost:3000/api/start-interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ domain, difficulty }),
    });

    if (response.ok) {
      const data = await response.json();
      setQuestions(data.questions); // for InterviewPanel
      setInterviewStarted(true); // show InterviewPanel

      // 👇 Trigger startInterview here
      const results = await startInterview(data.questions);
      console.log("Interview Results:", results);
    } else {
      console.error("Failed to fetch interview questions");
    }

  } catch (error) {
    if (error.name === "NotAllowedError") {
      alert("Mic and Camera access is required to start the interview.");
    } else {
      console.error("Error starting interview:", error);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-200 p-4">
      {!interviewStarted ? (
        <InterviewSetup
          domain={domain}
          difficulty={difficulty}
          setDomain={setDomain}
          setDifficulty={setDifficulty}
          handleStartInterview={handleStartInterview}
        />
      ) : (
        <InterviewPanel videoRef={videoRef} questions={questions} />
      )}
    </div>
  );
};

export default Home;
