import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">User Not Registered</h2>
      <p className="text-slate-600 mb-6">
        We couldn't find your profile. Please sign up or complete your profile to continue.
      </p>
      <Button asChild>
        <Link to="/profile">Go to Profile</Link>
      </Button>
    </div>
  );
}
