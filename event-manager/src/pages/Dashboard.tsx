import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Filter, Calendar as CalendarIcon, Users, Wallet } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EventCardSkeleton } from '../components/ui/LoadingSkeleton';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { events, isLoading, fetchEvents } = useEventStore();
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

    if (isLoading && events.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your upcoming and past events.</p>
                </div>
                <Button onClick={() => navigate('/create-event')}>
                    <Plus className="h-5 w-5 mr-2" />
                    New Event
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                className="bg-gray-50 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="conference">Conference</option>
                                <option value="wedding">Wedding</option>
                                <option value="party">Party</option>
                                <option value="corporate">Corporate</option>
                            </select>
                        </div>
                        <select
                            className="bg-gray-50 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </Card>

            {filteredEvents.length === 0 ? (
                <Card className="py-20 text-center">
                    <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        Try adjusting your search or filters, or create a new event to get started.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Link key={event.id} to={`/events/${event.id}`}>
                            <Card className="hover:shadow-md transition-all group overflow-hidden border-0 ring-1 ring-gray-200">
                                <div className="h-40 bg-indigo-600 relative p-6 flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <CalendarIcon size={120} />
                                    </div>
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-block w-fit">
                                        {event.eventType}
                                    </span>
                                    <h3 className="text-xl font-bold text-white relative z-10 line-clamp-2">
                                        {event.title}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Wallet className="h-4 w-4 mr-2 text-indigo-500" />
                                            ${(event.budget?.total || 0).toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-green-500" />
                                            {event.guestCount?.estimated} Guests
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight
                      ${event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                event.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {event.status}
                                        </span>
                                        <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                            Manage <Plus className="h-3 w-3 ml-1" />
                                        </span>
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
