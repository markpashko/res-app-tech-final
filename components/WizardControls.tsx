import React from 'react';

interface WizardControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isSummaryStep: boolean;
  reportGenerated: boolean;
}

const WizardControls: React.FC<WizardControlsProps> = ({ currentStep, totalSteps, onPrev, onNext, isSummaryStep, reportGenerated }) => {
  const isFirstStep = currentStep === 0;

  if (isSummaryStep || reportGenerated) {
    return null; // Controls are on the summary screen itself or report is done
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg">
      <div className="container mx-auto p-4 max-w-2xl flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className="px-6 py-2 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default WizardControls;