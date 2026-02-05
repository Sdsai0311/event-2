import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Image as ImageIcon,
    Upload,
    X,
    Calendar,
    Clock,
    MapPin,
    Users,
    ArrowLeft,
    CheckCircle,
    Info,
    Bell
} from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import type { EventType } from '../types/event';

const upcomingEventSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    category: z.enum([
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
    department: z.string().min(2, 'Department / Club Name is required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    location: z.string().min(3, 'Location is required'),
    registrationDeadline: z.string().min(1, 'Registration deadline is required'),
    maxParticipants: z.coerce.number().min(1, 'At least 1 participant is required'),
    organizerName: z.string().min(3, 'Organizer name is required'),
    organizerContact: z.string().min(10, 'Valid contact information is required'),
});

type UpcomingEventFormData = z.infer<typeof upcomingEventSchema>;

export const EditUpcomingEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getEvent, updateEvent, isLoading } = useEventStore();
    const event = getEvent(id || '');

    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [successMessage, setSuccessMessage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(upcomingEventSchema),
    });

    useEffect(() => {
        if (event) {
            reset({
                title: event.title,
                category: event.category,
                department: event.department,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                registrationDeadline: event.registrationDeadline || '',
                maxParticipants: event.maxParticipants || 100,
                organizerName: event.organizerName || '',
                organizerContact: event.organizerContact || '',
            });
            if (event.posterUrl) {
                setPosterPreview(event.posterUrl);
            }
        }
    }, [event, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: UpcomingEventFormData) => {
        if (!id) return;

        await updateEvent(id, {
            ...data,
            posterUrl: posterPreview || undefined,
            eventType: data.category as EventType,
            updatedAt: new Date().toISOString(),
        });

        setSuccessMessage(true);
        setTimeout(() => {
            navigate('/upcoming');
        }, 2000);
    };

    if (!event && !isLoading) {
        return <div className="p-8 text-center">Event not found</div>;
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (successMessage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-emerald-100 p-6 rounded-full">
                    <CheckCircle className="h-16 w-16 text-emerald-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">Event Updated!</h2>
                    <p className="text-slate-500 font-medium">Your changes have been saved successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Event</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Modify and Refine Event Details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="space-y-6">
                            <Input
                                label="Event Title"
                                {...register('title')}
                                error={errors.title?.message}
                                placeholder="Give your event a catchy title..."
                                className="text-lg font-bold"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Event Category
                                    </label>
                                    <select
                                        {...register('category')}
                                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                    >
                                        <option value="technical-symposium">Technical Symposium</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="seminar">Seminar</option>
                                        <option value="cultural-fest">Cultural Fest</option>
                                        <option value="sports-meet">Sports Meet</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="club-activity">Club Activity</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-xs text-rose-500 font-bold">{errors.category.message}</p>
                                    )}
                                </div>

                                <Input
                                    label="Dept / Club Name"
                                    {...register('department')}
                                    error={errors.department?.message}
                                    placeholder="Which team is hosting?"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Event Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={5}
                                    className={`
                                        block w-full rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-700
                                        focus:border-indigo-500 focus:ring-indigo-500 transition-all
                                        ${errors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}
                                    `}
                                    placeholder="Provide a detailed description of the event..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-rose-500 font-bold">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Date"
                                    type="date"
                                    icon={<Calendar className="h-4 w-4 text-slate-400" />}
                                    {...register('date')}
                                    error={errors.date?.message}
                                />
                                <Input
                                    label="Time"
                                    type="time"
                                    icon={<Clock className="h-4 w-4 text-slate-400" />}
                                    {...register('time')}
                                    error={errors.time?.message}
                                />
                            </div>

                            <Input
                                label="Location"
                                icon={<MapPin className="h-4 w-4 text-slate-400" />}
                                {...register('location')}
                                error={errors.location?.message}
                                placeholder="e.g., Main Auditorium, Hall A, or Online Link"
                            />

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center">
                                    <Bell className="h-4 w-4 mr-2 text-amber-500" />
                                    Smart Reminders
                                </h3>
                                <div className="flex items-center space-x-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                    <input
                                        type="checkbox"
                                        id="enableReminders"
                                        className="h-5 w-5 rounded-lg border-amber-200 text-amber-500 focus:ring-amber-500"
                                    />
                                    <label htmlFor="enableReminders" className="text-sm font-bold text-slate-700">
                                        Send automatic reminders to participants 24 hours before the event
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                            Registration & Participants
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Max Participants"
                                type="number"
                                {...register('maxParticipants')}
                                error={errors.maxParticipants?.message}
                            />
                            <Input
                                label="Registration Deadline"
                                type="date"
                                {...register('registrationDeadline')}
                                error={errors.registrationDeadline?.message}
                            />
                        </div>

                        <div className="mt-8 space-y-6 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-2">Organizer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Organizer Name"
                                    {...register('organizerName')}
                                    error={errors.organizerName?.message}
                                    placeholder="Primary contact name"
                                />
                                <Input
                                    label="Contact (Mobile/Email)"
                                    {...register('organizerContact')}
                                    error={errors.organizerContact?.message}
                                    placeholder="How should people reach you?"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Poster Upload & Preview */}
                <div className="space-y-6">
                    <Card className="p-6 border-none ring-1 ring-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                            Event Poster
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative aspect-[3/4] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
                                ${posterPreview ? 'border-transparent' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'}
                            `}
                        >
                            {posterPreview ? (
                                <>
                                    <img src={posterPreview} alt="Poster preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                            <Upload className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPosterPreview(null);
                                        }}
                                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500/50 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <div className="bg-indigo-50 p-4 rounded-3xl mb-4">
                                        <ImageIcon className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Click to upload poster</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-start space-x-3">
                                <Info className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Updating poster images can re-engage potential participants.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-8 py-4 rounded-2xl shadow-xl shadow-indigo-200"
                            isLoading={isSubmitting}
                        >
                            Save Changes
                        </Button>
                    </Card>
                </div>
            </form>
        </div>
    );
};
