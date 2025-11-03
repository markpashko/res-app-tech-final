import React, { useState } from 'react';
import { InspectionItemInfo, InspectionItemData } from '../types';
// FIX: Removed unused and non-existent UploadIcon import.
import { CameraIcon, VideoIcon, DocumentIcon } from './icons';

interface InspectionItemProps {
  sectionId: string;
  item: InspectionItemInfo;
  data?: InspectionItemData;
  onDataChange: (sectionId: string, itemId: string, field: string, value: string | File | null) => void;
}

// FIX: Added optional capture prop to FileInputButton to allow camera access.
const FileInputButton: React.FC<{
  id: string;
  label: string;
  icon: React.ReactNode;
  accept: string;
  fileName: string | null;
  onChange: (file: File | null) => void;
  // FIX: The 'capture' attribute type was corrected to align with HTML standards for file inputs, resolving the TypeScript error.
  capture?: 'user' | 'environment';
}> = ({ id, label, icon, accept, fileName, onChange, capture }) => (
  <div className="flex-1">
    <label
      htmlFor={id}
      className="w-full flex flex-col items-center justify-center p-3 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
    >
      {icon}
      <span className="mt-2 text-sm font-medium text-slate-600 text-center">{label}</span>
      {fileName && <span className="mt-1 text-xs text-blue-600 truncate max-w-full">{fileName}</span>}
    </label>
    <input
      id={id}
      type="file"
      className="hidden"
      accept={accept}
      capture={capture}
      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
    />
  </div>
);

const InspectionItem: React.FC<InspectionItemProps> = ({ sectionId, item, data, onDataChange }) => {
  const [comment, setComment] = useState(data?.comment || '');

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  
  const handleCommentBlur = () => {
     onDataChange(sectionId, item.id, 'comment', comment);
  };

  const handleFileChange = (field: keyof InspectionItemData, file: File | null) => {
    onDataChange(sectionId, item.id, field, file);
  };

  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
      <h3 className="font-semibold text-lg text-slate-700">{item.title}</h3>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        <FileInputButton
          id={`photo-${item.id}`}
          label="Take Photo"
          icon={<CameraIcon />}
          accept="image/*"
          capture="environment"
          fileName={data?.photo?.name || null}
          onChange={(file) => handleFileChange('photo', file)}
        />
        <FileInputButton
          id={`video-${item.id}`}
          label="Upload Video"
          icon={<VideoIcon />}
          accept="video/*"
          capture="environment"
          fileName={data?.video?.name || null}
          onChange={(file) => handleFileChange('video', file)}
        />
        <FileInputButton
          id={`doc-${item.id}`}
          label="Add Document"
          icon={<DocumentIcon />}
          accept=".pdf,.doc,.docx,.txt"
          fileName={data?.document?.name || null}
          onChange={(file) => handleFileChange('document', file)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor={`comment-${item.id}`} className="block text-sm font-medium text-slate-700 mb-1">
          Add Comment
        </label>
        <textarea
          id={`comment-${item.id}`}
          rows={3}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          placeholder="e.g., 'Minor leak observed...'"
          value={comment}
          onChange={handleCommentChange}
          onBlur={handleCommentBlur}
        ></textarea>
      </div>
    </div>
  );
};

export default InspectionItem;