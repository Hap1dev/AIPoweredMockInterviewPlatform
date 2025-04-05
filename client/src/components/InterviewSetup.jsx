// src/components/InterviewSetup.jsx
const InterviewSetup = ({ domain, difficulty, setDomain, setDifficulty, handleStartInterview }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-2xl font-semibold mb-4">Start Interview</h2>
    <div className="space-y-4">
      <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-64 p-2 border rounded">
        <option value="">Select Domain</option>
        <option value="Software Development">Software Development</option>
        <option value="Data Science and Machine Learning">Data Science and Machine Learning</option>
      </select>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-64 p-2 border rounded">
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button onClick={handleStartInterview} className="w-64 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Start Interview
      </button>
    </div>
  </div>
);

export default InterviewSetup;
