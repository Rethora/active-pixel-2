import { useTheme } from '@mui/material';
import { useMemo } from 'react';

interface SvgIconProps {
  src: string;
  size?: number | string;
}

export default function SvgIcon({
  src,
  size = 24, // default size
}: SvgIconProps) {
  const theme = useTheme();
  const fill = useMemo(
    () => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
    [theme],
  );
  return (
    <div
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: src.replace(/fill="[^"]*"/g, `fill="${fill}"`),
      }}
    />
  );
}
