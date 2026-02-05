import type { AppEvent, EventStatus } from '../types/event';
import { isBefore, isAfter, parseISO, startOfToday } from 'date-fns';

export const updateEventStatuses = (events: AppEvent[]): AppEvent[] => {
    const today = startOfToday();

    return events.map(event => {
        // Only automate status for approved events that aren't cancelled or drafts
        if (!event.isApproved || event.status === 'cancelled' || event.status === 'draft') {
            return event;
        }

        const eventDate = parseISO(event.date);
        let newStatus: EventStatus = event.status;

        if (isBefore(eventDate, today)) {
            newStatus = 'completed';
        } else if (isAfter(eventDate, today)) {
            newStatus = 'upcoming';
        } else {
            newStatus = 'ongoing';
        }

        if (newStatus !== event.status) {
            return {
                ...event,
                status: newStatus,
                updatedAt: new Date().toISOString()
            };
        }

        return event;
    });
};

export const simulateEmailNotification = (eventTitle: string) => {
    console.log(`[SIMULATION] Email notification sent to all students about new event: ${eventTitle}`);
};

export const getTimeRemaining = (dateStr: string): string => {
    const today = startOfToday();
    const eventDate = parseISO(dateStr);

    if (isBefore(eventDate, today)) return 'Past Event';

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Happening Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
};
