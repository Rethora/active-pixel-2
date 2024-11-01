import { ReactNode } from 'react';
import {
  CardHeader,
  SpeedDial,
  SpeedDialAction,
  CardContent,
  Card,
  Skeleton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type DashboardItemProps = {
  loading?: boolean;
  cardTitle?: string;
  cardSubheader?: string;
  cardContent?: ReactNode;
  speedDialActions?: { name: string; icon: ReactNode; onClick: () => void }[];
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
};

export default function DashboardItem({
  loading = false,
  cardTitle,
  cardSubheader,
  cardContent,
  speedDialActions,
  size = 'md',
  error = false,
}: DashboardItemProps) {
  // eslint-disable-next-line no-nested-ternary
  const width = size === 'sm' ? 300 : size === 'lg' ? 1000 : 500;
  // eslint-disable-next-line no-nested-ternary
  const height = size === 'sm' ? 100 : size === 'lg' ? 600 : 400;

  return (
    <Card
      sx={{
        m: 2,
        position: 'relative',
      }}
    >
      <CardHeader
        sx={{
          maxWidth: width - 50,
        }}
        action={
          // eslint-disable-next-line no-nested-ternary
          loading ? null : speedDialActions ? (
            <SpeedDial
              ariaLabel="settings"
              icon={<MoreVertIcon />}
              direction="down"
              sx={{
                position: 'absolute',
                top: 20,
                right: 5,
                '& .MuiSpeedDial-fab': {
                  width: 36,
                  height: 36,
                },
              }}
            >
              {speedDialActions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  onClick={action.onClick}
                  tooltipTitle={action.name}
                />
              ))}
            </SpeedDial>
          ) : null
        }
        title={
          // eslint-disable-next-line no-nested-ternary
          loading ? (
            <Skeleton animation="wave" height="50%" width="80%" />
          ) : error ? (
            'An error occurred while loading this content'
          ) : (
            cardTitle
          )
        }
        subheader={
          // eslint-disable-next-line no-nested-ternary
          loading ? (
            <Skeleton animation="wave" height="50%" width="40%" />
          ) : error ? null : (
            cardSubheader
          )
        }
      />
      <CardContent sx={{ width, height }}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <Skeleton animation="wave" height="100%" />
        ) : error ? null : (
          cardContent
        )}
      </CardContent>
    </Card>
  );
}
