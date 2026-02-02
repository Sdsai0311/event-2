import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, MapPin, Users, DollarSign, ExternalLink } from 'lucide-react';
import type { AppEvent, Venue } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const venueSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    phone: z.string().min(1, 'Phone is required'),
    capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
    cost: z.coerce.number().min(0),
    status: z.enum(['potential', 'contacted', 'visited', 'booked', 'rejected']),
    notes: z.string().optional(),
});

type VenueFormData = z.infer<typeof venueSchema>;

export const EventVenues: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addVenue, updateVenue, deleteVenue } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            name: '',
            address: '',
            contactPerson: '',
            email: '',
            phone: '',
            capacity: 0,
            cost: 0,
            status: 'potential',
            notes: '',
        },
    });

    const openAddModal = () => {
        setEditingVenue(null);
        reset({
            name: '',
            address: '',
            contactPerson: '',
            email: '',
            phone: '',
            capacity: 0,
            cost: 0,
            status: 'potential',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (venue: Venue) => {
        setEditingVenue(venue);
        reset({
            name: venue.name,
            address: venue.address,
            contactPerson: venue.contactPerson,
            email: venue.email,
            phone: venue.phone,
            capacity: venue.capacity,
            cost: venue.cost,
            status: venue.status,
            notes: venue.notes || '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: VenueFormData) => {
        if (editingVenue) {
            updateVenue(event.id, editingVenue.id, data);
        } else {
            addVenue(event.id, {
                id: uuidv4(),
                ...data,
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Venue Management</h2>
                <Button onClick={openAddModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Venue
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {(event.venues || []).length === 0 ? (
                    <Card className="p-8 text-center text-gray-500">
                        No venues added yet. Start by adding potential venues for your event.
                    </Card>
                ) : (
                    (event.venues || []).map((venue) => (
                        <Card key={venue.id} className={`p-6 border-l-4 ${venue.status === 'booked' ? 'border-green-500' :
                                venue.status === 'rejected' ? 'border-red-500' : 'border-indigo-500'
                            }`}>
                            <div className="flex justify-between items-start">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${venue.status === 'booked' ? 'bg-green-100 text-green-800' :
                                                venue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'}`}>
                                            {venue.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-start text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                                            <span>{venue.address}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>Capacity: {venue.capacity}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>Cost: ${venue.cost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{venue.contactPerson}</span>
                                        </div>
                                    </div>

                                    {venue.notes && (
                                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                            {venue.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => openEditModal(venue)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteVenue(event.id, venue.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVenue ? 'Edit Venue' : 'Add Venue'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Venue Name"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="e.g., Grand Ballroom"
                    />
                    <Input
                        label="Address"
                        {...register('address')}
                        error={errors.address?.message}
                        placeholder="123 Event St, City"
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
                            label="Capacity"
                            type="number"
                            {...register('capacity')}
                            error={errors.capacity?.message}
                        />
                        <Input
                            label="Estimated Cost ($)"
                            type="number"
                            {...register('cost')}
                            error={errors.cost?.message}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            {...register('status')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="potential">Potential</option>
                            <option value="contacted">Contacted</option>
                            <option value="visited">Visited</option>
                            <option value="booked">Booked</option>
                            <option value="rejected">Rejected</option>
                        </select>
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
                            {editingVenue ? 'Update' : 'Add'} Venue
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
