import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  createTheme,
  ThemeProvider,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Define the custom theme
const theme = createTheme({
  palette: {
    primary: {
      // Use Parchment for the primary color (header background)
      main: '#fdfaf1', // Parchment
    },
    secondary: {
      main: '#1E90FF', // Dodger Blue, a vibrant electric blue accent (retained for now, not a core Garden Room color)
    },
  },
});

const navItems = [
  { label: 'Read to me', path: '/read-to-me' },
  { label: 'Analysis', path: '/analysis' },
  { label: 'History', path: '/history' },
];

function ResponsiveHeader() {
  return (
    <ThemeProvider theme={theme}>
      {/* AppBar will now use the parchment background from the theme */}
      <AppBar position="static">
        <Toolbar>
          {/* Hamburger Menu Button - Shown on extra-small screens */}
          <IconButton
            edge="start"
            color="secondary" // Use accent color for menu icon
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Site Title as a clickable link to the home page */}
          <Typography
            variant="h6"
            component={RouterLink} // Use RouterLink to navigate
            to="/" // Link to the home page
            sx={{
              flexGrow: 1,
              color: '#4d3f2d', // Judge Gray
              cursor: 'pointer', // Indicate it's clickable
              textDecoration: 'none', // Remove underline from link
              '&:hover': {
                color: '#cfb796', // Sorrell Brown on hover for a softer touch
              },
            }}
          >
            Amuse-bouche
          </Typography>

          {/* Navigation Items - Shown on medium screens and up */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink} // Use RouterLink for navigation
                to={item.path}
                sx={{
                  color: '#4d3f2d', // Judge Gray text
                  fontWeight: 'bold',
                  textTransform: 'none', // Prevent uppercase text
                  borderRadius: '0.5rem', // soft-desk
                  boxShadow: '0 4px 6px -1px rgba(77, 63, 45, 0.3), 0 2px 4px -1px rgba(77, 63, 45, 0.1)', // soft-wood shadow
                  '&:hover': {
                    color: '#fdfaf1', // Parchment text on hover
                    backgroundColor: '#4d3f2d', // Judge Gray background on hover
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ResponsiveHeader;
