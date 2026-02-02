import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppEvent } from '../types/event';
import { Card } from '../components/ui/Card';
import { Calendar, Users, Wallet, Star, Info, MapPin } from 'lucide-react';
import { GoogleCalendarSync } from '../components/google/GoogleCalendarSync';

export const EventOverview: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project <span className="text-indigo-600">Brief</span></h2>
                    <p className="text-slate-500 font-medium mt-1">Core details and high-level progress tracking.</p>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <GoogleCalendarSync event={event} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-0 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Users size={80} />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Guest Metrics</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {event.guestCount.confirmed} <span className="text-lg font-bold text-slate-300">/ {event.guestCount.estimated}</span>
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Confirmed vs estimated attendance</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-1000"
                            style={{ width: `${Math.min((event.guestCount.confirmed / event.guestCount.estimated) * 100, 100)}%` }}
                        ></div>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Wallet size={80} />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <Wallet size={24} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Summary</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                            ${(event.budget.spent || 0).toLocaleString()} <span className="text-lg font-bold text-slate-300">/ ${(event.budget.total).toLocaleString()}</span>
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Current expenditure tracking</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50">
                        <div
                            className="h-full bg-emerald-600 transition-all duration-1000"
                            style={{ width: `${Math.min(((event.budget.spent || 0) / event.budget.total) * 100, 100)}%` }}
                        ></div>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Calendar size={80} />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                <Calendar size={24} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Countdown</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} <span className="text-lg font-bold text-slate-300">Days</span>
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Time remaining until launch</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50">
                        <div className="h-full bg-rose-600 w-2/3"></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-8">
                        <Info className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-xl font-black text-slate-900">Event Description</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                        "{event.description}"
                    </p>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-indigo-600 border-none text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-indigo-200">Venue Details</h4>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-indigo-300 mt-1 shrink-0" />
                                <p className="font-bold">{event.location}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-900 border-none text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Planning Progress</h4>
                        <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            <span className="text-2xl font-black">{event.status === 'confirmed' ? '92%' : '45%'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Project Maturity Index</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
