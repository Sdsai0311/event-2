import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Sparkles, CalendarDays } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CalendarDays, label: 'Upcoming Events', path: '/upcoming' },
        { icon: PlusCircle, label: 'Create Event', path: '/create-event' },
    ];

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 min-h-screen hidden md:block z-40">
            <div className="p-8">
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">Campus<span className="text-indigo-600">Pro</span></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">College Event Platform</span>
                    </div>
                </div>
            </div>

            <nav className="px-6 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-4">Main Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-1 ring-indigo-500 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-10 left-6 right-6">
                <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Pro Support</p>
                    <p className="text-sm text-white font-medium leading-relaxed">Upgrade to unlock advanced analytics.</p>
                    <button className="mt-4 w-full bg-white text-slate-900 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">Upgrade</button>
                </div>
            </div>
        </aside>
    );
};
