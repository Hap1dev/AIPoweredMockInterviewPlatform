import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  useTheme,
} from "@mui/material";

const Typewriter = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingEffect);
        setShowCursor(false); // Hide cursor when done
      }
    }, speed);

    return () => clearInterval(typingEffect);
  }, [text, speed]);

  return (
    <>
      {displayedText}
      {showCursor && <span style={{ borderLeft: '2px solid', animation: 'blink 1s step-end infinite' }}></span>}
    </>
  );
};

const InterviewPanel = ({
  videoRef,
  questions,
  currentQuestionIndex,
  responses = [],
  isMicActive = false,
  feedback,
}) => {
  const theme = useTheme();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();
  }, [videoRef]);

  // Check if the video is ready for capturing expressions
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => {
        console.log("Video is ready for facial expression capture");
      };
    }
  }, [videoRef]);

return (
  <Box
    sx={{
      display: "flex",
      height: "90vh",
      margin: 2,
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      border: "1px solid rgba(0, 0, 0, 0.08)",
    }}
  >
    {/* Video Panel */}
    <Box
      sx={{
        width: "50%",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        sx={{
          width: "95%",
          height: "95%",
          objectFit: "cover",
          borderRadius: "12px",
          backgroundColor: "#1d1d1f",
        }}
      />
    </Box>

    {/* Questions Panel with Feedback Section */}
    <Box
      sx={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "light" ? "#f5f5f7" : "#1d1d1f",
      }}
    >
      {/* Scrollable Questions List */}
      <Box sx={{ padding: 3, overflowY: "auto", flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: "20px",
            letterSpacing: "-0.01em",
            color: theme.palette.mode === "light" ? "#1d1d1f" : "#f5f5f7",
            mb: 2,
          }}
        >
          Interview Questions
        </Typography>

        <List sx={{ py: 0 }}>
          {(questions || [])
            .slice(0, currentQuestionIndex + 1)
            .map((q, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor:
                    theme.palette.mode === "light" ? "#ffffff" : "#2c2c2e",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  },
                  transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color:
                        theme.palette.mode === "light" ? "#1d1d1f" : "#ffffff",
                      mb: responses && responses[index] ? 1 : 0,
                    }}
                  >
                    {`Q${index + 1}: ${q.question}`}
                  </Typography>
                  {responses && responses[index] ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.mode === "light" ? "#444" : "#aaa",
                        fontStyle: "italic",
                        pl: 2,
                        borderLeft: `2px solid ${
                          theme.palette.mode === "light" ? "#ddd" : "#444"
                        }`,
                        mt: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 500,
                          color:
                            theme.palette.mode === "light" ? "#333" : "#eee",
                        }}
                      >
                        Your response:
                      </Box>
                      {" " + responses[index]}
                    </Typography>
                  ) : index === currentQuestionIndex && isMicActive ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.success.main,
                        fontStyle: "italic",
                        pl: 2,
                        borderLeft: `2px solid ${theme.palette.success.light}`,
                        mt: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.success.dark,
                        }}
                      >
                        Listening...
                      </Box>
                      {" (Please answer now)"}
                    </Typography>
                  ) : null}
                </Box>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Feedback Section */}
      {feedback && (
  <Box
    sx={{
      p: 3,
      borderTop: "1px solid",
      borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#333",
      backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#2c2c2e",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: theme.palette.mode === "light" ? "#1d1d1f" : "#ffffff",
        mb: 1.5,
      }}
    >
      Your Interview Feedback
    </Typography>
    <Typography
      variant="body1"
      sx={{
        whiteSpace: "pre-line",
        color: theme.palette.mode === "light" ? "#333" : "#eee",
        lineHeight: 1.6,
        minHeight: '100px' // Ensure consistent height during typing
      }}
    >
      <Typewriter text={feedback} speed={20} />
    </Typography>
  </Box>
)}
    </Box>
  </Box>
);
};

export default InterviewPanel;
