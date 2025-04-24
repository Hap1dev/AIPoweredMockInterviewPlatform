import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewSetup from "../components/InterviewSetup";
import InterviewPanel from "../components/InterviewPanel";
import { startInterview } from "../utils/interview/startInterview";
import readQuestion from "../utils/interview/readQuestion";

const Home = () => {
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [responses, setResponses] = useState([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/home", { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) navigate("/login");
      })
      .catch(() => navigate("/home"));
  }, []);

  const handleStartInterview = async () => {
    try {
      // Request camera and mic permission first
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());

      // Proceed with interview fetch
      const response = await fetch(
        "http://localhost:3000/api/start-interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ domain, difficulty }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setInterviewStarted(true);
        setVideoReady(false); // Reset video ready state

        // Check for video element readiness
        const checkVideoReady = () => {
          if (videoRef.current && videoRef.current.readyState > 0) {
            setVideoReady(true);
            startInterviewProcess(data.questions);
          } else {
            setTimeout(checkVideoReady, 100);
          }
        };

        checkVideoReady();
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

const startInterviewProcess = async (questions) => {
  try {
    // Get both results and feedback from startInterview
    const { interviewResults, generatedFeedback } = await startInterview(
      questions,
      videoRef.current,
      (index, response, isListening) => {
        setCurrentQuestionIndex(index);
        setIsMicActive(isListening);
        if (response) {
          setResponses((prev) => {
            const newResponses = [...prev];
            newResponses[index] = response;
            return newResponses;
          });
        }
      }
    );
    
    // Set the feedback state directly
    setFeedback(generatedFeedback);
    if (generatedFeedback) {
      await readQuestion(generatedFeedback);
    }
  } catch (error) {
    console.error("Error during interview:", error);
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
        <InterviewPanel
          videoRef={videoRef}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          responses={responses}
          isMicActive={isMicActive}
          videoReady={videoReady}
          feedback={feedback}
        />
      )}
    </div>
  );
};

export default Home;
