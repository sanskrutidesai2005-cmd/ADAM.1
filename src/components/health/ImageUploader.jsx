import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ImageUploader({ imageUrl, onImageUpload, onImageRemove }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await base44.integrations.Core.UploadFile({ file });
      onImageUpload(result.file_url);
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        Upload Image (Optional - for skin issues)
      </label>

      {!imageUrl ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="p-3 bg-slate-100 rounded-full">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-sky-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-slate-200">
          <img 
            src={imageUrl} 
            alt="Uploaded symptom" 
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => onImageRemove()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
