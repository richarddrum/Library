import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
    userType: string | null;
    tokenIsValid: boolean;
    setUserType: (type: string | null) => void;
    setTokenIsValid: (isValid: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userType, setUserType] = useState<string | null>(null);
    const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ userType, tokenIsValid, setUserType, setTokenIsValid }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
