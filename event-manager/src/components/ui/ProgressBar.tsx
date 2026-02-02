import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProgressBarProps {
    value: number;
    max: number;
    className?: string;
    showLabel?: boolean;
    label?: string;
    color?: 'indigo' | 'green' | 'red' | 'yellow';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max,
    className,
    showLabel = false,
    label,
    color = 'indigo',
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colors = {
        indigo: 'bg-indigo-600',
        green: 'bg-green-600',
        red: 'bg-red-600',
        yellow: 'bg-yellow-500',
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{label}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={cn('h-2.5 rounded-full transition-all duration-500', colors[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
