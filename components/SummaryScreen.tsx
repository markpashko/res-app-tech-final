import React from 'react';
import { AIBrainIcon, DocumentScanIcon, EstimateIcon, ReportIcon, SpinnerIcon } from './icons';

interface SummaryScreenProps {
  onGenerateReport: () => void;
  isGenerating: boolean;
  lastInspectionId: string | null;
  onAiAnalysis: (inspectionId: string) => void;
  isAnalyzing: boolean;
  onStartNew: () => void;
}

const ActionButton: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}> = ({ label, icon, onClick, disabled = false, isLoading = false }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="w-full flex items-center p-4 text-left bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="w-6 h-6 flex items-center justify-center">
        {isLoading ? <SpinnerIcon color="text-slate-500" /> : icon}
    </div>
    <span className="ml-4 font-semibold text-slate-700">{label}</span>
  </button>
);

const SummaryScreen: React.FC<SummaryScreenProps> = ({ 
    onGenerateReport, 
    isGenerating,
    lastInspectionId,
    onAiAnalysis,
    isAnalyzing,
    onStartNew,
}) => {
  const handleAiClick = () => {
    if (lastInspectionId) {
      onAiAnalysis(lastInspectionId);
    }
  };
    
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-slate-800">
        {lastInspectionId ? 'Report Saved' : 'Inspection Complete'}
      </h2>
      <p className="mt-2 text-slate-600">
        {lastInspectionId 
         ? "Your report has been saved. You can now run AI analysis or start a new inspection."
         : "You have completed all sections. You can now generate your report."
        }
      </p>
      
      <div className="mt-8 space-y-4">
        <ActionButton 
          label="Identify with AI" 
          icon={<AIBrainIcon />} 
          onClick={handleAiClick}
          disabled={!lastInspectionId || isAnalyzing}
          isLoading={isAnalyzing}
        />
        <ActionButton 
          label="Analyze Documents" 
          icon={<DocumentScanIcon />} 
          onClick={handleAiClick}
          disabled={!lastInspectionId || isAnalyzing}
          isLoading={isAnalyzing}
        />
        <ActionButton 
          label="Estimate Market Value" 
          icon={<EstimateIcon />} 
          onClick={handleAiClick}
          disabled={!lastInspectionId || isAnalyzing}
          isLoading={isAnalyzing}
        />
      </div>
      
      <div className="mt-10 flex flex-col items-center space-y-4">
        <button
          onClick={onGenerateReport}
          disabled={isGenerating || !!lastInspectionId}
          className="w-full max-w-xs flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? <SpinnerIcon /> : <ReportIcon />}
          <span className="ml-3">
            {isGenerating ? 'Generating...' : (lastInspectionId ? 'Report Saved' : 'Generate Report')}
          </span>
        </button>

        {lastInspectionId && (
            <button
                onClick={onStartNew}
                className="w-full max-w-xs px-6 py-2 text-base font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Start New Inspection
            </button>
        )}
      </div>
    </div>
  );
};

export default SummaryScreen;