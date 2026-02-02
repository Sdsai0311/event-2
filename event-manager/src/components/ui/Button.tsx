import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200/50 focus:ring-indigo-500',
            secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-200',
            outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-100',
            ghost: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-100',
            danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-200/50 focus:ring-rose-500',
            success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200/50 focus:ring-emerald-500',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs font-bold tracking-tight',
            md: 'px-5 py-2.5 text-sm font-bold tracking-tight',
            lg: 'px-8 py-4 text-base font-black tracking-tight',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
