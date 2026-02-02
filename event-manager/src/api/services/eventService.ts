import type { AppEvent } from '../../types/event';

const STORAGE_KEY = 'event-manager-db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
    async getEvents(): Promise<AppEvent[]> {
        await delay(800);
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    async getEventById(id: string): Promise<AppEvent | null> {
        await delay(500);
        const events = await this.getEvents();
        return events.find(e => e.id === id) || null;
    },

    async saveEvents(events: AppEvent[]): Promise<void> {
        await delay(500);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    },

    async addEvent(event: AppEvent): Promise<void> {
        const events = await this.getEvents();
        events.push(event);
        await this.saveEvents(events);
    },

    async updateEvent(id: string, updates: Partial<AppEvent>): Promise<AppEvent> {
        const events = await this.getEvents();
        const index = events.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Event not found');

        events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
        await this.saveEvents(events);
        return events[index];
    },

    async deleteEvent(id: string): Promise<void> {
        const events = await this.getEvents();
        const filtered = events.filter(e => e.id !== id);
        await this.saveEvents(filtered);
    }
};
