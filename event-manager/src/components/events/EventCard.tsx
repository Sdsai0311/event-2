import React from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { getTimeRemaining } from '../../utils/eventUtils';
import type { AppEvent } from '../../types/event';
import { EVENT_TYPE_LABELS } from '../../types/event';

interface EventCardProps {
    event: AppEvent;
    onClick?: () => void;
    isAdmin?: boolean;
    onApprove?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
    event,
    onClick,
    isAdmin,
    onApprove,
    onDelete
}) => {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'upcoming': return 'info';
            case 'ongoing': return 'success';
            case 'completed': return 'secondary';
            case 'pending-approval': return 'warning';
            default: return 'default';
        }
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'technical-symposium': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'workshop': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cultural-fest': return 'bg-pink-50 text-pink-600 border-pink-100';
            case 'sports-meet': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'hackathon': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'club-activity': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm ring-1 ring-slate-100 flex flex-col h-full">
            {/* Poster Section */}
            <div className="relative h-48 overflow-hidden">
                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-white/50" />
                    </div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant={getStatusVariant(event.status)} className="shadow-lg backdrop-blur-md bg-opacity-90">
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-opacity-80 bg-white/30 text-white border-none font-bold">
                        {getTimeRemaining(event.date)}
                    </Badge>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); alert(`Reminder set for: ${event.title}`); }}
                    className="absolute bottom-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-indigo-500 transition-all border border-white/30 group/bell"
                    title="Set Reminder"
                >
                    <Bell className="h-4 w-4 group-hover/bell:animate-bounce" />
                </button>

                {!event.isApproved && (
                    <div className="absolute top-4 right-4 text-xs font-bold bg-white text-rose-600 px-2 py-1 rounded shadow-sm flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Awaiting Approval
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col" onClick={onClick}>
                <div className="mb-4">
                    <Badge className={`mb-2 font-black uppercase tracking-widest text-[10px] ${getCategoryStyles(event.category)}`}>
                        {EVENT_TYPE_LABELS[event.category]}
                    </Badge>
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-2 font-medium">
                        {event.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="flex items-center text-xs font-bold text-slate-400">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                        {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-400">
                        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                        {event.time}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-400">
                        <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                        {event.location}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-400">
                        <Users className="h-4 w-4 mr-2 text-emerald-500" />
                        {event.guestCount.confirmed} / {event.maxParticipants || '∞'}
                    </div>
                </div>

                {/* Organizer Info */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-black uppercase ring-2 ring-white ring-offset-2">
                            {event.organizerName?.charAt(0) || 'O'}
                        </div>
                        <div className="text-[10px] font-black text-slate-600">
                            <p className="uppercase tracking-widest leading-none mb-0.5">Organizer</p>
                            <p className="text-slate-400 leading-none">{event.department}</p>
                        </div>
                    </div>

                    {event.registrationDeadline && (
                        <div className="text-right">
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none mb-0.5">Deadline</p>
                            <p className="text-[10px] font-bold text-slate-400 leading-none">
                                {new Date(event.registrationDeadline).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    {!event.isApproved && onApprove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onApprove(event.id); }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center"
                        >
                            <CheckCircle2 className="h-3 w-3 mr-2" />
                            Approve
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                            className="px-4 bg-white text-rose-600 border border-red-50 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </Card>
    );
};
