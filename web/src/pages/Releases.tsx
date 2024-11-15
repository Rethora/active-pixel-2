import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Release {
  tag_name: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export default function Releases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await axios.get<Release[]>(
          'https://api.github.com/repos/Rethora/active-pixel-2/releases',
        );
        setReleases(response.data);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Release History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : releases.length === 0 ? (
        <Typography variant="body1">No releases found.</Typography>
      ) : (
        releases.map((release) => (
          <Card key={release.tag_name} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Version {release.tag_name}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {release.body}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {release.assets.map((asset) => (
                  <Button
                    key={asset.name}
                    variant="outlined"
                    href={asset.browser_download_url}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    {asset.name}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
