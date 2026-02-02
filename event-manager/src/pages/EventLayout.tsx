import React from 'react';
import { Outlet, NavLink, useParams, Navigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { LayoutDashboard, Wallet, CalendarClock, Settings, MapPin, ShoppingBag, Users as UsersIcon, UserCheck, ShieldAlert, Zap } from 'lucide-react';

export const EventLayout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getEvent } = useEventStore();
    const event = getEvent(id || '');

    if (!event) {
        return <Navigate to="/" replace />;
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '' },
        { icon: UserCheck, label: 'Guests', path: 'guests' },
        { icon: MapPin, label: 'Venues', path: 'venues' },
        { icon: ShoppingBag, label: 'Vendors', path: 'vendors' },
        { icon: Wallet, label: 'Budget', path: 'budget' },
        { icon: CalendarClock, label: 'Timeline', path: 'timeline' },
        { icon: UsersIcon, label: 'Team', path: 'team' },
        { icon: ShieldAlert, label: 'Risks', path: 'risks' },
        { icon: Zap, label: 'Day of Event', path: 'day-of' },
        { icon: Settings, label: 'Settings', path: 'settings' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{event.location}</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <nav className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.path === ''}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <main className="flex-1 overflow-auto p-8">
                    <Outlet context={{ event }} />
                </main>
            </div>
        </div>
    );
};
