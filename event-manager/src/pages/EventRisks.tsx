import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AlertTriangle, Trash2, Edit2, ShieldAlert, ShieldCheck, Flag } from 'lucide-react';
import type { AppEvent, Risk } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const riskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    probability: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    mitigationPlan: z.string().min(1, 'Mitigation plan is required'),
    status: z.enum(['open', 'mitigated', 'occurred']),
});

type RiskFormData = z.infer<typeof riskSchema>;

export const EventRisks: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addRisk, updateRisk, deleteRisk } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(riskSchema),
        defaultValues: {
            title: '',
            probability: 'low' as const,
            impact: 'low' as const,
            mitigationPlan: '',
            status: 'open' as const,
        },
    });

    const openAddModal = () => {
        setEditingRisk(null);
        reset({
            title: '',
            probability: 'low',
            impact: 'low',
            mitigationPlan: '',
            status: 'open',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (risk: Risk) => {
        setEditingRisk(risk);
        reset({
            title: risk.title,
            probability: risk.probability,
            impact: risk.impact,
            mitigationPlan: risk.mitigationPlan,
            status: risk.status,
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: RiskFormData) => {
        if (editingRisk) {
            updateRisk(event.id, editingRisk.id, data);
        } else {
            addRisk(event.id, {
                id: uuidv4(),
                ...data,
            });
        }
        setIsModalOpen(false);
    };

    const badgeColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    const statusIcons = {
        open: <ShieldAlert className="h-5 w-5 text-red-500" />,
        mitigated: <ShieldCheck className="h-5 w-5 text-green-500" />,
        occurred: <Flag className="h-5 w-5 text-red-600" />,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Risk Register</h2>
                <Button onClick={openAddModal}>
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Log Risk
                </Button>
            </div>

            <div className="space-y-4">
                {(event.risks || []).length === 0 ? (
                    <Card className="p-8 text-center text-gray-500">
                        No risks logged yet. Proactive risk management is key to event success!
                    </Card>
                ) : (
                    (event.risks || []).map((risk) => (
                        <Card key={risk.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center space-x-3">
                                        {statusIcons[risk.status]}
                                        <h3 className="text-lg font-bold text-gray-900">{risk.title}</h3>
                                    </div>

                                    <div className="flex space-x-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${badgeColors[risk.probability]}`}>
                                            Prob: {risk.probability}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${badgeColors[risk.impact]}`}>
                                            Impact: {risk.impact}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Mitigation Plan</p>
                                        <p className="text-sm text-gray-700">{risk.mitigationPlan}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button onClick={() => openEditModal(risk)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => deleteRisk(event.id, risk.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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
                title={editingRisk ? 'Edit Risk' : 'Log New Risk'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Risk Title" {...register('title')} error={errors.title?.message} placeholder="e.g., Extreme Weather" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
                            <select {...register('probability')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                            <select {...register('impact')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select {...register('status')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option value="open">Open</option>
                            <option value="mitigated">Mitigated</option>
                            <option value="occurred">Occurred</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mitigation Plan</label>
                        <textarea {...register('mitigationPlan')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" rows={3} placeholder="What steps will we take to prevent or handle this?" />
                        {errors.mitigationPlan && <p className="mt-1 text-xs text-red-600">{errors.mitigationPlan.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingRisk ? 'Update' : 'Log'} Risk</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
