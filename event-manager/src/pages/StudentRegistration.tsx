import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, CheckCircle2, ArrowLeft, Loader2, Download } from 'lucide-react';
import type { AppEvent } from '../types/event';

const registrationSchema = z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    department: z.string().min(2, 'Department is required'),
    year: z.string().min(1, 'Year is required'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const StudentRegistration: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { events, addGuest, fetchEvents, isLoading } = useEventStore();
    const [event, setEvent] = useState<AppEvent | null>(null);
    const [registeredId, setRegisteredId] = useState<string | null>(null);

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [fetchEvents, events.length]);

    useEffect(() => {
        if (eventId && events.length > 0) {
            const found = events.find(e => e.id === eventId);
            setEvent(found || null);
        }
    }, [eventId, events]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: '',
            email: '',
            department: '',
            year: '1st',
        },
    });

    const onSubmit = async (data: RegistrationFormData) => {
        if (!event) return;

        const registrationId = `CAM-${Math.floor(1000 + Math.random() * 9000)}-${event.department.substring(0, 3).toUpperCase()}`;

        await addGuest(event.id, {
            id: uuidv4(),
            ...data,
            registrationId,
            status: 'registered',
            plusOne: false,
        });

        setRegisteredId(registrationId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Event Not Found</h1>
                <p className="text-slate-500 mb-6 font-medium">The registration link might be expired or invalid.</p>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    if (registeredId) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-6">
                <Card className="max-w-md mx-auto p-10 text-center animate-in shadow-2xl">
                    <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Registration <span className="text-emerald-600">Successful!</span></h2>
                    <p className="text-slate-500 font-medium mb-8">You are confirmed for {event.title}.</p>

                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 mb-8 flex flex-col items-center">
                        <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                            <QRCode
                                value={registeredId}
                                size={180}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Your ID</p>
                        <p className="text-2xl font-black text-indigo-600 tracking-tighter">{registeredId}</p>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full premium-gradient shadow-lg">
                            <Download className="h-4 w-4 mr-2" />
                            Download Pass
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                            Back to Event Portal
                        </Button>
                    </div>

                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-8">
                        Please present this QR code at the entrance
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 lg:py-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">CampusPro Registration</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                        Join the <span className="text-indigo-600">Spectacle</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                        You're registering for <span className="text-slate-900 font-bold">{event.title}</span>.
                        Fill in your details to secure your spot and receive your digital entry pass.
                    </p>

                    <Card className="bg-white/50 backdrop-blur shadow-none border-slate-200/60 p-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="h-10 w-10 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                                    <ArrowLeft size={18} className="text-slate-400 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/')} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Event Details</p>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">{event.date} • {event.location}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-10 shadow-2xl shadow-slate-200 border-0 animate-in" style={{ animationDelay: '0.2s' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Student Full Name"
                            {...register('name')}
                            error={errors.name?.message}
                            placeholder="e.g., Alex Johnson"
                            className="text-lg"
                        />
                        <Input
                            label="Official Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                            placeholder="alex@college.edu"
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Year</label>
                                <select {...register('year')} className="w-full rounded-2xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 py-3 px-4 bg-slate-50 font-bold text-slate-700">
                                    <option value="1st">1st Year</option>
                                    <option value="2nd">2nd Year</option>
                                    <option value="3rd">3rd Year</option>
                                    <option value="4th">4th Year</option>
                                </select>
                            </div>
                            <Input
                                label="Department"
                                {...register('department')}
                                error={errors.department?.message}
                                placeholder="e.g., CSE"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full premium-gradient text-white shadow-xl shadow-indigo-100 text-sm py-4 rounded-2xl"
                            isLoading={isSubmitting}
                        >
                            Confirm Registration
                        </Button>
                        <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em] pt-4">
                            🔒 Secured with CampusPro 256-bit automated encryption
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};
