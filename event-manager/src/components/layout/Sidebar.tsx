import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Calendar } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: PlusCircle, label: 'Create Event', path: '/create-event' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">EventManager</span>
                </div>
            </div>
            <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
