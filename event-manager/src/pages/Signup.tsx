import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            await signup(data.email, data.name);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Signup failed', error);
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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10 border-0">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <Input
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            {...register('password')}
                            error={errors.password?.message}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            autoComplete="new-password"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4"
                                isLoading={isSubmitting}
                            >
                                Register
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    For demo, use any credentials
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
