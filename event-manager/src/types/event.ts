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

export interface Venue {
    id: string;
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
    capacity: number;
    status: 'potential' | 'contacted' | 'visited' | 'booked' | 'rejected';
    cost: number;
    notes?: string;
}

export interface Vendor {
    id: string;
    name: string;
    category: string;
    contactPerson: string;
    email: string;
    phone: string;
    status: 'potential' | 'contacted' | 'booked' | 'rejected';
    cost: number;
    notes?: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    status: 'confirmed' | 'pending';
    notes?: string;
}

export interface Guest {
    id: string;
    name: string;
    email: string;
    status: 'invited' | 'registered' | 'attended' | 'cancelled';
    group?: string; // e.g., VIP, Speaker
    plusOne: boolean;
    dietaryNotes?: string;
}

export interface Risk {
    id: string;
    title: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigationPlan: string;
    status: 'open' | 'mitigated' | 'occurred';
}

export interface ChecklistItem {
    id: string;
    task: string;
    time?: string;
    assignee?: string;
    isCompleted: boolean;
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
    venues: Venue[];
    vendors: Vendor[];
    staff: Staff[];
    guests: Guest[];
    risks: Risk[];
    dayOfChecklist: ChecklistItem[];
    guestCount: {
        estimated: number;
        confirmed: number;
    };
    createdAt: string;
    updatedAt: string;
}
