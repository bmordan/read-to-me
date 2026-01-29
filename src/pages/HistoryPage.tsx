import { Box, Typography } from '@mui/material';

function HistoryPage() {
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
        History Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This is where the history content will go.
      </Typography>
    </Box>
  );
}

export default HistoryPage;
