import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    collegeName: string;
    setCollegeName: (name: string) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            collegeName: 'Your College',
            setCollegeName: (name) => set({ collegeName: name }),
            isDarkMode: false,
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        }),
        {
            name: 'campus-pro-config',
        }
    )
);
