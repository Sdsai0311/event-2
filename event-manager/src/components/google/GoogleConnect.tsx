import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { LogIn, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export const GoogleConnect: React.FC = () => {
    const { googleAccessToken, setGoogleAccessToken } = useAuthStore();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('Login Success:', tokenResponse);
            setGoogleAccessToken(tokenResponse.access_token);
        },
        onError: () => console.log('Login Failed'),
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/contacts.readonly',
    });

    if (googleAccessToken) {
        return (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Google Account Connected</span>
                <button
                    onClick={() => setGoogleAccessToken(null)}
                    className="text-xs text-green-700 hover:underline ml-2"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            onClick={() => login()}
            className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50 text-gray-700"
        >
            <LogIn className="h-4 w-4" />
            <span>Connect Google Account</span>
        </Button>
    );
};
