import { create } from 'zustand';
import { eventService } from '../api/services/eventService';
import type { AppEvent, BudgetItem, TimelineItem, Venue, Vendor, Staff, Guest, Risk, ChecklistItem } from '../types/event';

interface EventState {
    events: AppEvent[];
    isLoading: boolean;
    error: string | null;

    // Core Actions
    fetchEvents: () => Promise<void>;
    addEvent: (event: AppEvent) => Promise<void>;
    updateEvent: (id: string, updates: Partial<AppEvent>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    getEvent: (id: string) => AppEvent | undefined;

    // Sub-item Actions
    syncEvent: (eventId: string) => Promise<void>;

    addBudgetItem: (eventId: string, item: BudgetItem) => void;
    updateBudgetItem: (eventId: string, itemId: string, item: Partial<BudgetItem>) => void;
    deleteBudgetItem: (eventId: string, itemId: string) => void;

    addTimelineItem: (eventId: string, item: TimelineItem) => void;
    updateTimelineItem: (eventId: string, itemId: string, item: Partial<TimelineItem>) => void;
    deleteTimelineItem: (eventId: string, itemId: string) => void;

    addVenue: (eventId: string, venue: Venue) => void;
    updateVenue: (eventId: string, venueId: string, venue: Partial<Venue>) => void;
    deleteVenue: (eventId: string, venueId: string) => void;

    addVendor: (eventId: string, vendor: Vendor) => void;
    updateVendor: (eventId: string, vendorId: string, vendor: Partial<Vendor>) => void;
    deleteVendor: (eventId: string, vendorId: string) => void;

    addStaff: (eventId: string, staff: Staff) => void;
    updateStaff: (eventId: string, staffId: string, staff: Partial<Staff>) => void;
    deleteStaff: (eventId: string, staffId: string) => void;

    addGuest: (eventId: string, guest: Guest) => void;
    updateGuest: (eventId: string, guestId: string, guest: Partial<Guest>) => void;
    deleteGuest: (eventId: string, guestId: string) => void;

    addRisk: (eventId: string, risk: Risk) => void;
    updateRisk: (eventId: string, riskId: string, risk: Partial<Risk>) => void;
    deleteRisk: (eventId: string, riskId: string) => void;

    addChecklistItem: (eventId: string, item: ChecklistItem) => void;
    updateChecklistItem: (eventId: string, itemId: string, item: Partial<ChecklistItem>) => void;
    deleteChecklistItem: (eventId: string, itemId: string) => void;

    // Internal helper (not in interface to avoid exposure)
    _updateLocalAndSync: (eventId: string, eventUpdateFn: (event: AppEvent) => AppEvent) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    isLoading: false,
    error: null,

    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const events = await eventService.getEvents();
            set({ events, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch events', isLoading: false });
        }
    },

    addEvent: async (event: AppEvent) => {
        set({ isLoading: true });
        try {
            await eventService.addEvent(event);
            set((state) => ({ events: [...state.events, event], isLoading: false }));
        } catch (error) {
            set({ error: 'Failed to add event', isLoading: false });
        }
    },

    updateEvent: async (id: string, updates: Partial<AppEvent>) => {
        try {
            const updated = await eventService.updateEvent(id, updates);
            set((state) => ({
                events: state.events.map(e => e.id === id ? updated : e)
            }));
        } catch (error) {
            set({ error: 'Failed to update event' });
        }
    },

    deleteEvent: async (id: string) => {
        try {
            await eventService.deleteEvent(id);
            set((state) => ({
                events: state.events.filter(e => e.id !== id)
            }));
        } catch (error) {
            set({ error: 'Failed to delete event' });
        }
    },

    getEvent: (id: string) => {
        return get().events.find(e => e.id === id);
    },

    syncEvent: async (eventId: string) => {
        const event = get().events.find(e => e.id === eventId);
        if (event) {
            await eventService.updateEvent(eventId, event);
        }
    },

    _updateLocalAndSync: (eventId: string, eventUpdateFn: (event: AppEvent) => AppEvent) => {
        set((state) => ({
            events: state.events.map((event) =>
                event.id === eventId ? eventUpdateFn(event) : event
            )
        }));
        get().syncEvent(eventId);
    },

    addBudgetItem: (eventId: string, item: BudgetItem) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const budgetItems = [...(event.budgetItems || []), item];
        const spent = budgetItems.reduce((acc: number, curr: BudgetItem) => acc + (curr.paid ? curr.actualCost : 0), 0);
        return { ...event, budgetItems, budget: { ...event.budget, spent }, updatedAt: new Date().toISOString() };
    }),

    updateBudgetItem: (eventId: string, itemId: string, updatedItem: Partial<BudgetItem>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const budgetItems = (event.budgetItems || []).map((i: BudgetItem) => i.id === itemId ? { ...i, ...updatedItem } : i);
        const spent = budgetItems.reduce((acc: number, curr: BudgetItem) => acc + (curr.paid ? curr.actualCost : 0), 0);
        return { ...event, budgetItems, budget: { ...event.budget, spent }, updatedAt: new Date().toISOString() };
    }),

    deleteBudgetItem: (eventId: string, itemId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const budgetItems = (event.budgetItems || []).filter((i: BudgetItem) => i.id !== itemId);
        const spent = budgetItems.reduce((acc: number, curr: BudgetItem) => acc + (curr.paid ? curr.actualCost : 0), 0);
        return { ...event, budgetItems, budget: { ...event.budget, spent }, updatedAt: new Date().toISOString() };
    }),

    addTimelineItem: (eventId: string, item: TimelineItem) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event,
        timelineItems: [...(event.timelineItems || []), item].sort((a: TimelineItem, b: TimelineItem) => a.time.localeCompare(b.time)),
        updatedAt: new Date().toISOString()
    })),

    updateTimelineItem: (eventId: string, itemId: string, updatedItem: Partial<TimelineItem>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event,
        timelineItems: (event.timelineItems || []).map((i: TimelineItem) => i.id === itemId ? { ...i, ...updatedItem } : i).sort((a: TimelineItem, b: TimelineItem) => a.time.localeCompare(b.time)),
        updatedAt: new Date().toISOString()
    })),

    deleteTimelineItem: (eventId: string, itemId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event,
        timelineItems: (event.timelineItems || []).filter((i: TimelineItem) => i.id !== itemId),
        updatedAt: new Date().toISOString()
    })),

    addVenue: (eventId: string, venue: Venue) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, venues: [...(event.venues || []), venue], updatedAt: new Date().toISOString()
    })),
    updateVenue: (eventId: string, venueId: string, updatedVenue: Partial<Venue>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, venues: (event.venues || []).map((v: Venue) => v.id === venueId ? { ...v, ...updatedVenue } : v), updatedAt: new Date().toISOString()
    })),
    deleteVenue: (eventId: string, venueId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, venues: (event.venues || []).filter((v: Venue) => v.id !== venueId), updatedAt: new Date().toISOString()
    })),

    addVendor: (eventId: string, vendor: Vendor) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, vendors: [...(event.vendors || []), vendor], updatedAt: new Date().toISOString()
    })),
    updateVendor: (eventId: string, vendorId: string, updatedVendor: Partial<Vendor>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, vendors: (event.vendors || []).map((v: Vendor) => v.id === vendorId ? { ...v, ...updatedVendor } : v), updatedAt: new Date().toISOString()
    })),
    deleteVendor: (eventId: string, vendorId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, vendors: (event.vendors || []).filter((v: Vendor) => v.id !== vendorId), updatedAt: new Date().toISOString()
    })),

    addStaff: (eventId: string, staff: Staff) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, staff: [...(event.staff || []), staff], updatedAt: new Date().toISOString()
    })),
    updateStaff: (eventId: string, staffId: string, updatedStaff: Partial<Staff>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, staff: (event.staff || []).map((s: Staff) => s.id === staffId ? { ...s, ...updatedStaff } : s), updatedAt: new Date().toISOString()
    })),
    deleteStaff: (eventId: string, staffId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, staff: (event.staff || []).filter((s: Staff) => s.id !== staffId), updatedAt: new Date().toISOString()
    })),

    addGuest: (eventId: string, guest: Guest) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const guests = [...(event.guests || []), guest];
        const confirmed = guests.filter((g: Guest) => g.status === 'registered' || g.status === 'attended').length;
        return { ...event, guests, guestCount: { ...event.guestCount, confirmed }, updatedAt: new Date().toISOString() };
    }),
    updateGuest: (eventId: string, guestId: string, updatedGuest: Partial<Guest>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const guests = (event.guests || []).map((g: Guest) => g.id === guestId ? { ...g, ...updatedGuest } : g);
        const confirmed = guests.filter((g: Guest) => g.status === 'registered' || g.status === 'attended').length;
        return { ...event, guests, guestCount: { ...event.guestCount, confirmed }, updatedAt: new Date().toISOString() };
    }),
    deleteGuest: (eventId: string, guestId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => {
        const guests = (event.guests || []).filter((g: Guest) => g.id !== guestId);
        const confirmed = guests.filter((g: Guest) => g.status === 'registered' || g.status === 'attended').length;
        return { ...event, guests, guestCount: { ...event.guestCount, confirmed }, updatedAt: new Date().toISOString() };
    }),

    addRisk: (eventId: string, risk: Risk) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, risks: [...(event.risks || []), risk], updatedAt: new Date().toISOString()
    })),
    updateRisk: (eventId: string, riskId: string, updatedRisk: Partial<Risk>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, risks: (event.risks || []).map((r: Risk) => r.id === riskId ? { ...r, ...updatedRisk } : r), updatedAt: new Date().toISOString()
    })),
    deleteRisk: (eventId: string, riskId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, risks: (event.risks || []).filter((r: Risk) => r.id !== riskId), updatedAt: new Date().toISOString()
    })),

    addChecklistItem: (eventId: string, item: ChecklistItem) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, dayOfChecklist: [...(event.dayOfChecklist || []), item], updatedAt: new Date().toISOString()
    })),
    updateChecklistItem: (eventId: string, itemId: string, updatedItem: Partial<ChecklistItem>) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, dayOfChecklist: (event.dayOfChecklist || []).map((i: ChecklistItem) => i.id === itemId ? { ...i, ...updatedItem } : i), updatedAt: new Date().toISOString()
    })),
    deleteChecklistItem: (eventId: string, itemId: string) => get()._updateLocalAndSync(eventId, (event: AppEvent) => ({
        ...event, dayOfChecklist: (event.dayOfChecklist || []).filter((i: ChecklistItem) => i.id !== itemId), updatedAt: new Date().toISOString()
    })),
}));
