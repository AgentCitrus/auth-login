"use client"

import { createContext, useState, useEffect, useLayoutEffect, ReactNode, FC } from 'react';
import axios from 'axios';

interface AuthContextProps {
    isAuthenticated: boolean;
    isLoading: boolean,
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useLayoutEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found!');
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        axios.get('http://localhost:5000/auth/status', { headers: {
                authorization: token
            }})
            .then(response => {
                setIsLoading(false);
                setIsAuthenticated(response.data.isAuthenticated);
            })
            .catch(error => {
                console.error(error);
                localStorage.removeItem('token');
                setIsLoading(false);
                setIsAuthenticated(false);
            });
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;