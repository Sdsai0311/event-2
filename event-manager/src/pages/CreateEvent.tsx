import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { EventType } from '../types/event';

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Date must be in the future',
    }),
    time: z.string().min(1, 'Time is required'),
    location: z.string().min(3, 'Location is required'),
    eventType: z.enum(['conference', 'wedding', 'party', 'corporate', 'other'] as const),
    budget: z.coerce.number().min(0, 'Budget must be positive'),
    guestCount: z.coerce.number().min(0, 'Guest count must be positive'),
});

type EventFormData = z.infer<typeof eventSchema>;

export const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const addEvent = useEventStore((state) => state.addEvent);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            eventType: 'conference',
            budget: 0,
            guestCount: 0,
        },
    });

    const onSubmit = (data: EventFormData) => {
        addEvent({
            id: uuidv4(),
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            eventType: data.eventType as EventType,
            status: 'draft',
            budget: {
                total: data.budget,
                spent: 0,
            },
            budgetItems: [],
            timelineItems: [],
            venues: [],
            vendors: [],
            staff: [],
            guests: [],
            risks: [],
            dayOfChecklist: [],
            guestCount: {
                estimated: data.guestCount,
                confirmed: 0,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        navigate('/');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Event Title"
                            {...register('title')}
                            error={errors.title?.message}
                            placeholder="e.g., Annual Tech Conference"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Type
                            </label>
                            <select
                                {...register('eventType')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="conference">Conference</option>
                                <option value="wedding">Wedding</option>
                                <option value="party">Party</option>
                                <option value="corporate">Corporate</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.eventType && (
                                <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className={`
                                    block w-full rounded-md border-gray-300 shadow-sm
                                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                                `}
                                placeholder="Enter event details..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Date"
                                type="date"
                                {...register('date')}
                                error={errors.date?.message}
                            />
                            <Input
                                label="Time"
                                type="time"
                                {...register('time')}
                                error={errors.time?.message}
                            />
                        </div>

                        <Input
                            label="Location"
                            {...register('location')}
                            error={errors.location?.message}
                            placeholder="e.g., Convention Center, Hall A"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Total Budget ($)"
                                type="number"
                                {...register('budget')}
                                error={errors.budget?.message}
                                placeholder="0.00"
                            />
                            <Input
                                label="Estimated Guest Count"
                                type="number"
                                {...register('guestCount')}
                                error={errors.guestCount?.message}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            Create Event
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
