import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { AppEvent, BudgetItem } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const budgetItemSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    estimatedCost: z.coerce.number().min(0),
    actualCost: z.coerce.number().min(0),
    paid: z.coerce.number().min(0),
    isPaid: z.boolean(),
});

type BudgetFormData = z.infer<typeof budgetItemSchema>;

export const EventBudget: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addBudgetItem, updateBudgetItem, deleteBudgetItem } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(budgetItemSchema),
        defaultValues: {
            category: '',
            description: '',
            estimatedCost: 0,
            actualCost: 0,
            paid: 0,
            isPaid: false,
        },
    });

    const openAddModal = () => {
        setEditingItem(null);
        reset({
            category: '',
            description: '',
            estimatedCost: 0,
            actualCost: 0,
            paid: 0,
            isPaid: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: BudgetItem) => {
        setEditingItem(item);
        reset({
            category: item.category,
            description: item.description,
            estimatedCost: item.estimatedCost,
            actualCost: item.actualCost,
            paid: item.paid,
            isPaid: item.isPaid,
        });
        setIsModalOpen(true);
    };

    const onSubmit = (data: BudgetFormData) => {
        const itemData = {
            category: data.category,
            description: data.description,
            estimatedCost: data.estimatedCost,
            actualCost: data.actualCost,
            paid: data.paid,
            isPaid: data.isPaid,
        };

        if (editingItem) {
            updateBudgetItem(event.id, editingItem.id, itemData);
        } else {
            addBudgetItem(event.id, {
                id: uuidv4(),
                ...itemData,
            });
        }
        setIsModalOpen(false);
    };

    const totalActual = (event.budgetItems || []).reduce((acc, item) => acc + item.actualCost, 0);
    const totalPaid = (event.budgetItems || []).reduce((acc, item) => acc + item.paid, 0);
    const remainingBudget = event.budget.total - totalActual;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Budget Management</h2>
                <Button onClick={openAddModal}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">${event.budget.total.toLocaleString()}</p>
                </Card>
                <Card className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${totalActual.toLocaleString()}</p>
                </Card>
                <Card className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Remaining</p>
                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${remainingBudget.toLocaleString()}
                    </p>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
                <div className="space-y-4">
                    <ProgressBar
                        value={totalActual}
                        max={event.budget.total}
                        showLabel
                        label="Budget Utilization"
                        color={totalActual > event.budget.total ? 'red' : 'indigo'}
                    />
                    <ProgressBar
                        value={totalPaid}
                        max={totalActual || 1} // Avoid division by zero
                        showLabel
                        label="Payment Progress (Paid vs Spent)"
                        color="green"
                    />
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semiboild">Category</th>
                                <th className="px-6 py-4 font-semiboild">Description</th>
                                <th className="px-6 py-4 font-semiboild">Estimated</th>
                                <th className="px-6 py-4 font-semiboild">Actual</th>
                                <th className="px-6 py-4 font-semiboild">Paid</th>
                                <th className="px-6 py-4 font-semiboild">Status</th>
                                <th className="px-6 py-4 font-semiboild">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(event.budgetItems || []).length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No expenses recorded yet. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                (event.budgetItems || []).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.description}</td>
                                        <td className="px-6 py-4 text-gray-600">${item.estimatedCost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">${item.actualCost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-green-600">${item.paid.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${item.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBudgetItem(event.id, item.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                >
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
                title={editingItem ? 'Edit Expense' : 'Add Expense'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Category"
                        {...register('category')}
                        error={errors.category?.message}
                        placeholder="e.g., Venue, Catering"
                    />
                    <Input
                        label="Description"
                        {...register('description')}
                        error={errors.description?.message}
                        placeholder="e.g., Main Hall Deposit"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Estimated Cost"
                            type="number"
                            {...register('estimatedCost')}
                            error={errors.estimatedCost?.message}
                        />
                        <Input
                            label="Actual Cost"
                            type="number"
                            {...register('actualCost')}
                            error={errors.actualCost?.message}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Paid Amount"
                            type="number"
                            {...register('paid')}
                            error={errors.paid?.message}
                        />
                        <div className="flex items-center pt-8">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isPaid')}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="text-sm font-medium text-gray-700">Fully Paid</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingItem ? 'Update' : 'Add'} Expense
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
