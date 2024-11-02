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
  // Define minimum widths instead of fixed widths
  const minWidth = (() => {
    if (size === 'sm') return 300;
    if (size === 'lg') return 800;
    return 400;
  })();

  const height = (() => {
    if (size === 'sm') return 100;
    if (size === 'lg') return 600;
    return 400;
  })();

  return (
    <Card
      sx={{
        m: 2,
        position: 'relative',
        minWidth, // Use minWidth instead of fixed width
        width: 'fit-content', // Allow the card to grow if needed
        flexGrow: size === 'lg' ? 1 : 0, // Allow large cards to grow
        flexShrink: 0, // Prevent shrinking below minWidth
      }}
    >
      <CardHeader
        sx={{
          maxWidth: minWidth - 50,
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
      <CardContent sx={{ height }}>
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
