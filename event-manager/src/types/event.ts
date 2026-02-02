export type EventStatus = 'draft' | 'planning' | 'confirmed' | 'past' | 'cancelled';
export type EventType = 'conference' | 'wedding' | 'party' | 'corporate' | 'other';

export interface BudgetItem {
    id: string;
    category: string;
    description: string;
    estimatedCost: number;
    actualCost: number;
    paid: number;
    dueDate?: string;
    isPaid: boolean;
}

export interface TimelineItem {
    id: string;
    time: string;
    title: string;
    description: string;
    duration: number; // in minutes
    assignee?: string;
}

export interface AppEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: EventStatus;
    eventType: EventType;
    budget: {
        total: number;
        spent: number;
    };
    budgetItems: BudgetItem[];
    timelineItems: TimelineItem[];
    guestCount: {
        estimated: number;
        confirmed: number;
    };
    createdAt: string;
    updatedAt: string;
}
