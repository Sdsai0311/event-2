import type { AppEvent } from '../../types/event';

const STORAGE_KEY = 'event-manager-db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
    async getEvents(): Promise<AppEvent[]> {
        await delay(800);
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);

        // Mock data if empty
        const mockEvents: AppEvent[] = [
            {
                id: '1',
                title: 'Annual Tech Symposium 2026',
                category: 'technical-symposium',
                eventType: 'technical-symposium',
                department: 'Computer Science',
                date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
                time: '10:00 AM',
                location: 'Main Auditorium',
                description: 'Join us for the biggest tech event of the year featuring guest speakers from lead tech companies.',
                objectives: 'To showcase innovation and talent in the engineering departments.',
                outcomes: 'Students gain industry exposure and networking opportunities.',
                facultyCoordinator: 'Dr. Sarah Wilson',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 5000, spent: 1200 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 500, confirmed: 124 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Campus Hackathon',
                category: 'hackathon',
                eventType: 'hackathon',
                department: 'IT Department',
                date: new Date().toISOString().split('T')[0], // Today
                time: '09:00 AM',
                location: 'Innovation Lab',
                description: 'A 24-hour coding challenge to solve real-world problems.',
                objectives: 'Encourage collaborative coding and problem solving.',
                outcomes: 'Functional prototypes and potential startup ideas.',
                facultyCoordinator: 'Prof. James Bond',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 2000, spent: 800 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 100, confirmed: 45 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        return mockEvents;
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
