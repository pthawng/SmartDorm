import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Github } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login data:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/tenant');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="resident@smartdorm.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-[-8px]">
                <label className="text-sm font-black text-slate-900">Password</label>
                <button
                    type="button"
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    Forgot password?
                </button>
            </div>
            <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
            />
        </div>

        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" 
            />
            <label htmlFor="remember" className="text-sm font-bold text-slate-500">
                Remember me for 30 days
            </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-lg shadow-soft text-sm font-black bg-indigo-600 hover:bg-indigo-700"
          isLoading={isSubmitting}
        >
          Sign in to account
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-white px-4">
          Or continue with
        </div>
      </div>

      <Button variant="outline" className="w-full h-12 border-slate-100 hover:border-slate-200 text-slate-700 font-bold">
           <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
             <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
             <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
             <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
             <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
           </svg>
           Google
      </Button>

      <p className="text-center text-sm font-bold text-slate-500">
        Don't have an account?{' '}
        <button
          className="text-indigo-600 hover:text-indigo-700 transition-colors font-black"
          onClick={() => navigate('/signup')}
        >
          Start your 14-day free trial
        </button>
      </p>

      <div className="flex justify-center gap-6 text-[11px] font-bold text-slate-400 mt-8">
        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
        <a href="#" className="hover:text-slate-600">Terms of Service</a>
        <a href="#" className="hover:text-slate-600">Support</a>
      </div>
    </div>
  );
};
