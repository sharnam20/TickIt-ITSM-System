import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Clean up classes to prevent duplicates
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Also apply to body as backup for some high-specificity overrides
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);

        localStorage.setItem('theme', theme);
        console.log(`[THEME] Switched to ${theme} mode`);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
