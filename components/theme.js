// theme-context.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Load theme preference from AsyncStorage on app load
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkTheme(savedTheme === 'dark');
      }
    };

    loadTheme();
  }, []);

  // Update AsyncStorage when the theme changes
  useEffect(() => {
    AsyncStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const theme = isDarkTheme
    ? { backgroundColor: '#1E2A47', textColor: '#FFF', topBarColor: '#000' }
    : { backgroundColor: '#FFF', textColor: '#000', topBarColor: '#5D5FEF' };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
