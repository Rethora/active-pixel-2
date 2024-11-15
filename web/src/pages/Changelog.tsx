import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Changelog() {
  const [changelog, setChangelog] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/Rethora/active-pixel-2/main/CHANGELOG.md',
        );
        setChangelog(response.data);
      } catch (error) {
        console.error('Error fetching changelog:', error);
        setError('Failed to load changelog');
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  const MarkdownComponents = {
    h1: (props: any) => (
      <Typography variant="h3" gutterBottom {...props} sx={{ mt: 4 }} />
    ),
    h2: (props: any) => (
      <Typography variant="h4" gutterBottom {...props} sx={{ mt: 3 }} />
    ),
    h3: (props: any) => (
      <Typography variant="h5" gutterBottom {...props} sx={{ mt: 2 }} />
    ),
    p: (props: any) => <Typography variant="body1" paragraph {...props} />,
    li: (props: any) => (
      <Box component="li" sx={{ mb: 1 }}>
        <Typography variant="body1" {...props} />
      </Box>
    ),
    code: (props: any) => (
      <Chip
        size="small"
        label={props.children}
        sx={{ fontFamily: 'monospace', mx: 0.5 }}
      />
    ),
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Changelog
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ p: 3, mt: 2 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {changelog}
          </ReactMarkdown>
        </Paper>
      )}
    </Box>
  );
}
