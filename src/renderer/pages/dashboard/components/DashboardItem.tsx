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
  errorMessage?: string;
};

export default function DashboardItem({
  loading = false,
  cardTitle,
  cardSubheader,
  cardContent,
  speedDialActions,
  size = 'md',
  error = false,
  errorMessage = 'An Error Occurred While Loading This Content...',
}: DashboardItemProps) {
  // Define fixed widths instead of minimum widths
  const width = (() => {
    if (size === 'sm') return 300;
    if (size === 'lg') return 800;
    return 600;
  })();

  const height = (() => {
    if (size === 'sm') return 270;
    if (size === 'lg') return 600;
    return 500;
  })();

  return (
    <Card
      sx={{
        m: 2,
        position: 'relative',
        width, // Use fixed width
        height, // Use fixed height
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent content overflow
      }}
    >
      <CardHeader
        sx={{
          width: '100%', // Use full width
          flex: '0 0 auto',
          overflow: 'hidden',
          verticalAlign: 'text-top',
          boxSizing: 'border-box', // Changed from unset
          '& .MuiCardHeader-content': {
            overflow: 'hidden', // Prevent title/subtitle overflow
          },
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
            'Error!'
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
      <CardContent
        sx={{
          height: 'calc(100% - 72px)', // Subtract CardHeader height (default is 72px)
          overflow: 'auto', // Allow scrolling if content is too large
          flex: '1 1 auto',
          padding: 2,
        }}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <Skeleton animation="wave" height="100%" />
        ) : error ? (
          errorMessage
        ) : (
          cardContent
        )}
      </CardContent>
    </Card>
  );
}
