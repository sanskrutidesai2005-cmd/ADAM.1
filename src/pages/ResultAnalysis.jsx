import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/translations';
import { AlertTriangle, CheckCircle, ArrowLeft, Pill, Thermometer } from 'lucide-react';

export default function ResultAnalysis() {
  const { id } = useParams();
  const location = useLocation();
  const { symptoms } = location.state || { symptoms: [getTranslation('fever'), getTranslation('headache')] };

  const getDiagnosis = (symptoms) => {
    const lowercasedSymptoms = symptoms.map(s => s.toLowerCase());

    if (lowercasedSymptoms.includes(getTranslation('fever').toLowerCase()) && lowercasedSymptoms.includes(getTranslation('cough').toLowerCase())) {
      return { diagnosis: "Common Cold", severity: "Mild", confidence: "90%" };
    }
    if (lowercasedSymptoms.includes(getTranslation('nausea').toLowerCase()) && lowercasedSymptoms.includes(getTranslation('vomiting').toLowerCase())) {
      return { diagnosis: "Gastroenteritis", severity: "Moderate", confidence: "88%" };
    }
    if (lowercasedSymptoms.includes(getTranslation('headache').toLowerCase()) && lowercasedSymptoms.includes(getTranslation('dizziness').toLowerCase())) {
      return { diagnosis: "Dehydration", severity: "Mild", confidence: "80%" };
    }
    if (lowercasedSymptoms.includes(getTranslation('fever').toLowerCase()) && lowercasedSymptoms.includes(getTranslation('bodyAche').toLowerCase())) {
      return { diagnosis: "Viral Fever", severity: "Moderate", confidence: "85%" };
    }
    if (lowercasedSymptoms.includes(getTranslation('rash').toLowerCase())) {
        return { diagnosis: "Allergic Reaction", severity: "Mild", confidence: "75%" };
    }

    return { diagnosis: "General Malaise", severity: "Mild", confidence: "70%" };
  };

  const { diagnosis, severity, confidence } = getDiagnosis(symptoms);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/symptoms">
        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-teal-600">
          <ArrowLeft className="h-4 w-4" />
          {getTranslation('backToSymptomChecker')}
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Diagnosis Card */}
          <Card className="border-t-4 border-t-teal-500 shadow-md">
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{getTranslation('preliminaryDiagnosis')}</div>
              <CardTitle className="text-3xl text-slate-900">{diagnosis}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  {getTranslation('severity')}: {severity}
                </div>
                <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                  {getTranslation('confidence')}: {confidence}
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed">
                {getTranslation('basedOnSymptoms')} <span className="font-semibold">{symptoms.join(', ')}</span>, 
                {getTranslation('viralInfectionLikelihood')}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {getTranslation('recommendedActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">1</div>
                <div>
                  <h4 className="font-medium text-slate-900">{getTranslation('restAndHydration')}</h4>
                  <p className="text-sm text-slate-600">{getTranslation('restAndHydrationDesc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">2</div>
                <div>
                  <h4 className="font-medium text-slate-900">{getTranslation('monitorTemperature')}</h4>
                  <p className="text-sm text-slate-600">{getTranslation('monitorTemperatureDesc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">3</div>
                <div>
                  <h4 className="font-medium text-slate-900">{getTranslation('otcMedication')}</h4>
                  <p className="text-sm text-slate-600">{getTranslation('otcMedicationDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Warning Card */}
          <Card className="bg-red-50 border-red-100">
            <CardHeader>
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {getTranslation('whenToSeeDoctor')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 text-sm space-y-2">
              <p>• {getTranslation('warningFever')}</p>
              <p>• {getTranslation('warningBreathing')}</p>
              <p>• {getTranslation('warningRash')}</p>
              <p>• {getTranslation('warningFluids')}</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{getTranslation('nextSteps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/medicines">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Pill className="h-4 w-4" />
                  {getTranslation('setMedicineReminder')}
                </Button>
              </Link>
              <Link to="/emergency">
                <Button variant="outline" className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50">
                  <Thermometer className="h-4 w-4" />
                  {getTranslation('findNearbyClinics')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
