import React from 'react';
import { Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ComputerIcon from '@mui/icons-material/Computer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Home() {
  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Active Pixel
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Stay active and healthy while working on your computer
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ maxWidth: 800, mx: 'auto' }}
        >
          Active Pixel helps you maintain a healthy work routine by providing
          timely notifications for exercises, stretches, and breaks throughout
          your day.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/download"
          sx={{ mt: 2 }}
        >
          Download Now
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <ComputerIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Smart Detection
            </Typography>
            <Typography>
              Automatically detects periods of inactivity and reminds you to
              take breaks when you've been working too long.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <FitnessCenterIcon
              sx={{ fontSize: 40, mb: 2, color: 'primary.main' }}
            />
            <Typography variant="h6" gutterBottom>
              Exercise Suggestions
            </Typography>
            <Typography>
              Get personalized recommendations for stretches and exercises that
              you can do right at your desk.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <NotificationsActiveIcon
              sx={{ fontSize: 40, mb: 2, color: 'primary.main' }}
            />
            <Typography variant="h6" gutterBottom>
              Customizable Reminders
            </Typography>
            <Typography>
              Set up your own schedule for notifications and customize the types
              of activities you want to be reminded about.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 16, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Why Active Pixel?
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Working remotely can make it easy to lose track of time and develop
          unhealthy work habits. Active Pixel was created to help remote
          workers, gamers, and anyone who spends long hours at their computer
          maintain better physical health through gentle reminders and activity
          suggestions.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                For Remote Workers
              </Typography>
              <Typography>
                Stay mindful of screen time and maintain healthy work habits
                while enjoying the flexibility of working from home.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                For Gamers
              </Typography>
              <Typography>
                Keep gaming sessions enjoyable and healthy with timely breaks
                and stretching reminders.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                For Everyone
              </Typography>
              <Typography>
                Active Pixel is designed to be a gentle reminder to take breaks
                and stay active throughout the day.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 12 }}>
        <Typography variant="h4" gutterBottom>
          Ready to improve your work-life balance?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/download"
          sx={{ mt: 2 }}
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
}
