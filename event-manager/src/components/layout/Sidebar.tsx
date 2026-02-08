import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Sparkles, CalendarDays, Edit3, Check } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';

import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
    const { user } = useAuthStore();
    const { collegeName, setCollegeName } = useConfigStore();
    const [isEditing, setIsEditing] = React.useState(false);
    const [tempName, setTempName] = React.useState(collegeName);

    const handleSave = () => {
        setCollegeName(tempName);
        setIsEditing(false);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['student', 'admin'] },
        { icon: CalendarDays, label: 'Upcoming Events', path: '/upcoming', roles: ['student', 'admin'] },
        { icon: PlusCircle, label: 'Create Event', path: '/create-event', roles: ['admin'] },
    ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <aside className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-100 dark:border-slate-800 min-h-screen hidden md:block z-40 transition-colors">
            <div className="p-8">
                <div className="flex items-start space-x-3 group">
                    <div className="bg-indigo-600 dark:bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 group-hover:rotate-12 transition-transform duration-300 shrink-0">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight block leading-none">Campus<span className="text-indigo-600 dark:text-indigo-400">Pro</span></span>

                        {/* College Name Slot */}
                        <div className="mt-2 group/college relative">
                            {isEditing ? (
                                <div className="flex items-center space-x-1">
                                    <input
                                        autoFocus
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onBlur={handleSave}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 border-none p-1 rounded w-full focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                                    />
                                    <button onClick={handleSave} className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400">
                                        <Check className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
                                        {collegeName}
                                    </span>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="opacity-0 group-hover/college:opacity-100 transition-opacity ml-1 text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400"
                                    >
                                        <Edit3 className="h-2.5 w-2.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <nav className="px-6 space-y-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4 mb-4">Main Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 ring-1 ring-indigo-500 dark:ring-indigo-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
};
