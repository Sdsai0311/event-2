import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppEvent } from '../types/event';

interface EventState {
    events: AppEvent[];
    isLoading: boolean;
    error: string | null;

    // Actions
    addEvent: (event: AppEvent) => void;
    updateEvent: (id: string, event: Partial<AppEvent>) => void;
    deleteEvent: (id: string) => void;
    getEvent: (id: string) => AppEvent | undefined;

    // Budget Actions
    addBudgetItem: (eventId: string, item: import('../types/event').BudgetItem) => void;
    updateBudgetItem: (eventId: string, itemId: string, item: Partial<import('../types/event').BudgetItem>) => void;
    deleteBudgetItem: (eventId: string, itemId: string) => void;

    // Timeline Actions
    addTimelineItem: (eventId: string, item: import('../types/event').TimelineItem) => void;
    updateTimelineItem: (eventId: string, itemId: string, item: Partial<import('../types/event').TimelineItem>) => void;
    deleteTimelineItem: (eventId: string, itemId: string) => void;
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],
            isLoading: false,
            error: null,

            addEvent: (event) => set((state) => ({
                events: [event, ...state.events]
            })),

            updateEvent: (id, updatedEvent) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === id ? { ...event, ...updatedEvent, updatedAt: new Date().toISOString() } : event
                ),
            })),

            deleteEvent: (id) => set((state) => ({
                events: state.events.filter((event) => event.id !== id),
            })),

            getEvent: (id) => get().events.find((event) => event.id === id),

            addBudgetItem: (eventId, item) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const newBudgetItems = [...(event.budgetItems || []), item];
                    const spent = newBudgetItems.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
                    return {
                        ...event,
                        budgetItems: newBudgetItems,
                        budget: { ...event.budget, spent },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),

            updateBudgetItem: (eventId, itemId, updatedItem) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const newBudgetItems = (event.budgetItems || []).map((item) =>
                        item.id === itemId ? { ...item, ...updatedItem } : item
                    );
                    const spent = newBudgetItems.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
                    return {
                        ...event,
                        budgetItems: newBudgetItems,
                        budget: { ...event.budget, spent },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),

            deleteBudgetItem: (eventId, itemId) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const newBudgetItems = (event.budgetItems || []).filter((item) => item.id !== itemId);
                    const spent = newBudgetItems.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
                    return {
                        ...event,
                        budgetItems: newBudgetItems,
                        budget: { ...event.budget, spent },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),

            addTimelineItem: (eventId, item) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, timelineItems: [...(event.timelineItems || []), item], updatedAt: new Date().toISOString() }
                        : event
                )
            })),

            updateTimelineItem: (eventId, itemId, updatedItem) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            timelineItems: (event.timelineItems || []).map((item) =>
                                item.id === itemId ? { ...item, ...updatedItem } : item
                            ),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),

            deleteTimelineItem: (eventId, itemId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            timelineItems: (event.timelineItems || []).filter((item) => item.id !== itemId),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
        }),
        {
            name: 'event-manager-storage',
        }
    )
);
