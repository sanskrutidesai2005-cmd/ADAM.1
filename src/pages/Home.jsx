import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { 
  Stethoscope, 
  User, 
  Clock, 
  Phone, 
  ChevronRight,
  Heart,
  FileText,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const profiles = await base44.entities.UserProfile.filter({ user_email: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const reports = await base44.entities.SymptomReport.filter(
        { user_email: currentUser.email },
        '-created_date',
        2
      );
      setRecentReports(reports);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const quickActions = [
    {
      title: getTranslation('checkSymptoms'),
      description: getTranslation('checkSymptomsDesc'),
      icon: Stethoscope,
      link: '/symptoms',
      color: 'bg-sky-600',
    },
    {
      title: getTranslation('medicineTracker'),
      description: getTranslation('medicineTrackerDesc'),
      icon: Clock,
      link: '/medicines',
      color: 'bg-emerald-600',
    },
    {
      title: getTranslation('myProfile'),
      description: getTranslation('myProfileDesc'),
      icon: User,
      link: '/profile',
      color: 'bg-purple-600',
    },
    {
      title: getTranslation('emergencyContacts'),
      description: getTranslation('emergencyContactsDesc'),
      icon: Phone,
      link: '/emergency',
      color: 'bg-red-600',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-4">
        <div className="mx-auto w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center shadow-lg shadow-sky-200">
          <Heart className="h-8 w-8 text-white fill-current" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">ADAM</h1>
          <p className="text-slate-500 mt-2">{getTranslation('ailmentDetection')}</p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Welcome Card */}
      <Card className="border-l-4 border-l-sky-500 overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl border-2 border-white shadow-sm">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{getTranslation('welcome')}, {user?.name || 'User'}</h2>
            <p className="text-slate-500 text-sm">
              {profile ? `${profile.age} years • ${profile.gender || 'Unknown'}` : 'Complete your profile'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-sky-600" />
          {getTranslation('quickActions')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.link} className="block group">
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${action.color} text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Symptom Checks */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-1 bg-sky-500 rounded-full"></div>
            <h3 className="font-semibold text-lg text-slate-900">Recent Symptom Checks</h3>
          </div>
          
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div key={report.id} className="group p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{report.diagnosis || 'Symptom Check'}</h4>
                      <p className="text-sm text-slate-500 mt-1">3 possible conditions identified</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(report.created_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No recent checks found
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/history" className="text-sm font-medium text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
              View all history <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How ADAM Works */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 text-white shadow-lg shadow-teal-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">How ADAM Works</h3>
            <ul className="space-y-3">
              {[
                'Enter your symptoms or upload an image',
                'Get 2-3 possible health conditions',
                'Receive age-appropriate medicine suggestions',
                'Set medicine reminders',
                'Always consult a doctor for proper diagnosis'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-teal-50 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-teal-200 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
