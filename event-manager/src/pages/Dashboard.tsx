import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Calendar as CalendarIcon, Users, Wallet, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { EVENT_TYPE_LABELS } from '../types/event';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EventCardSkeleton } from '../components/ui/LoadingSkeleton';

import { useConfigStore } from '../store/configStore';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { events, isLoading, fetchEvents } = useEventStore();
    const { collegeName } = useConfigStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || event.eventType === filterType;
        const matchesStatus = filterStatus === 'all' || event.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const totalBudget = events.reduce((acc, e) => acc + (e.budget?.total || 0), 0);
    const totalGuests = events.reduce((acc, e) => acc + (e.guestCount?.estimated || 0), 120); // Mocked base
    const upcomingEvents = events.filter(e => e.status !== 'past').length;

    if (isLoading && events.length === 0) {
        return (
            <div className="space-y-8 animate-in">
                <div className="flex justify-between items-center px-2">
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
                        <div className="h-4 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {collegeName} <span className="text-indigo-600">Event Portal</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Replace manual management with automated excellence.</p>
                </div>
                <Button
                    size="lg"
                    className="premium-gradient shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
                    onClick={() => navigate('/create-event')}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Event
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 relative overflow-hidden group hover:ring-2 hover:ring-indigo-500/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Upcoming</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">{upcomingEvents}</h3>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                            <CalendarIcon size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                        <TrendingUp size={12} className="mr-1" />
                        Active Planning
                    </div>
                </Card>

                <Card className="p-6 relative overflow-hidden group hover:ring-2 hover:ring-indigo-500/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Guests</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalGuests.toLocaleString()}</h3>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 font-medium">Across all scheduled events</p>
                </Card>

                <Card className="p-6 relative overflow-hidden group hover:ring-2 hover:ring-indigo-500/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Portfolio Value</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">${totalBudget.toLocaleString()}</h3>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 font-medium">Total managed budget</p>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="p-2 bg-slate-50/50 border-slate-200 shadow-none">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find an event by name or location..."
                            className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm shadow-slate-200/50 placeholder:text-slate-400 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm shadow-slate-200/50"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="technical-symposium">Technical Symposium</option>
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="cultural-fest">Cultural Fest</option>
                            <option value="sports-meet">Sports Meet</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="conference">Conference</option>
                            <option value="club-activity">Club Activity</option>
                            <option value="orientation">Orientation</option>
                            <option value="placement-drive">Placement Drive</option>
                            <option value="nss-social-service">NSS / Social Service</option>
                            <option value="alumni-meet">Alumni Meet</option>
                            <option value="farewell-freshers">Farewell / Freshers</option>
                            <option value="academic-event">Academic Event</option>
                            <option value="other">Other</option>
                        </select>
                        <select
                            className="bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm shadow-slate-200/50"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="past">Completed</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Event List */}
            {filteredEvents.length === 0 ? (
                <Card className="py-24 text-center glass-card border-none">
                    <div className="mx-auto h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-slate-100 shadow-inner">
                        <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No events matched</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
                        Try adjusting your filters or create something spectacular from scratch.
                    </p>
                </Card>
            ) : (
                <div className="dashboard-grid">
                    {filteredEvents.map((event) => (
                        <Link key={event.id} to={`/events/${event.id}`}>
                            <Card className="hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all group overflow-hidden border-0 ring-1 ring-slate-200/60 bg-white p-0 h-full flex flex-col">
                                <div className="h-48 bg-slate-100 relative overflow-hidden">
                                    {/* Background patterns/images would go here */}
                                    <div className="absolute inset-0 premium-gradient opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white">
                                        <Star size={16} fill={event.status === 'confirmed' ? 'white' : 'transparent'} />
                                    </div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded w-fit mb-3 border border-white/20">
                                            {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                                        </span>
                                        <h3 className="text-2xl font-black text-white leading-tight line-clamp-2">
                                            {event.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col space-y-6">
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                            <div className="flex items-center text-sm font-bold text-slate-700 truncate">
                                                <TrendingUp className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />
                                                {event.location.split(',')[0]}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Guests</p>
                                            <div className="flex items-center text-sm font-bold text-slate-700">
                                                <Users className="h-4 w-4 mr-2 text-emerald-500 shrink-0" />
                                                {event.guestCount?.estimated}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                                            ${event.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                event.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {event.status}
                                        </div>
                                        <div className="flex items-center text-indigo-600 font-black text-xs group-hover:translate-x-1 transition-transform">
                                            Manage <ArrowRight size={14} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
