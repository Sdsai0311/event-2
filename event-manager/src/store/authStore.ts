import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    googleAccessToken: string | null;
    login: (email: string, name: string) => Promise<void>;
    signup: (email: string, name: string) => Promise<void>;
    logout: () => void;
    setGoogleAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            googleAccessToken: null,
            login: async (email, name) => {
                // Mock login delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({
                    user: {
                        id: '1',
                        email,
                        name,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                    },
                    isAuthenticated: true,
                });
            },
            signup: async (email, name) => {
                // Mock signup delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({
                    user: {
                        id: '1',
                        email,
                        name,
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
