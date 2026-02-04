import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit2, UserPlus, Users, CheckCircle2, Clock, Scan, Award, Search } from 'lucide-react';
import type { AppEvent, Guest } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const guestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    registrationId: z.string().min(1, 'Reg ID is required'),
    department: z.string().min(2, 'Department is required'),
    year: z.string().min(1, 'Year is required'),
    status: z.enum(['invited', 'registered', 'attended', 'cancelled']),
    group: z.string().optional(),
    plusOne: z.boolean(),
});

type GuestFormData = z.infer<typeof guestSchema>;

export const EventGuests: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addGuest, updateGuest, deleteGuest } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(guestSchema),
        defaultValues: {
            name: '',
            email: '',
            registrationId: '',
            department: '',
            year: '',
            status: 'registered',
            group: '',
            plusOne: false,
        },
    });

    const openAddModal = () => {
        setEditingGuest(null);
        reset({
            name: '',
            email: '',
            registrationId: `REG-${Math.floor(Math.random() * 10000)}`,
            department: '',
            year: '',
            status: 'registered',
            group: '',
            plusOne: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (guest: Guest) => {
        setEditingGuest(guest);
        reset({
            name: guest.name,
            email: guest.email,
            registrationId: guest.registrationId,
            department: guest.department,
            year: guest.year,
            status: guest.status,
            group: guest.group || '',
            plusOne: guest.plusOne,
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: GuestFormData) => {
        if (editingGuest) {
            updateGuest(event.id, editingGuest.id, data);
        } else {
            addGuest(event.id, {
                id: uuidv4(),
                ...data,
            });
        }
        setIsModalOpen(false);
    };

    const handleCheckIn = (guestId: string) => {
        updateGuest(event.id, guestId, { status: 'attended' });
    };

    const handleGenerateCertificate = (guest: Guest) => {
        alert(`Developing Certificate for ${guest.name} (${guest.registrationId})\nEvent: ${event.title}\nCollege: CampusPro Excellence`);
    };

    const filteredGuests = (event.guests || []).filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: (event.guests || []).length,
        attended: (event.guests || []).filter(g => g.status === 'attended').length,
        pending: (event.guests || []).filter(g => g.status === 'registered').length,
    };

    return (
        <div className="space-y-8 animate-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student <span className="text-indigo-600">Roster</span></h2>
                    <p className="text-slate-500 font-medium">Manage registrations and real-time attendance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => alert("QR Scanner simulation started...")} className="border-indigo-100 text-indigo-600 bg-indigo-50/50">
                        <Scan className="h-5 w-5 mr-2" />
                        Scan QR Code
                    </Button>
                    <Button onClick={openAddModal} className="premium-gradient text-white shadow-lg shadow-indigo-100">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Student
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Registered</p>
                            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Attended</p>
                            <p className="text-2xl font-black text-slate-900">{stats.attended}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Awaiting Check-in</p>
                            <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-0 border-slate-200/60 overflow-hidden bg-white shadow-xl shadow-slate-200/40">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or registration ID..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest w-1/4">Student Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest w-1/6">Dept / Year</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest w-1/6">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-tight">{guest.name}</p>
                                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">{guest.registrationId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-700">{guest.department}</p>
                                            <p className="text-xs text-slate-400 font-medium">{guest.year} Year</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${guest.status === 'attended'
                                                ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                                                : guest.status === 'registered'
                                                    ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                                                    : 'bg-slate-50 text-slate-500 ring-1 ring-slate-100'
                                                }`}>
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {guest.status === 'registered' && (
                                                    <Button size="sm" onClick={() => handleCheckIn(guest.id)} className="bg-slate-900 text-white hover:bg-black text-[10px] uppercase tracking-widest h-9">
                                                        Check-In
                                                    </Button>
                                                )}
                                                {guest.status === 'attended' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleGenerateCertificate(guest)} className="border-emerald-100 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-50 text-[10px] uppercase tracking-widest h-9">
                                                        <Award className="h-3 w-3 mr-1.5" />
                                                        Certificate
                                                    </Button>
                                                )}
                                                <button onClick={() => openEditModal(guest)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => deleteGuest(event.id, guest.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingGuest ? 'Update Student Record' : 'Manual Student Entry'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" {...register('name')} error={errors.name?.message} />
                        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Registration ID" {...register('registrationId')} error={errors.registrationId?.message} />
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Year</label>
                            <select {...register('year')} className="w-full rounded-2xl border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-slate-50">
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <Input label="Department" {...register('department')} error={errors.department?.message} placeholder="e.g., Computer Science" />

                    <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="premium-gradient text-white">{editingGuest ? 'Update' : 'Register Student'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
