import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, Clock, User } from 'lucide-react';
import type { AppEvent, TimelineItem } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const timelineItemSchema = z.object({
    time: z.string().min(1, 'Time is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    duration: z.coerce.number().min(0, 'Duration must be positive'),
    assignee: z.string().optional(),
});

type TimelineFormData = z.infer<typeof timelineItemSchema>;

export const EventTimeline: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addTimelineItem, updateTimelineItem, deleteTimelineItem } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(timelineItemSchema),
        defaultValues: {
            time: '',
            title: '',
            description: '',
            duration: 30,
            assignee: '',
        },
    });

    const openAddModal = () => {
        setEditingItem(null);
        reset({
            time: '',
            title: '',
            description: '',
            duration: 30,
            assignee: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: TimelineItem) => {
        setEditingItem(item);
        reset({
            time: item.time,
            title: item.title,
            description: item.description,
            duration: item.duration,
            assignee: item.assignee,
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: TimelineFormData) => {
        const itemData = {
            time: data.time,
            title: data.title,
            description: data.description || '',
            duration: data.duration,
            assignee: data.assignee,
        };

        if (editingItem) {
            updateTimelineItem(event.id, editingItem.id, itemData);
        } else {
            addTimelineItem(event.id, {
                id: uuidv4(),
                ...itemData,
            });
        }
        setIsModalOpen(false);
    };

    const sortedItems = [...(event.timelineItems || [])].sort((a, b) =>
        a.time.localeCompare(b.time)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Event Timeline</h2>
                <Button onClick={openAddModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Activity
                </Button>
            </div>

            <div className="space-y-4">
                {sortedItems.length === 0 ? (
                    <Card className="p-8 text-center text-gray-500">
                        No timeline items yet. Add scheduled activities to create your run of show.
                    </Card>
                ) : (
                    sortedItems.map((item) => (
                        <Card key={item.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row border-l-4 border-indigo-500">
                                <div className="p-4 sm:p-6 sm:w-48 bg-gray-50 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-100">
                                    <div className="flex items-center text-indigo-700 font-bold text-lg">
                                        <Clock className="h-5 w-5 mr-2" />
                                        {item.time}
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">
                                        {item.duration} minutes
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 flex-1 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600 mt-1">{item.description}</p>
                                        {item.assignee && (
                                            <div className="flex items-center mt-3 text-sm text-gray-500 bg-gray-100 inline-flex px-3 py-1 rounded-full">
                                                <User className="h-3 w-3 mr-2" />
                                                Assignee: {item.assignee}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteTimelineItem(event.id, item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Activity' : 'Add Activity'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Time"
                            type="time"
                            {...register('time')}
                            error={errors.time?.message}
                        />
                        <Input
                            label="Duration (mins)"
                            type="number"
                            {...register('duration')}
                            error={errors.duration?.message}
                        />
                    </div>
                    <Input
                        label="Activity Title"
                        {...register('title')}
                        error={errors.title?.message}
                        placeholder="e.g., Welcome Speech"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Optional details..."
                        />
                    </div>
                    <Input
                        label="Assignee"
                        {...register('assignee')}
                        placeholder="e.g., John Doe"
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingItem ? 'Update' : 'Add'} Activity
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
