import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import platform from 'platform';

interface Release {
  tag_name: string;
  prerelease: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export default function Download() {
  const [stableDownloadUrl, setStableDownloadUrl] = useState<string>('');
  const [betaReleases, setBetaReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Fetch all releases
        const response = await axios.get<Release[]>(
          'https://api.github.com/repos/Rethora/active-pixel-2/releases',
        );

        const os = platform.os?.family?.toLowerCase() || '';
        const arch = platform.os?.architecture === 64 ? 'x64' : 'arm64';

        let assetName = '';
        if (os.includes('mac')) {
          assetName = `-mac-${arch}.dmg`;
        } else if (os.includes('windows')) {
          assetName = '-win.exe';
        } else if (os.includes('linux')) {
          assetName = `-linux-${arch}.AppImage`;
        }

        // Find latest stable release
        const stableRelease = response.data.find(
          (release) => !release.prerelease,
        );
        if (stableRelease) {
          const stableAsset = stableRelease.assets.find((a) =>
            a.name.includes(assetName),
          );
          if (stableAsset) {
            setStableDownloadUrl(stableAsset.browser_download_url);
          }
        }

        // Filter beta releases
        const betas = response.data.filter((release) => release.prerelease);
        setBetaReleases(betas);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Download Active Pixel
      </Typography>

      {/* Stable Release Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Stable Release
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : stableDownloadUrl ? (
          <Button
            variant="contained"
            size="large"
            href={stableDownloadUrl}
            sx={{ mt: 2 }}
          >
            Download for {platform.os?.family}
          </Button>
        ) : (
          <Box>
            <Typography color="error" gutterBottom>
              No compatible version found for your system
            </Typography>
            <Typography variant="body2">
              You can{' '}
              <Link
                href="https://github.com/Rethora/active-pixel-2?tab=readme-ov-file#building-from-source"
                target="_blank"
                rel="noopener"
              >
                build from source
              </Link>{' '}
              by following the instructions in our README
            </Typography>
          </Box>
        )}
      </Box>

      {/* Beta Releases Section */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Beta Releases</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <CircularProgress />
          ) : betaReleases.length > 0 ? (
            <Stack spacing={2}>
              {betaReleases.map((release) => (
                <Box key={release.tag_name}>
                  <Typography variant="subtitle1" gutterBottom>
                    Version {release.tag_name}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {release.assets.map((asset) => (
                      <Button
                        key={asset.name}
                        variant="outlined"
                        size="small"
                        href={asset.browser_download_url}
                      >
                        {asset.name}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography>No beta releases available</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Warning Message for Beta Releases */}
      <Typography
        variant="body2"
        color="warning.main"
        sx={{ mt: 2, fontStyle: 'italic' }}
      >
        Beta releases may contain bugs and are not recommended for production
        use.
      </Typography>
    </Box>
  );
}
