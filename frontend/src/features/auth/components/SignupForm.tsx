import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserCircle } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['TENANT', 'LANDLORD']),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'TENANT' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    console.log('Signup data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
             <button
               type="button"
               onClick={() => setValue('role', 'TENANT')}
               className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 group ${
                 selectedRole === 'TENANT' 
                 ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                 : 'border-slate-100 hover:border-slate-200 text-slate-500'
               }`}
             >
                <User size={24} className={selectedRole === 'TENANT' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'} />
                <span className="text-xs font-black tracking-widest leading-none">TENANT</span>
             </button>
             <button
               type="button"
               onClick={() => setValue('role', 'LANDLORD')}
               className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 group ${
                 selectedRole === 'LANDLORD' 
                 ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                 : 'border-slate-100 hover:border-slate-200 text-slate-500'
               }`}
             >
                <UserCircle size={24} className={selectedRole === 'LANDLORD' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'} />
                <span className="text-xs font-black tracking-widest leading-none">LANDLORD</span>
             </button>
        </div>

        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. name@university.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-lg shadow-soft text-sm font-black bg-indigo-600 hover:bg-indigo-700"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
            <p className="text-[10px] text-center text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-widest">
                By signing up, you agree to our <a href="#" className="text-slate-900 underline">Terms of Service</a> and <a href="#" className="text-slate-900 underline">Privacy Policy</a>.
            </p>
        </div>
      </form>

      <p className="text-center text-sm font-bold text-slate-500">
        Already have an account?{' '}
        <button
          className="text-indigo-600 hover:text-indigo-700 transition-colors font-black"
          onClick={() => navigate('/login')}
        >
          Sign In
        </button>
      </p>

      <div className="flex justify-center gap-6 text-[11px] font-bold text-slate-400">
        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
        <a href="#" className="hover:text-slate-600">Terms of Service</a>
        <a href="#" className="hover:text-slate-600">Support</a>
      </div>
    </div>
  );
};
