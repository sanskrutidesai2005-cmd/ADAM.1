import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/translations';
import { Plus, Clock, Pill, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function MedicineTracker() {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const loadUserAndMeds = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      if (currentUser) {
        const stored = localStorage.getItem(`adam_medicines_${currentUser.email}`);
        if (stored) {
          setMedicines(JSON.parse(stored));
        } else {
          // Default medicines for first time
          const defaults = [
            { id: 1, name: "Paracetamol", dosage: "500mg", time: "09:00", taken: true },
            { id: 2, name: "Vitamin C", dosage: "1000mg", time: "13:00", taken: false },
          ];
          setMedicines(defaults);
          localStorage.setItem(`adam_medicines_${currentUser.email}`, JSON.stringify(defaults));
        }
      }
    };
    loadUserAndMeds();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });

  const saveToStorage = (updatedMeds) => {
    if (user) {
      localStorage.setItem(`adam_medicines_${user.email}`, JSON.stringify(updatedMeds));
    }
  };

  const toggleTaken = (id) => {
    const updated = medicines.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    );
    setMedicines(updated);
    saveToStorage(updated);
  };

  const deleteMedicine = (id) => {
    const updated = medicines.filter(med => med.id !== id);
    setMedicines(updated);
    saveToStorage(updated);
  };

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.time) return;
    
    const updated = [
      ...medicines,
      { id: Date.now(), ...newMed, taken: false }
    ];
    setMedicines(updated);
    saveToStorage(updated);
    setNewMed({ name: '', dosage: '', time: '' });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{getTranslation('medicineTitle')}</h1>
          <p className="text-slate-500 mt-1">{getTranslation('medicineSubtitle')}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4" />
          {getTranslation('addMedicine')}
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-slate-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-lg">{getTranslation('addNewMedicine')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMedicine} className="grid md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-1 block">{getTranslation('medicineName')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aspirin"
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                  value={newMed.name}
                  onChange={e => setNewMed({...newMed, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">{getTranslation('dosage')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. 500mg"
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                  value={newMed.dosage}
                  onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">{getTranslation('time')}</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                  value={newMed.time}
                  onChange={e => setNewMed({...newMed, time: e.target.value})}
                  required
                />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>{getTranslation('cancel')}</Button>
                <Button type="submit" className="bg-teal-600 text-white">{getTranslation('saveMedicine')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {medicines.map((med) => (
          <div 
            key={med.id} 
            className={`
              flex items-center justify-between p-4 rounded-lg border transition-all
              ${med.taken ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}
            `}
          >
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTaken(med.id)} className="focus:outline-none">
                {med.taken ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : (
                  <Circle className="h-8 w-8 text-slate-300 hover:text-teal-500" />
                )}
              </button>
              <div>
                <h3 className={`font-semibold text-lg ${med.taken ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {med.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Pill className="h-3 w-3" /> {med.dosage}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {med.time}
                  </span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => deleteMedicine(med.id)} className="text-slate-400 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {medicines.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            {getTranslation('noMedicines')}
          </div>
        )}
      </div>
    </div>
  );
}
