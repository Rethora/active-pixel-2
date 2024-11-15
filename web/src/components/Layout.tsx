import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/256x256.png`}
              alt="Active Pixel Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <Typography variant="h6" component="div">
              Active Pixel
            </Typography>
          </Link>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/download">
            Download
          </Button>
          <Button color="inherit" component={RouterLink} to="/releases">
            Releases
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="https://github.com/Rethora/active-pixel-2"
            target="_blank"
          >
            GitHub
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}
