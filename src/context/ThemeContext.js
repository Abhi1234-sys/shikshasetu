import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: {
            background: isDarkMode ? '#0f172a' : '#f8fafc',
            card: isDarkMode ? '#1e293b' : '#ffffff',
            text: isDarkMode ? '#f8fafc' : '#1e293b',
            subText: isDarkMode ? '#94a3b8' : '#64748b',
            border: isDarkMode ? '#334155' : '#e2e8f0',
            
            accent: '#10b981' 
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            <div style={{ 
                backgroundColor: theme.colors.background, 
                color: theme.colors.text, 
                minHeight: '100vh', 
                width: '100%',
                margin: 0,
                padding: 0,
                transition: 'background-color 0.3s ease, color 0.3s ease' 
            }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};