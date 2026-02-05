import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const styles = {
        success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
        error: 'bg-rose-50 border-rose-100 text-rose-800',
        info: 'bg-indigo-50 border-indigo-100 text-indigo-800',
    };

    const Icons = {
        success: CheckCircle,
        error: XCircle,
        info: CheckCircle,
    };

    const Icon = Icons[type];

    return (
        <div className={`
            fixed bottom-8 right-8 z-[100] flex items-center space-x-3 px-6 py-4 rounded-3xl border shadow-2xl animate-in slide-in-from-right-10 duration-500
            ${styles[type]}
        `}>
            <Icon className="h-5 w-5 shrink-0" />
            <p className="text-sm font-bold tracking-tight">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
