import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, Phone, Mail, User, Tag } from 'lucide-react';
import type { AppEvent, Vendor } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const vendorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    phone: z.string().min(1, 'Phone is required'),
    cost: z.coerce.number().min(0).optional(),
    status: z.enum(['potential', 'contacted', 'booked', 'rejected']),
    notes: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

export const EventVendors: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addVendor, updateVendor, deleteVendor } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            name: '',
            category: '',
            contactPerson: '',
            email: '',
            phone: '',
            cost: 0,
            status: 'potential',
            notes: '',
        },
    });

    const openAddModal = () => {
        setEditingVendor(null);
        reset({
            name: '',
            category: '',
            contactPerson: '',
            email: '',
            phone: '',
            cost: 0,
            status: 'potential',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (vendor: Vendor) => {
        setEditingVendor(vendor);
        reset({
            name: vendor.name,
            category: vendor.category,
            contactPerson: vendor.contactPerson,
            email: vendor.email,
            phone: vendor.phone,
            cost: vendor.cost || 0,
            status: vendor.status,
            notes: vendor.notes || '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: VendorFormData) => {
        const vendorData = { ...data, cost: data.cost || 0 };
        if (editingVendor) {
            updateVendor(event.id, editingVendor.id, vendorData);
        } else {
            addVendor(event.id, {
                id: uuidv4(),
                ...vendorData,
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Vendor Management</h2>
                <Button onClick={openAddModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Vendor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(event.vendors || []).length === 0 ? (
                    <div className="col-span-full">
                        <Card className="p-8 text-center text-gray-500">
                            No vendors added yet. Record your catering, photography, and other service providers here.
                        </Card>
                    </div>
                ) : (
                    (event.vendors || []).map((vendor) => (
                        <Card key={vendor.id} className="relative group overflow-hidden border-t-4 border-indigo-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
                                    <div className="flex items-center text-sm text-indigo-600 font-medium mt-1">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {vendor.category}
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => openEditModal(vendor)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteVendor(event.id, vendor.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    {vendor.contactPerson}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                    {vendor.phone}
                                </div>
                                {vendor.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        {vendor.email}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                  ${vendor.status === 'booked' ? 'bg-green-100 text-green-800' :
                                        vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                    {vendor.status}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    ${(vendor.cost || 0).toLocaleString()}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Vendor Name"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="e.g., Delicious Catering Co."
                    />
                    <Input
                        label="Category"
                        {...register('category')}
                        error={errors.category?.message}
                        placeholder="e.g., Catering, Photography"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Contact Person"
                            {...register('contactPerson')}
                            error={errors.contactPerson?.message}
                        />
                        <Input
                            label="Phone"
                            {...register('phone')}
                            error={errors.phone?.message}
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Cost ($)"
                            type="number"
                            {...register('cost')}
                            error={errors.cost?.message}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="potential">Potential</option>
                                <option value="contacted">Contacted</option>
                                <option value="booked">Booked</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            {...register('notes')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingVendor ? 'Update' : 'Add'} Vendor
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
