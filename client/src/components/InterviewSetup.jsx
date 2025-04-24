import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const InterviewSetup = ({ domain, difficulty, setDomain, setDifficulty, handleStartInterview }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f7',
        padding: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          fontSize: '32px',
          letterSpacing: '-0.01em',
          color: '#1d1d1f',
          mb: 4,
        }}
      >
        Start Interview
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 320 }}>
        <FormControl fullWidth>
          <InputLabel id="domain-label" sx={{ color: '#86868b' }}>
            Select Domain
          </InputLabel>
          <Select
            labelId="domain-label"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            sx={{
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d2d2d7',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#86868b',
              },
            }}
          >
            <MenuItem value="">
              <em>Select Domain</em>
            </MenuItem>
            <MenuItem value="Software Development">Software Development</MenuItem>
            <MenuItem value="Data Science and Machine Learning">Data Science and Machine Learning</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="difficulty-label" sx={{ color: '#86868b' }}>
            Select Difficulty
          </InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            sx={{
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d2d2d7',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#86868b',
              },
            }}
          >
            <MenuItem value="">
              <em>Select Difficulty</em>
            </MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleStartInterview}
          disabled={!domain || !difficulty}
          sx={{
            backgroundColor: '#0071E3',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '12px',
            padding: '12px 24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#0077ED',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.15)',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#a1a1a6',
            },
          }}
        >
          Start Interview
        </Button>
      </Box>
    </Box>
  );
};

export default InterviewSetup;