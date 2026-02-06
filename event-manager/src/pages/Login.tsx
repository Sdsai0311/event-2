import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, ShieldCheck } from 'lucide-react';
import { useAuthStore, type UserRole } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { clsx } from 'clsx';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    registerNumber: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((state) => state.login);
    const [activeRole, setActiveRole] = useState<UserRole>('student');

    // Get the return URL from location state or default to home
    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Check if register number is provided for students
            if (activeRole === 'student' && !data.registerNumber) {
                alert('Register Number is required for students');
                return;
            }

            // For demo purposes, we use the email as the name for the avatar
            const name = data.email.split('@')[0];
            await login(data.email, name, activeRole, data.registerNumber);
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
                        <Calendar className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-sans">
                    CMS Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Access your college event portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-4 flex p-1 bg-gray-200 rounded-lg">
                    <button
                        onClick={() => setActiveRole('student')}
                        className={clsx(
                            'flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                            activeRole === 'student'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Student
                    </button>
                    <button
                        onClick={() => setActiveRole('admin')}
                        className={clsx(
                            'flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                            activeRole === 'admin'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin
                    </button>
                </div>

                <Card className="py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-0">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {activeRole === 'student' ? 'Student Login' : 'Admin Login'}
                        </h3>
                        <p className="text-sm text-gray-500 leading-tight">
                            {activeRole === 'student'
                                ? 'Use your college email and register number'
                                : 'Official faculty/admin credentials required'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label={activeRole === 'student' ? "College Email ID" : "Official College Email ID"}
                            type="email"
                            placeholder={activeRole === 'student' ? "student@college.edu" : "faculty@college.edu"}
                            autoComplete="email"
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        {activeRole === 'student' && (
                            <Input
                                label="Register Number / Roll Number"
                                type="text"
                                placeholder="e.g. 2021CSE001"
                                {...register('registerNumber')}
                                error={errors.registerNumber?.message}
                            />
                        )}

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...register('password')}
                            error={errors.password?.message}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 font-semibold shadow-md translate-y-0 active:translate-y-px transition-all"
                                isLoading={isSubmitting}
                            >
                                {activeRole === 'student' ? 'Sign in as Student' : 'Sign in as Admin'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 underline decoration-indigo-200 underline-offset-4">
                                Register here
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
