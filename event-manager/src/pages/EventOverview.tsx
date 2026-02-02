import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppEvent } from '../types/event';
import { Card } from '../components/ui/Card';
import { Calendar, Users, Wallet } from 'lucide-react';
import { GoogleCalendarSync } from '../components/google/GoogleCalendarSync';

export const EventOverview: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Event Overview</h2>
                <div className="flex space-x-2">
                    <GoogleCalendarSync event={event} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="text-xl font-bold text-gray-900">{event.guestCount.estimated}</p>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-xl font-bold text-gray-900">${event.budget.total.toLocaleString()}</p>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-xl font-bold text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-600">{event.description}</p>
            </Card>
        </div>
    );
};
