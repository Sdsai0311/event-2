import type { AppEvent } from '../../types/event';

/**
 * Service to handle Google Calendar and Maps integrations
 */

export interface GoogleCalendarEvent {
    summary: string;
    description: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    location?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const googleService = {
    /**
     * Syncs an event to Google Calendar.
     * In a real implementation, this would use the access token from Google OAuth
     * and call the Google Calendar API.
     */
    async syncToCalendar(event: AppEvent, accessToken: string | null): Promise<{ success: boolean; message: string }> {
        await delay(1500); // Simulate network latency

        if (!accessToken) {
            // Mock success if no token is provided but we're in "mock mode"
            console.log('Mocking Google Calendar Sync for:', event.title);
            return {
                success: true,
                message: 'Event synced to Google Calendar (Mock Mode)'
            };
        }

        try {
            // Real implementation would look like this:
            /*
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                summary: event.title,
                description: event.description,
                start: {
                  dateTime: new Date(event.startDate).toISOString(),
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                  dateTime: new Date(event.endDate).toISOString(),
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                location: event.location,
              }),
            });
            
            if (!response.ok) throw new Error('Failed to sync with Google Calendar');
            return { success: true, message: 'Event successfully synced to Google Calendar!' };
            */

            return { success: true, message: 'Event synced to Google Calendar' };
        } catch (error) {
            console.error('Google Calendar Error:', error);
            return { success: false, message: 'Failed to sync with Google Calendar' };
        }
    },

    /**
     * Fetches location suggestions using Google Places API (Mocked environment)
     */
    async getPlaceSuggestions(query: string): Promise<string[]> {
        if (!query) return [];

        // Simulate API call
        await delay(300);

        const mocks = [
            '1600 Amphitheatre Parkway, Mountain View, CA',
            'Times Square, Manhattan, NY 10036',
            'The White House, 1600 Pennsylvania Avenue NW, Washington, DC',
            'Eiffel Tower, Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
            'Opera House, Bennelong Point, Sydney NSW 2000, Australia'
        ];

        return mocks.filter(m => m.toLowerCase().includes(query.toLowerCase()));
    }
};
