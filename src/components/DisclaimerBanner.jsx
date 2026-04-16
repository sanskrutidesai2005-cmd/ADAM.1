import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start gap-3 text-orange-800 text-sm">
      <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
      <p>
        <span className="font-bold text-orange-700">Important:</span> ADAM provides general health information only. This is NOT a medical diagnosis. Always consult a qualified doctor for proper medical advice and treatment.
      </p>
    </div>
  );
}
