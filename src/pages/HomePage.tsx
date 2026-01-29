import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import {
  Create,
  RecordVoiceOver,
  ChromeReaderMode
} from '@mui/icons-material';
import gardenRoomImage from '../assets/garden-room.png';

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="How this works" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Create />
                  </ListItemIcon>
                  <ListItemText primary="Write your chapter or section." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RecordVoiceOver />
                  </ListItemIcon>
                  <ListItemText primary="Read what you have written in to the 'Read to me' section." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ChromeReaderMode />
                  </ListItemIcon>
                  <ListItemText primary="Navigate to the analysis page for feedback and insights." />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <Box
              component="img"
              src={gardenRoomImage}
              alt="Garden room"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;