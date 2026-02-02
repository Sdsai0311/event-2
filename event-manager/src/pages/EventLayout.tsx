import React, { useEffect } from 'react';
import { Outlet, NavLink, useParams, Navigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { LayoutDashboard, Wallet, CalendarClock, Settings, MapPin, ShoppingBag, Users as UsersIcon, UserCheck, ShieldAlert, Zap } from 'lucide-react';

export const EventLayout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getEvent, fetchEvents, isLoading, events } = useEventStore();
    const event = getEvent(id || '');

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [fetchEvents, events.length]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in">
            {/* Header Area */}
            <div className="bg-white/70 backdrop-blur-md border-b border-white sticky top-0 z-30 px-8 py-5">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-indigo-600 h-1.5 w-6 rounded-full"></span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Live Planning Mode</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
                        <div className="flex items-center text-xs font-bold text-slate-400 mt-2 space-x-4">
                            <div className="flex items-center">
                                <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <span className="text-slate-200">|</span>
                            <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
                                {event.location}
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Stats in header */}
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed Guests</p>
                            <p className="text-xl font-black text-slate-900">{event.guestCount?.confirmed || 0}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Budget</p>
                            <p className="text-xl font-black text-slate-900 font-mono">${(event.budget?.total || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Modern Sidebar */}
                <nav className="w-72 bg-white/50 border-r border-slate-100 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-4">Management Console</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.path === ''}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-50 font-bold'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-lg hover:shadow-slate-100/50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                    <span className="text-sm tracking-tight">{item.label}</span>
                                    {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500"></div>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Content Area */}
                <main className="flex-1 overflow-auto bg-[#f8fafc] p-8 lg:p-12">
                    <div className="max-w-6xl mx-auto pb-20">
                        <Outlet context={{ event }} />
                    </div>
                </main>
            </div>
        </div>
    );
};
