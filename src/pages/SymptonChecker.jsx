import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Check, Activity } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';

const COMMON_SYMPTOMS = [
  "fever", "headache", "cough", "soreThroat", 
  "fatigue", "nausea", "dizziness", "bodyAche",
  "runnyNose", "shortnessOfBreath", "chestPain", "chills",
  "vomiting", "diarrhea", "rash", "abdominalPain", "jointPain",
  "stomachAche", "musclePain", "lossOfSmell", "lossOfTaste", "soreEyes"
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;

    const getDiagnosis = (symptoms) => {
      const lowercasedSymptoms = symptoms.map(s => s.toLowerCase());
      if (lowercasedSymptoms.includes('fever') && lowercasedSymptoms.includes('cough')) {
        return { diagnosis: "Common Cold", severity: "Mild", confidence: "90%" };
      }
      if (lowercasedSymptoms.includes('nausea') && lowercasedSymptoms.includes('vomiting')) {
        return { diagnosis: "Gastroenteritis", severity: "Moderate", confidence: "88%" };
      }
      if (lowercasedSymptoms.includes('headache') && lowercasedSymptoms.includes('dizziness')) {
        return { diagnosis: "Dehydration", severity: "Mild", confidence: "80%" };
      }
      if (lowercasedSymptoms.includes('fever') && lowercasedSymptoms.includes('bodyache')) {
        return { diagnosis: "Viral Fever", severity: "Moderate", confidence: "85%" };
      }
      if (lowercasedSymptoms.includes('rash')) {
          return { diagnosis: "Allergic Reaction", severity: "Mild", confidence: "75%" };
      }
      return { diagnosis: "General Malaise", severity: "Mild", confidence: "70%" };
    };

    const { diagnosis } = getDiagnosis(selectedSymptoms);

    const newReport = {
      id: `report_${Date.now()}`,
      symptoms: selectedSymptoms.map(s => getTranslation(s)),
      diagnosis: diagnosis,
      created_date: new Date().toISOString()
    };

    const reports = JSON.parse(localStorage.getItem('adam_health_history') || '[]');
    reports.push(newReport);
    localStorage.setItem('adam_health_history', JSON.stringify(reports));

    navigate(`/result/${newReport.id}`, { 
      state: { 
        symptoms: selectedSymptoms.map(s => getTranslation(s))
      } 
    });
  };

  const filteredSymptoms = COMMON_SYMPTOMS.filter(s => 
    getTranslation(s).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{getTranslation('symptomChecker')}</h1>
        <p className="text-slate-500 mt-2">{getTranslation('symptomCheckerDesc')}</p>
      </div>

      {/* Symptom Selection Section */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={getTranslation('searchSymptoms')}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`
                  relative p-4 rounded-lg border text-left transition-all
                  ${selectedSymptoms.includes(symptom) 
                    ? 'border-teal-500 bg-teal-50 text-teal-700' 
                    : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                  }
                `}
              >
                <span className="font-medium">{getTranslation(symptom)}</span>
                {selectedSymptoms.includes(symptom) && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-teal-600" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredSymptoms.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              {getTranslation('noSymptomsFound')} "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <span className="font-medium text-slate-700">{selectedSymptoms.length}</span>
          <span className="text-slate-500"> {getTranslation('symptomsSelected')}</span>
        </div>
        <Button 
          size="lg" 
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0}
        >
          <Activity className="h-4 w-4" />
          {getTranslation('analyzeSymptoms')}
        </Button>
      </div>
    </div>
  );
}