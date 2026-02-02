import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle2, Circle, Clock, Trash2, Zap } from 'lucide-react';
import type { AppEvent, ChecklistItem } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const EventDayOf: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addChecklistItem, updateChecklistItem, deleteChecklistItem } = useEventStore();
    const [newTask, setNewTask] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        addChecklistItem(event.id, {
            id: uuidv4(),
            task: newTask.trim(),
            isCompleted: false,
        });
        setNewTask('');
    };

    const toggleTask = (item: ChecklistItem) => {
        updateChecklistItem(event.id, item.id, { isCompleted: !item.isCompleted });
    };

    const completedCount = (event.dayOfChecklist || []).filter(i => i.isCompleted).length;
    const totalCount = (event.dayOfChecklist || []).length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Zap className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" />
                    Day of Event Dashboard
                </h2>
                <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
                    {new Date().toLocaleDateString() === new Date(event.date).toLocaleDateString()
                        ? '🚀 EVENT DAY'
                        : `Starts in ${Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold">Preparation Progress</h3>
                        <span className="text-2xl font-black text-indigo-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{completedCount} of {totalCount} tasks completed</p>
                </Card>

                <Card className="p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Upcoming Milestone</h3>
                    {(event.timelineItems || []).length > 0 ? (
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {event.timelineItems.find(t => t.time > new Date().toLocaleTimeString([], { hour12: false }))?.title || 'No more scheduled activities'}
                            </p>
                            <div className="flex items-center text-indigo-600 mt-1">
                                <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                                {event.timelineItems.find(t => t.time > new Date().toLocaleTimeString([], { hour12: false }))?.time || '-'}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Timeline not configured</p>
                    )}
                </Card>
            </div>

            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Real-Time Checklist</h3>
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a quick task..."
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <Button type="submit">Add</Button>
                    </form>

                    <div className="space-y-2">
                        {(event.dayOfChecklist || []).length === 0 ? (
                            <p className="text-center py-8 text-gray-500">Add tasks to track your live event progress.</p>
                        ) : (
                            (event.dayOfChecklist || []).map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${item.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 shadow-sm hover:border-indigo-200'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => toggleTask(item)}
                                            className={`transition-colors ${item.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-indigo-400'}`}
                                        >
                                            {item.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                        </button>
                                        <span className={`text-sm font-medium ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                            {item.task}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteChecklistItem(event.id, item.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
