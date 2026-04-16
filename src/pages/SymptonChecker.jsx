import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Check, Activity, Upload, Image } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const COMMON_SYMPTOMS = [
  "Fever", "Headache", "Cough", "Sore Throat", 
  "Fatigue", "Nausea", "Dizziness", "Body Ache",
  "Runny Nose", "Shortness of Breath", "Chest Pain", "Chills"
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setUploadedImage(result.file_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !uploadedImage) return;
    // In a real app, we would send this to the backend
    navigate('/result/report_new', { 
      state: { 
        symptoms: selectedSymptoms,
        image: uploadedImage
      } 
    });
  };

  const filteredSymptoms = COMMON_SYMPTOMS.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Symptom Checker</h1>
        <p className="text-slate-500 mt-2">Select your symptoms or upload an image to get a preliminary health analysis</p>
      </div>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="h-5 w-5" />
            Upload Image (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
            {uploadedImage ? (
              <div className="space-y-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded symptom" 
                  className="max-w-xs max-h-48 mx-auto rounded-lg shadow-md"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedImage(null)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-600 mb-2">Upload a photo of your symptoms</p>
                  <p className="text-sm text-slate-500">Supports JPG, PNG, GIF up to 10MB</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose File
                      </>
                    )}
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Symptom Selection Section */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search symptoms..."
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
                <span className="font-medium">{symptom}</span>
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
              No symptoms found matching "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <span className="font-medium text-slate-700">{selectedSymptoms.length}</span>
          <span className="text-slate-500"> symptoms selected</span>
          {uploadedImage && <span className="text-slate-500"> • 1 image uploaded</span>}
        </div>
        <Button 
          size="lg" 
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0 && !uploadedImage}
        >
          <Activity className="h-4 w-4" />
          Analyze Symptoms
        </Button>
      </div>
    </div>
  );
}