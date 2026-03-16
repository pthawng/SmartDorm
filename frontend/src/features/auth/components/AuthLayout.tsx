import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, image }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Branding / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 z-10 bg-indigo-900/20" />
        <img
          src={image || "/assets/auth/branding_v2.jpg"}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg";
          }}
          alt="Modern Architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center p-16 lg:p-24 text-white w-full h-full bg-gradient-to-br from-indigo-900/40 via-transparent to-indigo-900/60">
          <div className="space-y-10 max-w-xl">
            <div 
              className="flex items-center gap-3 cursor-pointer group mb-2"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <span className="text-4xl font-black tracking-tighter">SmartDorm</span>
            </div>
            
            <div className="space-y-6">
                <h1 className="text-6xl font-black leading-[1.1] tracking-tightest drop-shadow-sm">
                The smarter way to <br/> manage your <br/> campus life.
                </h1>
                <p className="text-xl font-bold text-white/90 leading-relaxed max-w-md">
                Join thousands of residents enjoying seamless living experiences across global campuses.
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">SmartDorm</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">{title}</h2>
            <p className="text-lg font-medium text-slate-500 leading-relaxed">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
