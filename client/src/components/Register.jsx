import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Divider,
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        navigate(data.redirect);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: { xs: 3, sm: 4 },
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: "32px",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: "#1D1D1F",
            textAlign: "center",
            mb: 3,
          }}
        >
          Create Account
        </Typography>

        {error && (
          <Typography
            variant="body2"
            sx={{
              color: "#FF3B30",
              backgroundColor: "rgba(255, 59, 48, 0.1)",
              padding: "8px 12px",
              borderRadius: "4px",
              textAlign: "center",
              mb: 2,
              fontSize: "14px",
            }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2}>
              <TextField
                name="firstname"
                label="First name"
                variant="outlined"
                fullWidth
                value={formData.firstname}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#D2D2D7",
                    },
                    "&:hover fieldset": {
                      borderColor: "#86868B",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#86868B",
                    fontSize: "14px",
                  },
                }}
              />
              <TextField
                name="lastname"
                label="Last name"
                variant="outlined"
                fullWidth
                value={formData.lastname}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#D2D2D7",
                    },
                    "&:hover fieldset": {
                      borderColor: "#86868B",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#86868B",
                    fontSize: "14px",
                  },
                }}
              />
            </Stack>

            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#D2D2D7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#86868B",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#86868B",
                  fontSize: "14px",
                },
              }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#D2D2D7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#86868B",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#86868B",
                  fontSize: "14px",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "#0071E3",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: "-0.01em",
                "&:hover": {
                  backgroundColor: "#0077ED",
                  boxShadow: "0 1px 5px rgba(0, 113, 227, 0.3)",
                },
                transition: "all 0.2s ease",
                mt: 1,
              }}
            >
              Continue
            </Button>

            <Divider
              sx={{
                my: 2,
                color: "#86868B",
                fontSize: "12px",
                "&::before, &::after": {
                  borderColor: "#E0E0E0",
                },
              }}
            >
              Already have an account?
            </Divider>

            <Button
              onClick={() => navigate("/login")}
              variant="text"
              fullWidth
              sx={{
                height: "44px",
                borderRadius: "8px",
                color: "#0071E3",
                fontSize: "16px",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: "-0.01em",
                "&:hover": {
                  backgroundColor: "rgba(0, 113, 227, 0.05)",
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;