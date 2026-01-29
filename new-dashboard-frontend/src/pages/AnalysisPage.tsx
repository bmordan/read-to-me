import { Box, Typography } from '@mui/material';
import { useTranscript } from '../context/TranscriptContext';

function AnalysisPage() {
  const { transcript } = useTranscript();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        gap: 3,
        px: 4,
      }}
    >
      <Typography variant="h4" component="h1">
        Feedback
      </Typography>
      {transcript ? (
        <Typography
          variant="body1"
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxWidth: '80%',
            textAlign: 'left',
          }}
        >
          {transcript}
        </Typography>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No feedback at the moment. Please read to me first.
        </Typography>
      )}
    </Box>
  );
}

export default AnalysisPage;
