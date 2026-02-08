import React from 'react';
import { Bell, Search, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useConfigStore } from '../../store/configStore';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { isDarkMode, toggleDarkMode } = useConfigStore();

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40 transition-colors">
            <div className="flex items-center flex-1">
                <div className="relative w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100/50 dark:focus:ring-indigo-500/30 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-8">
                <button
                    onClick={toggleDarkMode}
                    className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all relative p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl group"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? (
                        <Sun className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    ) : (
                        <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                    )}
                </button>

                <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all relative p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                </button>

                <div className="flex items-center space-x-4 pl-8 border-l border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight">{user?.name}</span>
                        <div className="flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Active session</span>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            className="h-10 w-10 rounded-xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg shadow-slate-200 dark:shadow-slate-950"
                            src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"}
                            alt="User profile"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 p-0.5">
                            <ChevronDown className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="ml-2 p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        title="End Session"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
