import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppEvent } from '../types/event';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Wallet, CheckCircle2, XCircle, Target, Award, UserCheck, GraduationCap, Star } from 'lucide-react';
import { GoogleCalendarSync } from '../components/google/GoogleCalendarSync';
import { EVENT_TYPE_LABELS } from '../types/event';
import { useEventStore } from '../store/eventStore';

import { useAuthStore } from '../store/authStore';

export const EventOverview: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const updateEvent = useEventStore((state) => state.updateEvent);
    const { user } = useAuthStore();

    const isAdmin = user?.role === 'admin';

    const handleApproval = async (approve: boolean) => {
        await updateEvent(event.id, {
            status: approve ? 'confirmed' : 'cancelled'
        });
    };

    return (
        <div className="space-y-10 animate-in">
            {/* Header section with Approval Workflow */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                            {EVENT_TYPE_LABELS[event.eventType]}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{event.title}</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        Hosted by <span className="text-indigo-600 font-bold">{event.department}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {isAdmin && event.status === 'pending-approval' && (
                        <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-2xl border border-amber-100 mr-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-rose-600 border-rose-100 hover:bg-rose-50"
                                onClick={() => handleApproval(false)}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                                onClick={() => handleApproval(true)}
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve Event
                            </Button>
                        </div>
                    )}
                    <GoogleCalendarSync event={event} />
                </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-0 overflow-hidden relative group">
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Registrations</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {event.guestCount.confirmed} <span className="text-lg font-bold text-slate-300">/ {event.guestCount.estimated}</span>
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Target reached: {Math.round((event.guestCount.confirmed / event.guestCount.estimated) * 100)}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-1000"
                            style={{ width: `${Math.min((event.guestCount.confirmed / event.guestCount.estimated) * 100, 100)}%` }}
                        ></div>
                    </div>
                </Card>

                {isAdmin && (
                    <Card className="p-0 overflow-hidden relative group">
                        <div className="p-8">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Wallet size={24} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget Utilization</span>
                            </div>
                            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                                ${(event.budget.spent || 0).toLocaleString()} <span className="text-lg font-bold text-slate-300">/ ${(event.budget.total).toLocaleString()}</span>
                            </h4>
                            <p className="text-sm text-slate-500 font-medium mt-2">Allocated for hardware/logistics</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50">
                            <div
                                className="h-full bg-emerald-600 transition-all duration-1000"
                                style={{ width: `${Math.min(((event.budget.spent || 0) / event.budget.total) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </Card>
                )}

                <Card className="p-0 overflow-hidden relative group">
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-slate-900 rounded-2xl text-white">
                                <UserCheck size={24} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Faculty Lead</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight truncate">
                            {event.facultyCoordinator}
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Primary point of contact</p>
                    </div>
                </Card>
            </div>

            {/* Content areas: Objectives & Outcomes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute -right-4 -top-4 text-indigo-50 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Target size={200} />
                    </div>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <Target className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Event Objectives</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        {event.objectives}
                    </p>
                    <div className="mt-8 pt-6 border-t border-slate-50">
                        <p className="text-slate-400 text-sm italic">"{event.description}"</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute -right-4 -top-4 text-emerald-50 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Award size={200} />
                    </div>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <Award className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Expected Outcomes</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        {event.outcomes}
                    </p>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center text-sm font-bold text-slate-400">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                            Skill Certification for Participants
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-400">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                            Industrial Networking Opportunity
                        </div>
                    </div>
                </Card>
            </div>

            {/* Registration Center */}
            {isAdmin && (
                <Card className="premium-gradient text-white border-0 shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-1/2"></div>
                    <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-black">Registration Center</h3>
                            </div>
                            <p className="text-indigo-100 font-medium max-w-lg">
                                Share this link with students to enable online registration.
                                Responses are tracked in real-time in the Guests section.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 w-full md:w-auto min-w-[320px]">
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Public Registration Link</p>
                            <div className="flex items-center gap-3">
                                <code className="text-xs bg-black/20 px-3 py-2 rounded-lg flex-1 overflow-hidden truncate">
                                    {window.location.origin}/register/{event.id}
                                </code>
                                <Button
                                    size="sm"
                                    className="bg-white text-indigo-600 hover:bg-slate-50 font-black text-xs px-4"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/register/${event.id}`);
                                        alert('Link copied to clipboard!');
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Post-Event Evaluation */}
            {event.status === 'past' && (
                <Card className="border-indigo-100 bg-indigo-50/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Post-Event Evaluation</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-xl">
                                Detailed analysis of participant feedback and objective fulfillment.
                                Integration with Google Forms for automated insight.
                            </p>
                        </div>
                        {event.feedbackUrl ? (
                            <a
                                href={event.feedbackUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white px-6 py-3 rounded-2xl border border-indigo-100 text-indigo-600 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center"
                            >
                                <Users className="h-4 w-4 mr-2" />
                                View Analytics
                            </a>
                        ) : (
                            <Button className="premium-gradient text-white" onClick={() => updateEvent(event.id, { feedbackUrl: 'https://docs.google.com/forms/sample' })}>
                                Connect Google Form
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                        <div className="p-6 bg-white rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Rating</p>
                            <div className="flex items-center">
                                <span className="text-3xl font-black text-slate-900 mr-2">4.8</span>
                                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 md:col-span-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Key Recommendation</p>
                            <p className="text-sm font-bold text-slate-700">"Increase duration of hands-on session by 30 minutes in the next symposium."</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
