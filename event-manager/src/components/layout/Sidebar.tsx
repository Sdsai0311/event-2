import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Sparkles, CalendarDays, Edit3, Check } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';

export const Sidebar: React.FC = () => {
    const { collegeName, setCollegeName } = useConfigStore();
    const [isEditing, setIsEditing] = React.useState(false);
    const [tempName, setTempName] = React.useState(collegeName);

    const handleSave = () => {
        setCollegeName(tempName);
        setIsEditing(false);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CalendarDays, label: 'Upcoming Events', path: '/upcoming' },
        { icon: PlusCircle, label: 'Create Event', path: '/create-event' },
    ];

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 min-h-screen hidden md:block z-40">
            <div className="p-8">
                <div className="flex items-start space-x-3 group">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300 shrink-0">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">Campus<span className="text-indigo-600">Pro</span></span>

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
                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border-none p-1 rounded w-full focus:ring-1 focus:ring-indigo-300"
                                    />
                                    <button onClick={handleSave} className="text-emerald-500 hover:text-emerald-600">
                                        <Check className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                        {collegeName}
                                    </span>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="opacity-0 group-hover/college:opacity-100 transition-opacity ml-1 text-slate-300 hover:text-indigo-500"
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
