'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '@/lib/axios';

interface User {
    _id: string;
    email: string;
    fullName: string;
    role: 'Student' | 'Lecturer' | 'Admin';
    universityId: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
    register: (data: any) => Promise<any>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch current user on mount
    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/api/auth/me');
            setUser(response.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string, rememberMe?: boolean) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/api/auth/login', {
                email,
                password,
                rememberMe,
            });
            const userData = response.data.data;
            setUser(userData);
            return userData;
        } catch (err) {
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/api/auth/register', data);
            // Backend sets cookies and returns user data on successful registration
            if (response.data && response.data.data) {
                setUser(response.data.data);
            }
            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refetchUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
