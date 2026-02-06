import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    registerNumber?: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    googleAccessToken: string | null;
    login: (email: string, name: string, role: UserRole, registerNumber?: string) => Promise<void>;
    signup: (email: string, name: string, role: UserRole, registerNumber?: string) => Promise<void>;
    logout: () => void;
    setGoogleAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            googleAccessToken: null,
            login: async (email, name, role, registerNumber) => {
                // Mock login delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({
                    user: {
                        id: Math.random().toString(36).substr(2, 9),
                        email,
                        name,
                        role,
                        registerNumber,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                    },
                    isAuthenticated: true,
                });
            },
            signup: async (email, name, role, registerNumber) => {
                // Mock signup delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({
                    user: {
                        id: Math.random().toString(36).substr(2, 9),
                        email,
                        name,
                        role,
                        registerNumber,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                    },
                    isAuthenticated: true,
                });
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, googleAccessToken: null });
            },
            setGoogleAccessToken: (token: string | null) => {
                set({ googleAccessToken: token });
            },
        }),
        {
            name: 'event-manager-auth',
        }
    )
);
