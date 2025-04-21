import { useEffect } from "react";
import { Box, Typography, Paper, List, ListItem, useTheme } from "@mui/material";

const InterviewPanel = ({ videoRef, questions }) => {
  const theme = useTheme();

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

    {/* Questions Panel */}
    <Box
      sx={{
        width: "50%",
        padding: 3,
        overflowY: "auto",
        backgroundColor: theme.palette.mode === "light" ? "#f5f5f7" : "#1d1d1f",
      }}
    >
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
        {questions.map((q, idx) => (
          <ListItem
            key={idx}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: "12px",
              backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#2c2c2e",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
              transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: theme.palette.mode === "light" ? "#1d1d1f" : "#ffffff",
                  mb: 1,
                }}
              >
                Q{idx + 1}: {q.question}
              </Typography>

              {/*
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  color: theme.palette.mode === "light" ? "#86868b" : "#a1a1a6",
                }}
              >
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Sample Answer:
                </Box>{" "}
                {q.sample_answer}
              </Typography>
              */}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);

};

export default InterviewPanel;