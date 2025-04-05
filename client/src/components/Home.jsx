import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewSetup from "../components/InterviewSetup";
import InterviewPanel from "../components/InterviewPanel";

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
      const res = await axios.post("http://localhost:3000/api/start-interview", { domain, difficulty }, { withCredentials: true });
      setQuestions(res.data.questions);
      setInterviewStarted(true);
    } catch (err) {
      console.error(err);
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
