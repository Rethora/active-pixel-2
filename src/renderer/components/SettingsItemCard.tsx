import { Box, Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

type SettingsItemCardProps = {
  title: string;
  description: string;
  value: string;
  icon: ReactNode;
};

export default function SettingsItemCard({
  title,
  description,
  value,
  icon,
}: SettingsItemCardProps) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box mr={2}>{icon}</Box>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body1">{description}</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1">{value}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
