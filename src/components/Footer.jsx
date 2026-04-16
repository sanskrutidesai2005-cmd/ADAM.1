import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-teal-600 mb-4">
            <div className="p-1.5 bg-teal-600 rounded-lg">
              <Heart className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-slate-900">ADAM</span>
          </div>
          <p className="text-slate-500 text-sm">
            Advanced Detection & Assistance for Medical Awareness
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/" className="hover:text-teal-600">Home</Link></li>
            <li><Link to="/symptoms" className="hover:text-teal-600">Check Symptoms</Link></li>
            <li><Link to="/emergency" className="hover:text-teal-600">Emergency Contacts</Link></li>
          </ul>
        </div>

        {/* Important Notice */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Important Notice</h3>
          <p className="text-sm text-slate-500">
            ADAM provides general health information only. Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
        © 2024 ADAM Health Assistant. Free for everyone.
      </div>
    </footer>
  );
}
