import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    collegeName: string;
    setCollegeName: (name: string) => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            collegeName: 'Your College',
            setCollegeName: (name) => set({ collegeName: name }),
        }),
        {
            name: 'campus-pro-config',
        }
    )
);
