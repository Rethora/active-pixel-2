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
  const [stableRelease, setStableRelease] = useState<Release>();

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Fetch all releases
        const response = await axios.get<Release[]>(
          'https://api.github.com/repos/Rethora/active-pixel-2/releases',
        );

        const os = platform.os?.family?.toLowerCase() || '';
        const arch = platform.os?.architecture === 64 ? 'x64' : 'arm64';

        // Find latest stable release first to get the version
        const stableRelease = response.data.find(
          (release) => !release.prerelease,
        );
        const version = stableRelease?.tag_name || '';
        setStableRelease(stableRelease);
        // Asset format
        // Base name: Active-Pixel
        // Linux: arm64 -> -${version}-arm64.AppImage | x64 -> -${version}.AppImage
        // Mac: arm64 -> -${version}-arm64.dmg | x64 -> -${version}.dmg
        // Windows: -Setup-${version}.exe
        let assetName = 'Active-Pixel';
        if (os.includes('mac')) {
          assetName += `-${version}`;
          assetName += arch === 'x64' ? '.dmg' : '-arm64.dmg';
        } else if (os.includes('windows')) {
          assetName += `-Setup-${version}`;
          assetName += '.exe';
        } else if (os.includes('linux')) {
          assetName += `-${version}`;
          assetName += arch === 'x64' ? '.AppImage' : '-arm64.AppImage';
        }

        // Find latest stable release
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

  const getCurrentOsAssets = (release: Release) => {
    const os = platform.os?.family?.toLowerCase() || '';
    const validExtensions = os.includes('mac')
      ? ['.dmg']
      : os.includes('windows')
      ? ['.exe']
      : ['.AppImage'];

    return release.assets.filter(
      (asset) =>
        validExtensions.some((ext) => asset.name.endsWith(ext)) &&
        asset.name.startsWith('Active-Pixel'),
    );
  };

  const categorizeAssets = (assets: Release['assets']) => {
    const validExtensions = ['.dmg', '.exe', '.AppImage'];
    const validAssets = assets.filter(
      (asset) =>
        validExtensions.some((ext) => asset.name.endsWith(ext)) &&
        asset.name.startsWith('Active-Pixel') &&
        !asset.name.includes('blockmap'),
    );

    return {
      windows: validAssets.filter((asset) => asset.name.endsWith('.exe')),
      mac: validAssets.filter((asset) => asset.name.endsWith('.dmg')),
      linux: validAssets.filter((asset) => asset.name.endsWith('.AppImage')),
    };
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Download Active Pixel
      </Typography>

      {/* Stable Release Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Latest Release
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : stableDownloadUrl ? (
          <>
            <Button
              variant="contained"
              size="large"
              href={stableDownloadUrl}
              sx={{ mt: 2 }}
            >
              Download for {platform.os?.family}
            </Button>
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ mt: 2, fontStyle: 'italic' }}
            >
              Looking for beta releases? Check the sections below. Note: Beta
              releases may contain bugs and are not recommended for production
              use.
            </Typography>
          </>
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

      {/* Current OS Options Section */}
      {!loading && stableDownloadUrl && (
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              All {platform.os?.family} Downloads
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {[...betaReleases, stableRelease]
                .filter((release): release is Release => release !== undefined)
                .sort((a, b) => {
                  if (a.prerelease && !b.prerelease) return 1;
                  if (!a.prerelease && b.prerelease) return -1;
                  return b.tag_name.localeCompare(a.tag_name);
                })
                .map((release) => {
                  const osAssets = getCurrentOsAssets(release);
                  if (osAssets.length === 0) return null;

                  return (
                    <Box key={release.tag_name}>
                      <Typography variant="subtitle1" gutterBottom>
                        Version {release.tag_name}{' '}
                        {release.prerelease ? '(Beta)' : '(Stable)'}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        {osAssets.map((asset) => (
                          <Button
                            key={asset.name}
                            variant="outlined"
                            size="small"
                            href={asset.browser_download_url}
                            color={release.prerelease ? 'warning' : 'primary'}
                          >
                            {asset.name}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* All Platform Releases Section */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">All Platform Releases</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {[...betaReleases, stableRelease]
              .filter((release): release is Release => release !== undefined)
              .sort((a, b) => {
                if (a.prerelease && !b.prerelease) return 1;
                if (!a.prerelease && b.prerelease) return -1;
                return b.tag_name.localeCompare(a.tag_name);
              })
              .map((release) => {
                const categorizedAssets = categorizeAssets(release.assets);
                if (
                  Object.values(categorizedAssets).every(
                    (arr) => arr.length === 0,
                  )
                )
                  return null;

                return (
                  <Box key={release.tag_name}>
                    <Typography variant="subtitle1" gutterBottom>
                      Version {release.tag_name}{' '}
                      {release.prerelease ? '(Beta)' : '(Stable)'}
                    </Typography>

                    <Stack spacing={2}>
                      {/* Windows Downloads */}
                      {categorizedAssets.windows.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Windows
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            {categorizedAssets.windows.map((asset) => (
                              <Button
                                key={asset.name}
                                variant="outlined"
                                size="small"
                                href={asset.browser_download_url}
                                color={
                                  release.prerelease ? 'warning' : 'primary'
                                }
                              >
                                {asset.name}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* macOS Downloads */}
                      {categorizedAssets.mac.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            macOS
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            {categorizedAssets.mac.map((asset) => (
                              <Button
                                key={asset.name}
                                variant="outlined"
                                size="small"
                                href={asset.browser_download_url}
                                color={
                                  release.prerelease ? 'warning' : 'primary'
                                }
                              >
                                {asset.name}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Linux Downloads */}
                      {categorizedAssets.linux.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Linux
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            {categorizedAssets.linux.map((asset) => (
                              <Button
                                key={asset.name}
                                variant="outlined"
                                size="small"
                                href={asset.browser_download_url}
                                color={
                                  release.prerelease ? 'warning' : 'primary'
                                }
                              >
                                {asset.name}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                );
              })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
