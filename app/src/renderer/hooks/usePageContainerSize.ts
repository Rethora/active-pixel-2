import { useEffect, useRef, useState } from 'react';

export default () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const mainRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const [main] = document.getElementsByClassName('MuiContainer-root');
    mainRef.current = main as HTMLElement;
    const updateSize = () => {
      setWidth(mainRef.current?.clientWidth || 0);
      setHeight(mainRef.current?.clientHeight || 0);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { width, height };
};
