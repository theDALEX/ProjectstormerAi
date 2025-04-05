'use client';

import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

type BridgeContextType = {
    isDarkMode: boolean,
    setIsDarkMode: (data: boolean) => void,
    toggleTheme: () => void,
    responseData: string,
    setResponseData: (data: string) => void,
};

const BridgeContext = createContext<BridgeContextType>({
    isDarkMode: false,
    setIsDarkMode: (data: boolean) => { },
    toggleTheme: () => { },
    responseData: '',
    setResponseData: (data: string) => { },
});

export const BridgeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [responseData, setResponseData] = useState('');

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <BridgeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme, responseData, setResponseData }}>
            {children}
        </BridgeContext.Provider>
    );
};

export const useBridgeData = () => useContext(BridgeContext);
