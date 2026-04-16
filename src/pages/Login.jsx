import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(async () => {
      if (email && password) {
        // Mock successful login
        // In a real app, we would validate credentials against a backend
        localStorage.setItem('adam_auth_token', 'mock_token_123');
        navigate('/');
      } else {
        setError('Please enter both email and password.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-teal-600 rounded-xl mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-slate-500">Sign in to access your personal health assistant</p>
        </div>

        <Card className="border-0 shadow-xl ring-1 ring-slate-900/5">
          <CardHeader>
            <CardTitle className="text-lg">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
