import React from 'react';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
    );
};

export const EventCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[300px]">
            <div className="h-40 bg-gray-100 animate-pulse"></div>
            <div className="p-6 space-y-4">
                <LoadingSkeleton className="h-6 w-3/4" />
                <div className="flex justify-between">
                    <LoadingSkeleton className="h-4 w-1/4" />
                    <LoadingSkeleton className="h-4 w-1/4" />
                </div>
                <div className="pt-4 border-t">
                    <LoadingSkeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
    );
};
