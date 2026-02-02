import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { googleService } from '../../api/services/googleService';
import { useAuthStore } from '../../store/authStore';
import { GoogleConnect } from './GoogleConnect';

import type { AppEvent } from '../../types/event';

interface GoogleCalendarSyncProps {
    event: AppEvent;
}

export const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ event }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [synced, setSynced] = useState(false);
    const { googleAccessToken } = useAuthStore();

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await googleService.syncToCalendar(event, googleAccessToken);
            if (result.success) {
                setSynced(true);
                setTimeout(() => setSynced(false), 3000);
            }
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setIsSyncing(false);
        }
    };

    if (!googleAccessToken) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-gray-500">Connect your Google account to sync this event to your calendar.</p>
                <GoogleConnect />
            </div>
        );
    }

    return (
        <Button
            variant={synced ? 'success' : 'outline'}
            onClick={handleSync}
            isLoading={isSyncing}
            disabled={synced}
            className="w-full sm:w-auto"
        >
            {synced ? (
                <>
                    <Check className="h-4 w-4 mr-2" />
                    Synced to Google Calendar
                </>
            ) : (
                <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Sync to Google Calendar
                </>
            )}
        </Button>
    );
};
