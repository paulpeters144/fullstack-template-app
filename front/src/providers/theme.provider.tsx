import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@theme/Colors';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
  color: lightColors,
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setTheme] = useState(colorScheme);

  const toggleTheme = () => {
    setTheme(themeMode === 'light' ? 'dark' : 'light');
  };

  const themeColors = themeMode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider
      value={{ mode: themeMode, toggleTheme, color: themeColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
