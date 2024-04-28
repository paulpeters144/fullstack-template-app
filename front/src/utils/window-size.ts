import { useLayoutEffect, useState } from 'react';

export enum ScreenSize {
  Mobile = 0,
  Tablet = 1,
  Desktop = 2,
}

export interface IWindowSize {
  width: number;
  height: number;
  size: ScreenSize;
}

export const useWindowSize = () => {
  const [size, setSize] = useState<IWindowSize>();
  useLayoutEffect(() => {
    function updateSize() {
      const nextSize: IWindowSize = {
        width: window.innerWidth,
        height: window.innerWidth,
        size: 0,
      };

      if (nextSize.width < 600) {
        nextSize.size = ScreenSize.Mobile;
      } else if (nextSize.width >= 600 && nextSize.width < 960) {
        nextSize.size = ScreenSize.Tablet;
      } else {
        nextSize.size = ScreenSize.Desktop;
      }
      setSize(nextSize);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return {
    windowSize: size,
    isMobile: size?.size == ScreenSize.Mobile,
    isTablet: size?.size == ScreenSize.Tablet,
    isDeskTop: size?.size == ScreenSize.Desktop,
  };
};
