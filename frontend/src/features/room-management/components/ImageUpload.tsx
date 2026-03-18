import { UseFormReturn } from 'react-hook-form';
import type { RoomFormPayload } from '@/entities/room';
import { useState } from 'react';

interface ImageUploadProps {
  form: UseFormReturn<RoomFormPayload>;
}

export function ImageUpload({ form }: ImageUploadProps) {
  const images = form.watch('images') || [];
  const [isDragging, setIsDragging] = useState(false);

  // In a real app we'd upload this file to S3/Cloudinary and get a URL back.
  // We'll mock it by generating a local object URL to display the preview immediately.
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    form.setValue('images', [...images, ...newImages], { shouldValidate: true, shouldDirty: true });
  };

  const removeImage = (indexToRemove: number) => {
    form.setValue('images', images.filter((_, idx) => idx !== indexToRemove), { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Room Photos</label>
      
      {/* Upload Zone */}
      <div 
        className={`relative flex items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-indigo-100 p-3 text-indigo-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4">
          {images.map((url, idx) => (
            <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <img src={url} alt={`Room upload ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="rounded-full bg-white/10 p-1.5 text-white hover:bg-red-500 transition-colors"
                  title="Remove image"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
