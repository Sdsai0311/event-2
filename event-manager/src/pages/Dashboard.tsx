import React from 'react';
import { Link } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, MapPin, Plus, Users, Wallet } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
    const { events } = useEventStore();

    // Re-hydrate store on mount (handled by persist middleware automatically, 
    // but good to have a read operation to ensure synchronization if needed)
    // In this case, just accessing 'events' is enough.

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-white p-8 rounded-full shadow-sm mb-6">
                    <Calendar className="h-12 w-12 text-indigo-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No events yet</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Get started by creating your first event. You can manage all your events from this dashboard.
                </p>
                <Link to="/create-event">
                    <Button size="lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>
        );
    }

    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        You have {upcomingEvents.length} upcoming events
                    </p>
                </div>
                <Link to="/create-event">
                    <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        New Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                        <Card className="hover:shadow-md transition-shadow group cursor-pointer h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-blue-100 text-blue-800'}`}>
                                            {event.status}
                                        </span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-500 capitalize">{event.eventType}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                                    {format(new Date(event.date), 'PPP')}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                                    {event.guestCount.estimated} guests
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Wallet className="h-4 w-4 mr-3 text-gray-400" />
                                    ${event.budget.total.toLocaleString()}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};
