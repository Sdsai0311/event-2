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

    // Venue Actions
    addVenue: (eventId: string, venue: import('../types/event').Venue) => void;
    updateVenue: (eventId: string, venueId: string, venue: Partial<import('../types/event').Venue>) => void;
    deleteVenue: (eventId: string, venueId: string) => void;

    // Vendor Actions
    addVendor: (eventId: string, vendor: import('../types/event').Vendor) => void;
    updateVendor: (eventId: string, vendorId: string, vendor: Partial<import('../types/event').Vendor>) => void;
    deleteVendor: (eventId: string, vendorId: string) => void;

    // Staff Actions
    addStaff: (eventId: string, staff: import('../types/event').Staff) => void;
    updateStaff: (eventId: string, staffId: string, staff: Partial<import('../types/event').Staff>) => void;
    deleteStaff: (eventId: string, staffId: string) => void;

    // Guest Actions
    addGuest: (eventId: string, guest: import('../types/event').Guest) => void;
    updateGuest: (eventId: string, guestId: string, guest: Partial<import('../types/event').Guest>) => void;
    deleteGuest: (eventId: string, guestId: string) => void;

    // Risk Actions
    addRisk: (eventId: string, risk: import('../types/event').Risk) => void;
    updateRisk: (eventId: string, riskId: string, risk: Partial<import('../types/event').Risk>) => void;
    deleteRisk: (eventId: string, riskId: string) => void;

    // Checklist Actions
    addChecklistItem: (eventId: string, item: import('../types/event').ChecklistItem) => void;
    updateChecklistItem: (eventId: string, itemId: string, item: Partial<import('../types/event').ChecklistItem>) => void;
    deleteChecklistItem: (eventId: string, itemId: string) => void;
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

            // Venue Actions
            addVenue: (eventId, venue) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, venues: [...(event.venues || []), venue], updatedAt: new Date().toISOString() }
                        : event
                )
            })),
            updateVenue: (eventId, venueId, updatedVenue) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            venues: (event.venues || []).map((v) => v.id === venueId ? { ...v, ...updatedVenue } : v),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
            deleteVenue: (eventId, venueId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            venues: (event.venues || []).filter((v) => v.id !== venueId),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),

            // Vendor Actions
            addVendor: (eventId, vendor) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, vendors: [...(event.vendors || []), vendor], updatedAt: new Date().toISOString() }
                        : event
                )
            })),
            updateVendor: (eventId, vendorId, updatedVendor) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            vendors: (event.vendors || []).map((v) => v.id === vendorId ? { ...v, ...updatedVendor } : v),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
            deleteVendor: (eventId, vendorId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            vendors: (event.vendors || []).filter((v) => v.id !== vendorId),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),

            // Staff Actions
            addStaff: (eventId, staff) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, staff: [...(event.staff || []), staff], updatedAt: new Date().toISOString() }
                        : event
                )
            })),
            updateStaff: (eventId, staffId, updatedStaff) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            staff: (event.staff || []).map((s) => s.id === staffId ? { ...s, ...updatedStaff } : s),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
            deleteStaff: (eventId, staffId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            staff: (event.staff || []).filter((s) => s.id !== staffId),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),

            // Guest Actions
            addGuest: (eventId, guest) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const guests = [...(event.guests || []), guest];
                    const confirmed = guests.filter(g => g.status === 'registered' || g.status === 'attended').length;
                    return {
                        ...event,
                        guests,
                        guestCount: { ...event.guestCount, confirmed },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),
            updateGuest: (eventId, guestId, updatedGuest) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const guests = (event.guests || []).map(g => g.id === guestId ? { ...g, ...updatedGuest } : g);
                    const confirmed = guests.filter(g => g.status === 'registered' || g.status === 'attended').length;
                    return {
                        ...event,
                        guests,
                        guestCount: { ...event.guestCount, confirmed },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),
            deleteGuest: (eventId, guestId) => set((state) => ({
                events: state.events.map((event) => {
                    if (event.id !== eventId) return event;
                    const guests = (event.guests || []).filter(g => g.id !== guestId);
                    const confirmed = guests.filter(g => g.status === 'registered' || g.status === 'attended').length;
                    return {
                        ...event,
                        guests,
                        guestCount: { ...event.guestCount, confirmed },
                        updatedAt: new Date().toISOString()
                    };
                })
            })),

            // Risk Actions
            addRisk: (eventId, risk) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, risks: [...(event.risks || []), risk], updatedAt: new Date().toISOString() }
                        : event
                )
            })),
            updateRisk: (eventId, riskId, updatedRisk) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            risks: (event.risks || []).map(r => r.id === riskId ? { ...r, ...updatedRisk } : r),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
            deleteRisk: (eventId, riskId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            risks: (event.risks || []).filter(r => r.id !== riskId),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),

            // Checklist Actions
            addChecklistItem: (eventId, item) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, dayOfChecklist: [...(event.dayOfChecklist || []), item], updatedAt: new Date().toISOString() }
                        : event
                )
            })),
            updateChecklistItem: (eventId, itemId, updatedItem) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            dayOfChecklist: (event.dayOfChecklist || []).map(i => i.id === itemId ? { ...i, ...updatedItem } : i),
                            updatedAt: new Date().toISOString()
                        }
                        : event
                )
            })),
            deleteChecklistItem: (eventId, itemId) => set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? {
                            ...event,
                            dayOfChecklist: (event.dayOfChecklist || []).filter(i => i.id !== itemId),
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
