import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, ArrowLeft, Pill, Thermometer } from 'lucide-react';

export default function ResultAnalysis() {
  const { id } = useParams();
  const location = useLocation();
  const symptoms = location.state?.symptoms || ['Fever', 'Headache']; // Fallback for demo

  // Mock Analysis Logic
  const diagnosis = "Viral Fever";
  const severity = "Moderate";
  const confidence = "85%";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/symptoms">
        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-teal-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Symptom Checker
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Diagnosis Card */}
          <Card className="border-t-4 border-t-teal-500 shadow-md">
            <CardHeader className="pb-2">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Preliminary Diagnosis</div>
              <CardTitle className="text-3xl text-slate-900">{diagnosis}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  Severity: {severity}
                </div>
                <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                  Confidence: {confidence}
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed">
                Based on your reported symptoms of <span className="font-semibold">{symptoms.join(', ')}</span>, 
                our analysis suggests a high likelihood of a viral infection. This is common and usually resolves 
                with rest and home care, but monitor your temperature closely.
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">1</div>
                <div>
                  <h4 className="font-medium text-slate-900">Rest and Hydration</h4>
                  <p className="text-sm text-slate-600">Ensure you get at least 8 hours of sleep and drink plenty of water.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">2</div>
                <div>
                  <h4 className="font-medium text-slate-900">Monitor Temperature</h4>
                  <p className="text-sm text-slate-600">Check your temperature every 4-6 hours. If it exceeds 102°F, consult a doctor.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">3</div>
                <div>
                  <h4 className="font-medium text-slate-900">Over-the-counter Medication</h4>
                  <p className="text-sm text-slate-600">You may take Paracetamol for fever relief as directed on the package.</p>
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
                When to see a Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 text-sm space-y-2">
              <p>• If fever persists for more than 3 days</p>
              <p>• If you experience difficulty breathing</p>
              <p>• If you develop a severe rash</p>
              <p>• If you are unable to keep fluids down</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/medicines">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Pill className="h-4 w-4" />
                  Set Medicine Reminder
                </Button>
              </Link>
              <Link to="/emergency">
                <Button variant="outline" className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50">
                  <Thermometer className="h-4 w-4" />
                  Find Nearby Clinics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
