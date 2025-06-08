import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('remwaste-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
    }
    return true;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('remwaste-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('remwaste-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const value = {
    isDark,
    toggleTheme,
    // Helper function to get theme classes
    getThemeClasses: (darkClasses, lightClasses) => 
      isDark ? darkClasses : lightClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}