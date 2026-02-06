import type { AppEvent } from '../../types/event';

const STORAGE_KEY = 'event-manager-db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
    async getEvents(): Promise<AppEvent[]> {
        await delay(800);
        const data = localStorage.getItem(STORAGE_KEY);
        const events = data ? JSON.parse(data) : [];

        if (events.length > 0) return events;

        // Comprehensive Mock data for initial setup
        const mockEvents: AppEvent[] = [
            {
                id: '1',
                title: 'TechXplore 2026: Annual Symposium',
                category: 'technical-symposium',
                eventType: 'technical-symposium',
                department: 'CSE & IT',
                date: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
                time: '09:30 AM',
                location: 'Main Auditorium',
                description: 'A platform for students to showcase their technical prowess through project expos, paper presentations, and coding contests.',
                objectives: 'Foster technical innovation and competitive spirit.',
                outcomes: 'Exposure to latest trends and peer-to-peer learning.',
                facultyCoordinator: 'Dr. Robert Miller',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 150000, spent: 45000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 1200, confirmed: 450 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Modern AI with PyTorch Workshop',
                category: 'workshop',
                eventType: 'workshop',
                department: 'Computer Science',
                date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                time: '11:00 AM',
                location: 'Seminar Hall 2',
                description: 'Hands-on training session on building neural networks using PyTorch, covering basics to advanced architectures.',
                objectives: 'Practical understanding of Deep Learning frameworks.',
                outcomes: 'Certification and hands-on project experience.',
                facultyCoordinator: 'Prof. Anitha Raj',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 25000, spent: 5000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 60, confirmed: 58 },
                registrationDeadline: new Date(Date.now() + 86400000 * 1).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Rythm 2026: Cultural Extravaganza',
                category: 'cultural-fest',
                eventType: 'cultural-fest',
                department: 'Arts & Music Club',
                date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
                time: '05:00 PM',
                location: 'Open Air Theatre',
                description: 'The biggest cultural festival of the year featuring music, dance, fashion shows, and celebrity guest performances.',
                objectives: 'Provide a platform for creative expression.',
                outcomes: 'Cultural awareness and talent recognition.',
                facultyCoordinator: 'Dr. Sarah Wilson',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 500000, spent: 120000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 3000, confirmed: 150 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '4',
                title: 'Inter-College Sports Meet',
                category: 'sports-meet',
                eventType: 'sports-meet',
                department: 'Physical Education',
                date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
                time: '08:00 AM',
                location: 'College Sports Grounds',
                description: 'Competitive events in Athletics, Football, Basketball, and Volleyball with teams from across the state.',
                objectives: 'Promote physical fitness and sportsmanship.',
                outcomes: 'Healthy competition and discipline.',
                facultyCoordinator: 'Coach Michael Vance',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 200000, spent: 35000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 800, confirmed: 320 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '5',
                title: 'Startup Launchpad: Hackathon',
                category: 'hackathon',
                eventType: 'hackathon',
                department: 'Entrepreneurship Cell',
                date: new Date().toISOString().split('T')[0], // Today
                time: '09:00 AM',
                location: 'Innovation Hub',
                description: 'A 24-hour sprint to build innovative solutions for sustainable energy and smart city challenges.',
                objectives: 'Encourage students to build real-world solutions.',
                outcomes: 'Prototypes, mentorship, and potential funding.',
                facultyCoordinator: 'Prof. David Chen',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 75000, spent: 65000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 120, confirmed: 115 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '6',
                title: 'Career Paths in 2026',
                category: 'seminar',
                eventType: 'seminar',
                department: 'Placement Cell',
                date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                time: '02:00 PM',
                location: 'Conference Hall A',
                description: 'Expert panel discussion on emerging career opportunities in AI, Sustainability, and Fintech.',
                objectives: 'Guide students on career choices.',
                outcomes: 'Clarity on industry expectations.',
                facultyCoordinator: 'Mrs. Emily Parker',
                status: 'confirmed',
                isApproved: true,
                budget: { total: 10000, spent: 2000 },
                budgetItems: [],
                timelineItems: [],
                venues: [],
                vendors: [],
                staff: [],
                guests: [],
                risks: [],
                dayOfChecklist: [],
                guestCount: { estimated: 200, confirmed: 85 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
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
