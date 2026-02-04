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
    eventType: z.enum([
        'technical-symposium',
        'workshop',
        'seminar',
        'cultural-fest',
        'sports-meet',
        'hackathon',
        'conference',
        'club-activity',
        'orientation',
        'placement-drive',
        'nss-social-service',
        'alumni-meet',
        'farewell-freshers',
        'academic-event',
        'other'
    ] as const),
    department: z.string().min(2, 'Department is required'),
    objectives: z.string().min(10, 'Objectives are required'),
    outcomes: z.string().min(10, 'Outcomes are required'),
    facultyCoordinator: z.string().min(3, 'Faculty coordinator is required'),
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
            eventType: 'technical-symposium',
            department: '',
            objectives: '',
            outcomes: '',
            facultyCoordinator: '',
            budget: 0,
            guestCount: 0,
        },
    });

    const onSubmit = async (data: EventFormData) => {
        await addEvent({
            id: uuidv4(),
            title: data.title,
            category: data.eventType as EventType,
            department: data.department,
            date: data.date,
            time: data.time,
            location: data.location,
            description: data.description,
            objectives: data.objectives,
            outcomes: data.outcomes,
            facultyCoordinator: data.facultyCoordinator,
            eventType: data.eventType as EventType,
            status: 'pending-approval',
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New College Event</h1>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Event Title"
                            {...register('title')}
                            error={errors.title?.message}
                            placeholder="e.g., Annual Tech Symposium 2024"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Type
                            </label>
                            <select
                                {...register('eventType')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="technical-symposium">Technical Symposium</option>
                                <option value="workshop">Workshop / Hands-on Training</option>
                                <option value="seminar">Seminar / Guest Lecture</option>
                                <option value="cultural-fest">Cultural Fest</option>
                                <option value="sports-meet">Sports Meet / Tournament</option>
                                <option value="hackathon">Hackathon</option>
                                <option value="conference">Conference</option>
                                <option value="club-activity">Club Activity</option>
                                <option value="orientation">Orientation / Induction Program</option>
                                <option value="placement-drive">Placement Drive</option>
                                <option value="nss-social-service">NSS / Social Service Event</option>
                                <option value="alumni-meet">Alumni Meet</option>
                                <option value="farewell-freshers">Farewell / Freshers Day</option>
                                <option value="academic-event">Internal Assessment / Academic Event</option>
                                <option value="other">Other (Custom Event)</option>
                            </select>
                            {errors.eventType && (
                                <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
                            )}
                        </div>

                        <Input
                            label="Department / Host Club"
                            {...register('department')}
                            error={errors.department?.message}
                            placeholder="e.g., Computer Science / Robotics Club"
                        />

                        <Input
                            label="Faculty Coordinator"
                            {...register('facultyCoordinator')}
                            error={errors.facultyCoordinator?.message}
                            placeholder="e.g., Dr. Jane Smith"
                        />

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Objectives
                            </label>
                            <textarea
                                {...register('objectives')}
                                rows={3}
                                className={`
                                    block w-full rounded-md border-gray-300 shadow-sm
                                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${errors.objectives ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                                `}
                                placeholder="What do you aim to achieve?"
                            />
                            {errors.objectives && (
                                <p className="mt-1 text-sm text-red-600">{errors.objectives.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expected Outcomes
                            </label>
                            <textarea
                                {...register('outcomes')}
                                rows={3}
                                className={`
                                    block w-full rounded-md border-gray-300 shadow-sm
                                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${errors.outcomes ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                                `}
                                placeholder="What will participants gain?"
                            />
                            {errors.outcomes && (
                                <p className="mt-1 text-sm text-red-600">{errors.outcomes.message}</p>
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
