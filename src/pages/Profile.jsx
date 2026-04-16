import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';
import { User, Mail, Activity, Droplet, Edit2, Save, X, Thermometer, Wind, Scale, FileText } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      const p = await base44.entities.UserProfile.filter({ user_email: u.email });
      if (p.length > 0) {
        setProfile(p[0]);
        setFormData(p[0]);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await base44.entities.UserProfile.update(profile.id, formData);
      setProfile(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const calculateBmi = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return '--';
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">{getTranslation('myProfileTitle')}</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> {getTranslation('editProfile')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <X className="h-4 w-4" /> {getTranslation('cancel')}
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
              <Save className="h-4 w-4" /> {getTranslation('saveChanges')}
            </Button>
          </div>
        )}
      </div>
      
      <Card className="overflow-hidden">
        <div className="bg-teal-600 h-32 w-full"></div>
        <CardContent className="relative pt-16 pb-8 px-8">
          <div className="absolute -top-12 left-8 h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center bg-slate-100">
            <User className="h-12 w-12 text-slate-400" />
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" /> {user?.email}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                {getTranslation('activeMember')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{getTranslation('age')}</label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p className="text-lg font-medium text-slate-900">{profile?.age || '--'} {getTranslation('years')}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{getTranslation('gender')}</label>
              {isEditing ? (
                <select 
                  name="gender" 
                  value={formData.gender || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">{getTranslation('select')}</option>
                  <option value="Male">{getTranslation('male')}</option>
                  <option value="Female">{getTranslation('female')}</option>
                  <option value="Other">{getTranslation('other')}</option>
                </select>
              ) : (
                <p className="text-lg font-medium text-slate-900">{getTranslation(profile?.gender?.toLowerCase()) || profile?.gender || '--'}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 block mb-1">
                <Droplet className="h-3 w-3" /> {getTranslation('bloodType')}
              </label>
              {isEditing ? (
                <select 
                  name="blood_type" 
                  value={formData.blood_type || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">{getTranslation('select')}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-lg font-medium text-slate-900">{profile?.blood_type || '--'}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Activity className="h-3 w-3" /> {getTranslation('status')}
              </label>
              <p className="text-lg font-medium text-green-600">{getTranslation('healthy')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getTranslation('healthStats')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox isEditing={isEditing} name="blood_pressure" value={formData.blood_pressure} onChange={handleInputChange} label={getTranslation('bloodPressure')} placeholder="120/80" />
            <StatBox isEditing={isEditing} name="heart_rate" value={formData.heart_rate} onChange={handleInputChange} label={getTranslation('heartRate')} placeholder="72 bpm" />
            <StatBox isEditing={isEditing} name="weight" value={formData.weight} onChange={handleInputChange} label={getTranslation('weight')} placeholder="65 kg" />
            <StatBox isEditing={isEditing} name="height" value={formData.height} onChange={handleInputChange} label={getTranslation('height')} placeholder="165 cm" />
            <StatBox isEditing={isEditing} name="temperature" value={formData.temperature} onChange={handleInputChange} label={getTranslation('bodyTemperature')} placeholder="98.6°F" />
            <StatBox isEditing={isEditing} name="spo2" value={formData.spo2} onChange={handleInputChange} label={getTranslation('spo2')} placeholder="98%" />
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl font-bold text-slate-900">{calculateBmi()}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">BMI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Patient History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              name="history"
              value={formData.history || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows="4"
              placeholder="e.g., Allergic to Penicillin, History of Asthma"
            ></textarea>
          ) : (
            <p className="text-slate-700 whitespace-pre-wrap">{profile?.history || 'No patient history provided.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const StatBox = ({ isEditing, name, value, onChange, label, placeholder }) => (
  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
    {isEditing ? (
      <input 
        type="text" 
        name={name} 
        value={value || ''} 
        onChange={onChange}
        className="w-full border rounded px-2 py-1 text-center font-bold text-lg mb-1"
        placeholder={placeholder}
      />
    ) : (
      <div className="text-2xl font-bold text-slate-900">{value || '--'}</div>
    )}
    <div className="text-xs text-slate-500 uppercase mt-1">{label}</div>
  </div>
);
