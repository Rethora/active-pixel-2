import { useEffect, useMemo } from 'react';
import { Cron } from 'react-js-cron';
import { Box, Typography, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  getHumanReadableTimeSchedule,
  getNextRunTimeString,
} from '../../shared/util/cron';

import 'react-js-cron/dist/styles.css';

// Add dark theme styles
const darkThemeStyles = `
  .react-js-cron {
    color: #fff;
  }

  div.react-js-cron-select.ant-select {
    background-color: #1e1e1e;
    color: #fff;
  }

  div.react-js-cron-select.ant-select .ant-select-selector {
    background-color: #1e1e1e !important;
    border-color: #404040 !important;
    color: #fff !important;
  }

  .ant-select-dropdown {
    background-color: #1e1e1e !important;
    border: 1px solid #404040 !important;
  }

  .ant-select-item {
    color: #fff !important;
  }

  .ant-select-item-option-content {
    color: #fff !important;
  }

  .ant-select-item-option-selected {
    background-color: #2b2b2b !important;
  }

  .ant-select-item-option-active {
    background-color: #363636 !important;
  }

  .react-js-cron-disabled .react-js-cron-select.ant-select-disabled {
    background-color: #2b2b2b !important;
  }

  div.react-js-cron-error .react-js-cron-select .ant-select-selector {
    border-color: #ff4d4f !important;
    background-color: #291f1f !important;
  }

  .ant-select-selection-placeholder {
    color: #888 !important;
  }

  /* New styles for dropdown arrow and expanded state */
  .ant-select-arrow {
    color: #fff !important;
  }

  .ant-select-selection-item {
    color: #fff !important;
  }

  .ant-select-focused .ant-select-selector {
    border-color: #177ddc !important;
  }

  .ant-select-open .ant-select-selection-placeholder {
    color: #fff !important;
  }

  .ant-select-clear {
    color: #fff !important;
    background-color: #000 !important;
  }
`;

// Add a unique ID to identify our dark theme styles
const DARK_THEME_STYLE_ID = 'cron-dark-theme-styles';

const removeInjectDarkThemeStyles = () => {
  const existingStyle = document.getElementById(DARK_THEME_STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }
};

// Create and inject dark theme styles when using dark mode
const injectDarkThemeStyles = () => {
  // Remove any existing dark theme styles first
  removeInjectDarkThemeStyles();

  const style = document.createElement('style');
  style.id = DARK_THEME_STYLE_ID;
  style.textContent = darkThemeStyles;
  document.head.appendChild(style);
};

type CronSchedulerProps = {
  value: string;
  setValue?: (newValue: string) => void;
  disabled?: boolean;
};

export default function CronScheduler({
  value,
  setValue = () => null,
  disabled = false,
}: CronSchedulerProps) {
  const theme = useTheme();

  const humanReadableTimeSchedule = useMemo(() => {
    return getHumanReadableTimeSchedule(value);
  }, [value]);

  const nextRunTime = useMemo(() => {
    return getNextRunTimeString(value);
  }, [value]);

  useEffect(() => {
    if (theme.palette.mode === 'dark') {
      injectDarkThemeStyles();
    } else {
      removeInjectDarkThemeStyles();
    }
  }, [theme.palette.mode]);

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <AccessTimeIcon sx={{ mr: 1 }} />

        <Cron
          value={value}
          setValue={setValue}
          humanizeLabels
          humanizeValue
          clockFormat="12-hour-clock"
          clearButton={false}
          disabled={disabled}
        />
      </Box>
      <Typography sx={{ mb: 1 }}>
        Schedule: {humanReadableTimeSchedule}
      </Typography>
      <Typography>
        Next notification for this schedule: {nextRunTime}
      </Typography>
    </Box>
  );
}
