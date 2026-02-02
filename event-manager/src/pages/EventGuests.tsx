import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit2, UserPlus, Users, CheckCircle2, Clock } from 'lucide-react';
import type { AppEvent, Guest } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { GoogleContactsImport } from '../components/google/GoogleContactsImport';

const guestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    status: z.enum(['invited', 'registered', 'attended', 'cancelled']),
    group: z.string().optional(),
    plusOne: z.boolean(),
    dietaryNotes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;

export const EventGuests: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addGuest, updateGuest, deleteGuest } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

    interface Contact {
        name: string;
        email: string;
    }

    const handleGoogleImport = (contacts: Contact[]) => {
        contacts.forEach(contact => {
            addGuest(event.id, {
                id: uuidv4(),
                name: contact.name,
                email: contact.email,
                status: 'invited',
                plusOne: false,
            });
        });
    };

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
            status: 'invited',
            group: '',
            plusOne: false,
            dietaryNotes: '',
        },
    });

    const openAddModal = () => {
        setEditingGuest(null);
        reset({
            name: '',
            email: '',
            status: 'invited',
            group: '',
            plusOne: false,
            dietaryNotes: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (guest: Guest) => {
        setEditingGuest(guest);
        reset({
            name: guest.name,
            email: guest.email,
            status: guest.status,
            group: guest.group || '',
            plusOne: guest.plusOne,
            dietaryNotes: guest.dietaryNotes || '',
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

    const statusColors = {
        invited: 'bg-blue-100 text-blue-800',
        registered: 'bg-green-100 text-green-800',
        attended: 'bg-indigo-100 text-indigo-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const stats = {
        total: (event.guests || []).length,
        confirmed: (event.guests || []).filter(g => g.status === 'registered' || g.status === 'attended').length,
        pending: (event.guests || []).filter(g => g.status === 'invited').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Guest Management</h2>
                <div className="flex space-x-2">
                    <GoogleContactsImport onImport={handleGoogleImport} />
                    <Button onClick={openAddModal}>
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Guest
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Invited</p>
                        <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Confirmed</p>
                        <p className="text-xl font-bold text-gray-900">{stats.confirmed}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Group</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Plus One</th>
                                <th className="px-6 py-4 font-semibold">Dietary</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(event.guests || []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Your guest list is empty.
                                    </td>
                                </tr>
                            ) : (
                                (event.guests || []).map((guest) => (
                                    <tr key={guest.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{guest.name}</p>
                                            <p className="text-gray-500 text-xs">{guest.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {guest.group ? (
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                    {guest.group}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[guest.status]}`}>
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {guest.plusOne ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {guest.dietaryNotes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => openEditModal(guest)} className="p-1 text-gray-400 hover:text-indigo-600">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => deleteGuest(event.id, guest.id)} className="p-1 text-gray-400 hover:text-red-600">
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
                title={editingGuest ? 'Edit Guest' : 'Add Guest'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Full Name" {...register('name')} error={errors.name?.message} />
                    <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select {...register('status')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="invited">Invited</option>
                                <option value="registered">Registered</option>
                                <option value="attended">Attended</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <Input label="Group (optional)" {...register('group')} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" {...register('plusOne')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm text-gray-700 font-medium">Allow Plus One</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Requirements</label>
                        <textarea {...register('dietaryNotes')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" rows={2} />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingGuest ? 'Update' : 'Add'} Guest</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
