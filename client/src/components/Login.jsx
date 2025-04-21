import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(
        "http://localhost:3000/api/login",
        { username: email, password },
        { withCredentials: true }
      );
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center",
        fontFamily: '"SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif'
      }}
    >
      <Box sx={{ 
        width: "100%",
        padding: "40px",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
        border: "1px solid rgba(0, 0, 0, 0.08)"
      }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight={500} 
          mb={4}
          sx={{
            fontSize: "32px",
            letterSpacing: "-0.5px",
            color: "#1d1d1f"
          }}
        >
          Sign in
        </Typography>
        {error && (
          <Typography 
            variant="body2" 
            color="error" 
            textAlign="center" 
            mb={2}
            sx={{
              color: "#ff3b30",
              fontWeight: 500
            }}
          >
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#d2d2d7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#86868b",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#86868b",
                  fontSize: "14px"
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#d2d2d7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#86868b",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#86868b",
                  fontSize: "14px"
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                bgcolor: "#0071e3",
                color: "#fff",
                fontSize: "17px",
                fontWeight: 400,
                height: "44px",
                borderRadius: "8px",
                ":hover": { 
                  bgcolor: "#0077ed",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)"
                },
                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
              }}
            >
              Sign In
            </Button>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              my: 2,
              "&::before, &::after": {
                content: '""',
                flex: 1,
                borderBottom: "1px solid #d2d2d7"
              }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  px: 2, 
                  color: "#86868b",
                  fontSize: "12px"
                }}
              >
                or
              </Typography>
            </Box>
            <Button
              onClick={handleGoogleLogin}
              variant="outlined"
              fullWidth
              sx={{ 
                textTransform: "none", 
                borderColor: "#d2d2d7", 
                color: "#1d1d1f",
                fontSize: "17px",
                fontWeight: 400,
                height: "44px",
                borderRadius: "8px",
                ":hover": { 
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  borderColor: "#86868b"
                },
                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
              }}
            >
              Sign in with Google
            </Button>
            <Typography 
              variant="body2" 
              textAlign="center" 
              mt={3}
              sx={{
                color: "#86868b",
                fontSize: "14px"
              }}
            >
              Don't have an account?
            </Typography>
            <Button
              onClick={() => navigate("/register")}
              fullWidth
              sx={{
                textTransform: "none",
                color: "#0071e3",
                fontSize: "17px",
                fontWeight: 400,
                height: "44px",
                borderRadius: "8px",
                ":hover": { 
                  backgroundColor: "rgba(0, 113, 227, 0.04)",
                },
                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
              }}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;