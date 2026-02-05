import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { EventCard } from '../components/events/EventCard';
import { Plus, Search, Filter, LayoutGrid, List, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useConfigStore } from '../store/configStore';
import { Toast, type ToastType } from '../components/ui/Toast';

export const UpcomingEvents: React.FC = () => {
    const navigate = useNavigate();
    const { events, fetchEvents, updateEvent, deleteEvent } = useEventStore();
    const { collegeName } = useConfigStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // In a real app, you'd check user role. Here we just enable admin features for demo.
    const isAdmin = true;

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        // Only show approved events to users, but show all to admins (or show pending separately)
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(events.map(e => e.category)));

    const handleApprove = async (id: string) => {
        await updateEvent(id, { isApproved: true, status: 'upcoming' });
        setToast({ message: 'Event approved successfully!', type: 'success' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(id);
            setToast({ message: 'Event deleted successfully!', type: 'success' });
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Header section with Stats & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/40 p-8 rounded-[40px] border border-white">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-500" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{collegeName} Discovery</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h1>
                    <p className="text-slate-500 font-medium mt-1">Explore and participate in campus activities</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate('/upcoming/upload')}
                        className="rounded-2xl px-6 py-4 shadow-xl shadow-indigo-200 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Upload New Event
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search events, clubs, or topics..."
                        className="w-full pl-14 pr-6 py-4 rounded-[24px] border-none ring-1 ring-slate-100 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 bg-white/50 p-2 rounded-[24px] ring-1 ring-slate-100">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                        >
                            {cat.split('-')[0]}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600"><LayoutGrid className="h-4 w-4" /></button>
                    <button className="p-2.5 text-slate-400 hover:text-slate-600"><List className="h-4 w-4" /></button>
                </div>
            </div>

            {/* Event Grid */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isAdmin={isAdmin}
                            onApprove={handleApprove}
                            onDelete={handleDelete}
                            onClick={() => navigate(`/events/${event.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-[40px] border border-dashed border-slate-200">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                        <Filter className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No events found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search query.</p>
                    <Button
                        variant="outline"
                        className="mt-6 rounded-2xl"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
};
