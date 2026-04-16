import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { User, Mail, Activity, Droplet, Edit2, Save, X } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
              <Save className="h-4 w-4" /> Save Changes
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
                Active Member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Age</label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p className="text-lg font-medium text-slate-900">{profile?.age || '--'} years</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Gender</label>
              {isEditing ? (
                <select 
                  name="gender" 
                  value={formData.gender || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-lg font-medium text-slate-900">{profile?.gender || '--'}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 block mb-1">
                <Droplet className="h-3 w-3" /> Blood Type
              </label>
              {isEditing ? (
                <select 
                  name="blood_type" 
                  value={formData.blood_type || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
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
                <Activity className="h-3 w-3" /> Status
              </label>
              <p className="text-lg font-medium text-green-600">Healthy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Health Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
              {isEditing ? (
                 <input 
                  type="text" 
                  name="blood_pressure" 
                  value={formData.blood_pressure || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 text-center font-bold text-lg mb-1"
                  placeholder="120/80"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{profile?.blood_pressure || '--'}</div>
              )}
              <div className="text-xs text-slate-500 uppercase mt-1">Blood Pressure</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
               {isEditing ? (
                 <input 
                  type="text" 
                  name="heart_rate" 
                  value={formData.heart_rate || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 text-center font-bold text-lg mb-1"
                  placeholder="72 bpm"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{profile?.heart_rate || '--'}</div>
              )}
              <div className="text-xs text-slate-500 uppercase mt-1">Heart Rate</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
               {isEditing ? (
                 <input 
                  type="text" 
                  name="weight" 
                  value={formData.weight || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 text-center font-bold text-lg mb-1"
                  placeholder="65 kg"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{profile?.weight || '--'}</div>
              )}
              <div className="text-xs text-slate-500 uppercase mt-1">Weight</div>
            </div>
             <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
               {isEditing ? (
                 <input 
                  type="text" 
                  name="height" 
                  value={formData.height || ''} 
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 text-center font-bold text-lg mb-1"
                  placeholder="165 cm"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{profile?.height || '--'}</div>
              )}
              <div className="text-xs text-slate-500 uppercase mt-1">Height</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
