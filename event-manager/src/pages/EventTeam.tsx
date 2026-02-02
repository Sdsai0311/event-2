import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, Phone, Mail, UserCheck, Shield } from 'lucide-react';
import type { AppEvent, Staff } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const staffSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    phone: z.string().min(1, 'Phone is required'),
    status: z.enum(['confirmed', 'pending']),
    notes: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export const EventTeam: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addStaff, updateStaff, deleteStaff } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: '',
            role: '',
            email: '',
            phone: '',
            status: 'pending',
            notes: '',
        },
    });

    const openAddModal = () => {
        setEditingStaff(null);
        reset({
            name: '',
            role: '',
            email: '',
            phone: '',
            status: 'pending',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (staff: Staff) => {
        setEditingStaff(staff);
        reset({
            name: staff.name,
            role: staff.role,
            email: staff.email,
            phone: staff.phone,
            status: staff.status,
            notes: staff.notes || '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: StaffFormData) => {
        if (editingStaff) {
            updateStaff(event.id, editingStaff.id, data);
        } else {
            addStaff(event.id, {
                id: uuidv4(),
                ...data,
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Team Management</h2>
                <Button onClick={openAddModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(event.staff || []).length === 0 ? (
                    <div className="col-span-full">
                        <Card className="p-8 text-center text-gray-500">
                            No team members added yet. Build your event team by adding staff and volunteers.
                        </Card>
                    </div>
                ) : (
                    (event.staff || []).map((member) => (
                        <Card key={member.id} className="group relative">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 truncate">{member.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {member.role}
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => openEditModal(member)}
                                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteStaff(event.id, member.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 px-1">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                    {member.phone}
                                </div>
                                {member.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                        {member.email}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${member.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {member.status === 'confirmed' ? (
                                        <UserCheck className="h-3 w-3 mr-1" />
                                    ) : null}
                                    {member.status}
                                </span>
                            </div>

                            {member.notes && (
                                <div className="mt-3 text-xs text-gray-500 italic truncate">
                                    "{member.notes}"
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStaff ? 'Edit Team Member' : 'Add Team Member'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Role"
                        {...register('role')}
                        error={errors.role?.message}
                        placeholder="e.g., Event Coordinator, Security"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone"
                            {...register('phone')}
                            error={errors.phone?.message}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            {...register('status')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            {...register('notes')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            rows={3}
                            placeholder="Responsibilities, availability, etc."
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingStaff ? 'Update' : 'Add'} Member
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
