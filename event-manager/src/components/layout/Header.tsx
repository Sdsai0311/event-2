import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center flex-1">
                <div className="relative w-96">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search className="h-5 w-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 leading-none">{user?.name}</span>
                        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Administrator</span>
                    </div>
                    <img
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-gray-100 shadow-sm"
                        src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="User profile"
                    />
                    <button
                        onClick={() => logout()}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
