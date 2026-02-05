import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3 text-sm font-bold text-slate-700
                            focus:border-indigo-500 focus:ring-indigo-500 transition-all
                            disabled:bg-gray-50 disabled:text-gray-500
                            ${icon ? 'pl-11 pr-4' : 'px-4'}
                            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-rose-500 font-bold">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
